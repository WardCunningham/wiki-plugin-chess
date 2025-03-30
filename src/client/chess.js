import { Chess, validateFen } from 'chess.js'
import { INPUT_EVENT_TYPE, COLOR, Chessboard, BORDER_TYPE } from 'cm-chessboard/src/Chessboard.js'
import { MARKER_TYPE, Markers } from 'cm-chessboard/src/extensions/markers/Markers.js'
import { PROMOTION_DIALOG_RESULT_TYPE, PromotionDialog } from 'cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js'
import { Accessibility } from 'cm-chessboard/src/extensions/accessibility/Accessibility.js'

const PLAYER_ICONS = {
  white: '♔',
  black: '♚'
};

const GAME_TYPE = {
  HUMAN_BOT: 'H-B',
  BOT_BOT: 'B-B',
  HUMAN_HUMAN: 'H-H'
};

let mode = 'GAME' // A global variable to keep track of the mode of the chess plugin, GAME is assumed by default.

if (typeof window !== 'undefined' && window !== null) {
  if (!window.plugins.chess) {
    window.plugins.chess = { emit, bind }
    if (typeof window.chessListener !== 'undefined' || window.chessListener == null) {
      console.log('**** Adding chess listener')
      window.chessListener = chessListener
      window.addEventListener('message', chessListener)
    }
  }
}

function emit($item, item) {
  // append css files to head
  ;['chessboard', 'markers', 'promotion-dialog'].forEach(name => {
    if (
      ![...document.styleSheets]
        .filter(e => e.ownerNode.hasAttribute('href'))
        .filter(e => e.href.endsWith(`/plugins/chess/${name}.css`)).length
    ) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `/plugins/chess/${name}.css`
      link.type = 'text/css'
      document.getElementsByTagName('head')[0].appendChild(link)
    } else {
      // console.log(`already have ${name} style`)
    }
  })

  return $item.append(message('loading board...'))
}

function message(text) {
  return `
    <div class="table" data-item="table" style="width:98%; background-color:#eee;">
      <div style="width:80%; padding:8px; color:gray; background-color:#eee; margin:0 auto; text-align:center">
        <i>${text}</i>
      </div>
    </div>
  `
}

async function bind($item, item) {
  try {
    const chess = new Chess()
    let format = await determineFormat(item)
    let position, valid, gameInfo = null

    switch (format) {
      case 'FIGURINE':
        valid = validateFen(figurineToFEN(item.text))
        if (valid) {
          position = figurineToFEN(item.text)
          mode = 'POSITION'
        } else {
          trouble('Invalid figurine notation', item.text)
          mode = 'POSITION'
        }
        break
      case 'FEN':
        valid = validateFen(item.text)
        if (valid.ok) {
          position = item.text
          mode = 'POSITION'
        } else {
          trouble('Invalid FEN notation', item.text)
          mode = 'POSITION'
        }
        break
      case 'PGN':
        try {
          chess.loadPgn(item.text)
          let PGN = chess.pgn()
          gameInfo = decodePGN(PGN);
          position = chess.fen()
          mode = 'GAME'
          console.log({ PGN, position, gameInfo })
        } catch (error) {
          console.error('Error loading PGN:', error)
          trouble('Invalid PGN notation', item.text)
          mode = 'POSITION'
        }
        break
      case 'UNKNOWN':
        console.log('Unknown format, loading a new game')
        position = chess.fen()
        mode = 'GAME'
        break
    }

    const tableTime = Date.now()
    $item.find('.table').html(`
      <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
        <div class="chess-container" style="border: 1px solid #333; ">
          <button id="flip-${tableTime}" class="btn btn-sm" style="position: absolute; top: 10px; right: 10px;">
            Flip Board
          </button>
          <div id="player-top-${tableTime}" class="player-info" style="width: 400px; margin: 10px 0;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="piece-icon" style="font-size: 24px;"></span>
              <div style="flex-grow: 1; display: flex; gap: 10px;">
                <input type="text" class="form-control player-name" data-color=""
                  oninput="this.nextElementSibling.style.display = this.value ? 'none' : 'block'">
                <button class="btn btn-sm sit-button" style="display: none;">Sit</button>
              </div>
            </div>
          </div>
          <div id="board-${tableTime}" class="board board-large nosort" style="width: 400px"></div>
          <div id="player-bottom-${tableTime}" class="player-info" style="width: 400px; margin: 10px 0;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="piece-icon" style="font-size: 24px;"></span>
              <div style="flex-grow: 1; display: flex; gap: 10px;">
                <input type="text" class="form-control player-name" data-color=""
                  oninput="this.nextElementSibling.style.display = this.value ? 'none' : 'block'">
                <button class="btn btn-sm sit-button" style="display: none;">Sit</button>
              </div>
            </div>
          </div>
        </div>
        <p id="gameStatus"></p>
        ${gameInfo ? `
          <details class="pgn-details" style="width: 80%; margin: 10px 0;">
            <summary style="cursor: pointer; padding: 5px; background: #f5f5f5; border: 1px solid #ddd;">
              Game Information
            </summary>
            <div style="padding: 10px; border: 1px solid #ddd; border-top: none;">
              <div class="pgn-tags" style="display: grid; grid-template-columns: auto 1fr; gap: 5px; align-items: center;">
                ${Object.entries(gameInfo)
          .filter(([key]) => key !== 'moves')
          .map(([key, value]) => `
                    <label for="${key}-${tableTime}">${key}:</label>
                    <input id="${key}-${tableTime}" type="text" value="${value}" class="form-control">
                  `).join('')}
              </div>
            </div>
          </details>
        ` : ''}
        <button id="download-${tableTime}" class="btn btn-sm" style="margin-top: 10px;">
          Download ${mode === 'GAME' ? 'PGN' : 'FEN'}
        </button>
      </div>
    `)
    document.getElementById(`download-${tableTime}`).addEventListener('click', () => {
      const content = mode === 'GAME' ? chess.pgn() : chess.fen()
      const filename = mode === 'GAME' ? 'game.pgn' : 'position.fen'
      download(filename, content)
    })
    const board = new Chessboard(document.getElementById(`board-${tableTime}`), {
      position: chess.fen(),
      assetsUrl: '/plugins/chess/assets/',
      responsive: true, // resize the board automatically to the size of the context element
      style: { borderType: BORDER_TYPE.none, pieces: { file: 'pieces/staunty.svg' }, animationDuration: 300 },
      orientation: chess.turn() === 'w' ? COLOR.white : COLOR.black,
      extensions: [
        { class: Markers, props: { autoMarkers: MARKER_TYPE.square } },
        { class: PromotionDialog },
        { class: Accessibility, props: { visuallyHidden: true } },
      ],
    })
    board.setPosition(position, false)

    document.getElementById(`flip-${tableTime}`).addEventListener('click', () => {
      const newOrientation = board.getOrientation() === COLOR.white ? COLOR.black : COLOR.white;
      board.setOrientation(newOrientation);
      updatePlayerBoxes(newOrientation);
    });

    updateGameStatus()

    if (mode === 'POSITION') {
      board.disableMoveInput()
    } else if (mode === 'GAME') {
      console.log(`enabling movement for ${chess.turn()}`)
      board.enableMoveInput(inputHandler, chess.turn() === 'w' ? COLOR.white : COLOR.black)
    }

    function inputHandler(event) {
      if (event.type === INPUT_EVENT_TYPE.movingOverSquare) {
        return // ignore this event
      }

      if (event.type !== INPUT_EVENT_TYPE.moveInputFinished) {
        event.chessboard.removeLegalMovesMarkers()
      }

      if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
        // mark legal moves
        const moves = chess.moves({ square: event.squareFrom, verbose: true })
        event.chessboard.addLegalMovesMarkers(moves)
        return moves.length > 0
      } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        const move = { from: event.squareFrom, to: event.squareTo, promotion: event.promotion }
        try {
          const result = chess.move(move)
          event.chessboard.state.moveInputProcess.then(() => {
            // wait for the move input process has finished
            event.chessboard.setPosition(chess.fen(), true).then(() => {
              // update position, maybe castled and wait for animation has finished
              if (gameInfo.gameType !== GAME_TYPE.HUMAN_HUMAN) {
                makeEngineMove(event.chessboard)
              } else {
                console.log(`enabling movement for ${chess.turn()}`)
                event.chessboard.enableMoveInput(inputHandler, chess.turn() === 'w' ? COLOR.white : COLOR.black)
              }
            })
          })
          return result
        } catch {
          // promotion?
          let possibleMoves = chess.moves({ square: event.squareFrom, verbose: true })
          for (const possibleMove of possibleMoves) {
            if (possibleMove.promotion && possibleMove.to === event.squareTo) {
              event.chessboard.showPromotionDialog(event.squareTo, COLOR.white, result => {
                if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
                  chess.move({ from: event.squareFrom, to: event.squareTo, promotion: result.piece.charAt(1) })
                  event.chessboard.setPosition(chess.fen(), true)
                  if (gameInfo.gameType !== GAME_TYPE.HUMAN_HUMAN) {
                    makeEngineMove(event.chessboard)
                  } else {
                    console.log(`enabling movement for ${chess.turn()}`)
                    event.chessboard.enableMoveInput(inputHandler, chess.turn() === 'w' ? COLOR.white : COLOR.black)
                  }
                } else {
                  // promotion canceled
                  console.log(`enabling movement for ${chess.turn()}`)
                  event.chessboard.enableMoveInput(inputHandler, chess.turn() === 'w' ? COLOR.white : COLOR.black)
                  event.chessboard.setPosition(chess.fen(), true)
                }
              })
              return true
            }
          }
        }
      } else if (event.type === INPUT_EVENT_TYPE.moveInputFinished) {
        if (event.legalMove) {
          event.chessboard.disableMoveInput()
          return true
        }
      }
    }

    function makeEngineMove(chessboard) {
      // change this to make more random
      let seed = 71
      let random = function () {
        const x = Math.sin(seed++) * 10000
        return x - Math.floor(x)
        // return Math.random()
      }

      const possibleMoves = chess.moves({ verbose: true })
      if (possibleMoves.length > 0) {
        const randomIndex = Math.floor(random() * possibleMoves.length)
        const randomMove = possibleMoves[randomIndex]
        setTimeout(() => {
          // smoother with 500ms delay
          chess.move({ from: randomMove.from, to: randomMove.to })
          chessboard.setPosition(chess.fen(), true)
          console.log(`enabling movement for ${chess.turn()}`)
          chessboard.enableMoveInput(inputHandler, chess.turn() === 'w' ? COLOR.white : COLOR.black)
        }, 500)
      }
      updateGameStatus()
    }

    function updateGameStatus() {
      let statusHTML = ''

      if (chess.isCheckmate() && chess.turn() === 'w') {
        statusHTML = 'Game over: white is in checkmate. Black wins!'
      } else if (chess.isCheckmate() && chess.turn() === 'b') {
        statusHTML = 'Game over: black is in checkmate. White wins!'
      } else if (chess.isStalemate() && chess.turn() === 'w') {
        statusHTML = 'Game is drawn. White is stalemated.'
      } else if (chess.isStalemate() && chess.turn() === 'b') {
        statusHTML = 'Game is drawn. Black is stalemated.'
      } else if (chess.isThreefoldRepetition()) {
        statusHTML = 'Game is drawn by threefold repetition rule.'
      } else if (chess.isInsufficientMaterial()) {
        statusHTML = 'Game is drawn by insufficient material.'
      } else if (chess.isDraw()) {
        statusHTML = 'Game is drawn by fifty-move rule.'
      } else {
        statusHTML = 'Game is ongoing.'
      }

      document.getElementById('gameStatus').innerHTML = statusHTML
      if (chess.isGameOver()) console.log(chess.pgn())
    }

    function updatePlayerBoxes(orientation) {
      const topBox = document.getElementById(`player-top-${tableTime}`);
      const bottomBox = document.getElementById(`player-bottom-${tableTime}`);

      const blackBox = orientation === COLOR.white ? topBox : bottomBox;
      const whiteBox = orientation === COLOR.white ? bottomBox : topBox;

      // Update black player box
      blackBox.className = 'player-info black-player';
      blackBox.querySelector('.piece-icon').textContent = PLAYER_ICONS.black;
      const blackInput = blackBox.querySelector('.player-name');
      blackInput.value = gameInfo?.black || '';
      blackInput.dataset.color = 'black';
      const blackSitBtn = blackBox.querySelector('.sit-button');
      blackSitBtn.style.display = blackInput.value ? 'none' : 'block';
      blackSitBtn.dataset.color = 'black';

      // Update white player box
      whiteBox.className = 'player-info white-player';
      whiteBox.querySelector('.piece-icon').textContent = PLAYER_ICONS.white;
      const whiteInput = whiteBox.querySelector('.player-name');
      whiteInput.value = gameInfo?.white || '';
      whiteInput.dataset.color = 'white';
      const whiteSitBtn = whiteBox.querySelector('.sit-button');
      whiteSitBtn.style.display = whiteInput.value ? 'none' : 'block';
      whiteSitBtn.dataset.color = 'white';

      // Add sit button handlers
      const domain = window.location.host;
      [blackSitBtn, whiteSitBtn].forEach(btn => {
        btn.onclick = () => {
          const input = btn.previousElementSibling;
          input.value = domain;
          btn.style.display = 'none';
        };
      });
    }

    // board.addEventListener('orientation', (event) => {
    //   updatePlayerBoxes(event.orientation);
    // });

    updatePlayerBoxes(COLOR.white);
  } catch (err) {
    console.log({ err })
    $item.html(message(err.message))
  }
  $item.on('dblclick', () => {
    return wiki.textEditor($item, item)
  })

  $item.on('click', event => {
    // console.log("Clicked on item!")
    // const { target } = event
    // const { action } = (target.closest("a") || {}).dataset
    // if (!action) {
    //   return
    // }
    // event.stopPropagation()
    // event.preventDefault()
    // switch (action) {
    //   case "download":
    //     const slug = $item.parents('.page').attr('id')
    //     download(`${slug}.svg`, item.svg)
    //     break
    //   case "zoom":
    //     // wiki.dialog('Graphviz', item.svg)
    //     const pageKey = $item.parents('.page').data('key')
    //     const context = wiki.lineup.atKey(pageKey).getContext()
    //     const chessDialog = window.open('/plugins/chess/dialog/#', event.shiftKey ? '_blank' : 'chess', 'popup,height=600,width=800')
    //     if (chessDialog.location.pathname !== '/plugins/chess/dialog/') {
    //       chessDialog.addEventListener('load', (event) => {
    //         chessDialog.postMessage({ svg: item.svg, pageKey, context }, window.origin)
    //       })
    //     } else {
    //       chessDialog.postMessage({ svg: item.svg, pageKey, context }, window.origin)
    //     }
    //     break
    // }
  })

  function download(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

async function determineFormat(item) {
  if (/[\u2654-\u265F]/.test(item.text)) {
    return 'FIGURINE' // Matches any of ♔♕♖♗♘♙♚♛♜♝♞♟
  } else if ((item.text.match(/\//g) || []).length === 7) {
    return 'FEN' // FEN notation has exactly 7 slashes
  } else if (/\[([^\]]*)\]/g.test(item.text) || /^1\./.test(item.text.trim())) {
    return 'PGN' // Has square brackets OR starts with "1."
  } else {
    return 'UNKNOWN'
  }
}

function trouble(text, detail) {
  // console.log(text,detail)
  throw new Error(text + '\n' + detail)
}

// Converts figurine notation to FEN string
function figurineToFEN(positionText) {
  // Initialize 8x8 empty board
  const board = Array(8)
    .fill()
    .map(() => Array(8).fill('1'))

  // Map figurine pieces to FEN characters
  const pieceMap = {
    '♔': 'K',
    '♕': 'Q',
    '♖': 'R',
    '♗': 'B',
    '♘': 'N',
    '♙': 'P',
    '♚': 'k',
    '♛': 'q',
    '♜': 'r',
    '♝': 'b',
    '♞': 'n',
    '♟': 'p',
  }

  // Regular expression to match piece and position
  // Matches: ♔e1, ♟a7, etc.
  const pieceRegex = /([♔♕♖♗♘♙♚♛♜♝♞♟])([a-h][1-8])/g

  // Process each piece position
  const matches = [...positionText.matchAll(pieceRegex)]
  for (const [_, piece, position] of matches) {
    const file = position.charCodeAt(0) - 'a'.charCodeAt(0) // Convert a-h to 0-7
    const rank = 8 - parseInt(position[1]) // Convert 1-8 to 0-7 (inverted)
    board[rank][file] = pieceMap[piece] || '1'
  }

  // Convert board array to FEN string
  const fen = board
    .map(rank => {
      let rankString = ''
      let emptyCount = 0

      for (const square of rank) {
        if (square === '1') {
          emptyCount++
        } else {
          if (emptyCount > 0) {
            rankString += emptyCount
            emptyCount = 0
          }
          rankString += square
        }
      }

      if (emptyCount > 0) {
        rankString += emptyCount
      }

      return rankString
    })
    .join('/')

  // Add default FEN parameters
  return `${fen} w KQkq - 0 1` // just to make it valid, add a default turn and castling rights
}

function decodePGN(pgnText) {
  // Initialize default values
  const gameData = {
    event: '',
    site: '',
    date: '',
    round: '',
    white: '',
    black: '',
    result: '',
    moves: '',
  };

  // Extract tags using regex
  const tagPattern = /\[([^\s]+)\s+"([^"]*)"\]/g;
  let tagMatch;

  while ((tagMatch = tagPattern.exec(pgnText)) !== null) {
    const [_, tagName, tagValue] = tagMatch;

    // Handle common tags specially
    switch (tagName.toLowerCase()) {
      case 'event':
        gameData.event = tagValue;
        break;
      case 'site':
        gameData.site = tagValue;
        break;
      case 'date':
        gameData.date = tagValue;
        break;
      case 'round':
        gameData.round = tagValue;
        break;
      case 'white':
        gameData.white = tagValue;
        break;
      case 'black':
        gameData.black = tagValue;
        break;
      case 'result':
        gameData.result = tagValue;
        break;
      default:
        // Store other tags in the gameData object
        gameData[tagName] = tagValue;
    }
  }

  // Determine game type based on player names
  const isWhiteBot = gameData.white?.includes('BOT');
  const isBlackBot = gameData.black?.includes('BOT');

  gameData.gameType = isWhiteBot && isBlackBot ? GAME_TYPE.BOT_BOT :
    isWhiteBot || isBlackBot ? GAME_TYPE.HUMAN_BOT :
      GAME_TYPE.HUMAN_HUMAN;

  // Extract moves - everything after the last bracket
  let movesText = pgnText
    .replace(tagPattern, '')  // Remove all tags
    .replace(/\{[^}]*\}/g, '') // Remove comments
    .replace(/\([^)]*\)/g, '') // Remove variations/parentheses
    // .replace(/\d+\.\s*/g, '')  // Remove move numbers
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();

  movesText = movesText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '').trim();
  gameData.moves = movesText;

  return gameData;
}

function chessListener(event) {
  // only continue if event is from a chess popup.
  // events from a popup window will have an opener
  // ensure that the popup window is one of ours
  if (!event.source.opener || event.source.location.pathname !== '/plugins/chess/dialog/') {
    if (wiki.debug) {
      console.log('chessListener - not for us', { event })
    }
    return
  }
  if (wiki.debug) {
    console.log('chessListener - ours', { event })
  }

  const { data } = event
  const { action, keepLineup = false, pageKey = null, title = null, context = null } = data

  let $page = null
  if (pageKey != null) {
    $page = keepLineup ? null : $('.page').filter((i, el) => $(el).data('key') == pageKey)
  }

  switch (action) {
    case 'doInternalLink':
      wiki.pageHandler.context = context
      wiki.doInternalLink(title, $page)
      break
    default:
      console.error({ where: 'chessListener', message: 'unknown action', data })
  }
}

// Example export
const expand = text => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
}

export const chess = typeof window == 'undefined' ? { expand } : undefined

// TODO - try and get this to a point where a game can be played on wiki
//  MODES for the chess plugin: 1. A game 2. A position 3. editor 4. puzzle player
