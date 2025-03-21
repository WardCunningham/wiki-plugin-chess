import { Chess, validateFen } from 'chess.js'
import { INPUT_EVENT_TYPE, COLOR, Chessboard, BORDER_TYPE } from "cm-chessboard/src/Chessboard.js"
import { MARKER_TYPE, Markers } from "cm-chessboard/src/extensions/markers/Markers.js"
import { PROMOTION_DIALOG_RESULT_TYPE, PromotionDialog } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js"
import { Accessibility } from "cm-chessboard/src/extensions/accessibility/Accessibility.js"

let mode = 'game' // A global variable to keep track of the mode of the chess plugin, game is assumed by default.

if (typeof window !== "undefined" && window !== null) {
  if (!window.plugins.chess) {
    window.plugins.chess = { emit, bind }
    if (typeof window.chessListener !== "undefined" || window.chessListener == null) {
      console.log('**** Adding chess listener')
      window.chessListener = chessListener
      window.addEventListener("message", chessListener)
    }
  }
}

function emit($item, item) {
  // append css files to head
  ["chessboard", "markers", "promotion-dialog"].forEach((name) => {
    if (!([...document.styleSheets].filter((e) => e.ownerNode.hasAttribute('href'))
      .filter((e) => e.href.endsWith(`/plugins/chess/${name}.css`)).length)) {
      // console.log(`adding ${name} style`)
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
    <div class="table" data-item="table" style="width:98%">
      <div style="width:80%; padding:8px; color:gray; background-color:#eee; margin:0 auto; text-align:center">
        <i>${text}</i>
      </div>
    </div>
  `
}

async function bind($item, item) {
  try {
    const chess = new Chess()
    let PGN = await makePGN($item, cleanBeforeMakePGN(item))
    console.log({ PGN })
    const valid = validateFen(PGN)
    console.log({ valid })
    const tableTime = Date.now()
    $item.find('.table').html(`
      <div id="board-${tableTime}" class="board board-large nosort" style="width: 400px"></div>
      <p id="gameStatus"></p>
    `)
    const board = new Chessboard(document.getElementById(`board-${tableTime}`), {
      position: chess.fen(),
      assetsUrl: "/plugins/chess/assets/",
      responsive: true, // resize the board automatically to the size of the context element
      style: { borderType: BORDER_TYPE.none, pieces: { file: "pieces/staunty.svg" }, animationDuration: 300 },
      orientation: COLOR.white,
      extensions: [
        { class: Markers, props: { autoMarkers: MARKER_TYPE.square } },
        { class: PromotionDialog },
        { class: Accessibility, props: { visuallyHidden: true } }
      ]
    })
    board.setPosition(PGN, false)

    updateGameStatus()

    if (mode === 'position') {
      board.disableMoveInput()
    } else if (mode === 'game') {
      board.enableMoveInput(inputHandler, COLOR.white)
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
          event.chessboard.state.moveInputProcess.then(() => { // wait for the move input process has finished
            event.chessboard.setPosition(chess.fen(), true).then(() => { // update position, maybe castled and wait for animation has finished
              makeEngineMove(event.chessboard)
            })
          })
          return result
        } catch {
          // promotion?
          let possibleMoves = chess.moves({ square: event.squareFrom, verbose: true })
          for (const possibleMove of possibleMoves) {
            if (possibleMove.promotion && possibleMove.to === event.squareTo) {
              event.chessboard.showPromotionDialog(event.squareTo, COLOR.white, (result) => {
                if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
                  chess.move({ from: event.squareFrom, to: event.squareTo, promotion: result.piece.charAt(1) })
                  event.chessboard.setPosition(chess.fen(), true)
                  makeEngineMove(event.chessboard)
                } else {
                  // promotion canceled
                  event.chessboard.enableMoveInput(inputHandler, COLOR.white)
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
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
        // return Math.random()
      }

      const possibleMoves = chess.moves({ verbose: true })
      if (possibleMoves.length > 0) {
        const randomIndex = Math.floor(random() * possibleMoves.length)
        const randomMove = possibleMoves[randomIndex]
        setTimeout(() => { // smoother with 500ms delay
          chess.move({ from: randomMove.from, to: randomMove.to })
          chessboard.setPosition(chess.fen(), true)
          chessboard.enableMoveInput(inputHandler, COLOR.white)
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
  } catch (err) {
    console.log('makePGN', err)
    $item.html(message(err.message))
  }
  $item.on('dblclick', () => { return wiki.textEditor($item, item) })

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

function cleanBeforeMakePGN(item) {
  // for when item text gets more complicated than just PGN
  return item
}

async function makePGN($item, item) {
  console.log(`${item.text}`)
  if (containsChessFigurines(item.text)) {
    const FEN = figurinePositionsToFEN(item.text)
    mode = 'position'
    return FEN
  }
  return item.text // This is the raw item text, this function need to return valid PGN

  function trouble(text, detail) {
    // console.log(text,detail)
    throw new Error(text + "\n" + detail)
  }

  function containsChessFigurines(text) {
    const figurineRegex = /[\u2654-\u265F]/;  // Matches any of ♔♕♖♗♘♙♚♛♜♝♞♟
    return figurineRegex.test(text);
  }

  function figurinePositionsToFEN(positionText) {
    // Initialize 8x8 empty board
    const board = Array(8).fill().map(() => Array(8).fill('1'));

    // Map figurine pieces to FEN characters
    const pieceMap = {
      '♔': 'K', '♕': 'Q', '♖': 'R', '♗': 'B', '♘': 'N', '♙': 'P',
      '♚': 'k', '♛': 'q', '♜': 'r', '♝': 'b', '♞': 'n', '♟': 'p'
    };

    // Regular expression to match piece and position
    // Matches: ♔e1, ♟a7, etc.
    const pieceRegex = /([♔♕♖♗♘♙♚♛♜♝♞♟])([a-h][1-8])/g;

    // Process each piece position
    const matches = [...positionText.matchAll(pieceRegex)];
    for (const [_, piece, position] of matches) {
      const file = position.charCodeAt(0) - 'a'.charCodeAt(0); // Convert a-h to 0-7
      const rank = 8 - parseInt(position[1]); // Convert 1-8 to 0-7 (inverted)
      board[rank][file] = pieceMap[piece] || '1';
    }

    // Convert board array to FEN string
    const fen = board.map(rank => {
      let rankString = '';
      let emptyCount = 0;

      for (const square of rank) {
        if (square === '1') {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            rankString += emptyCount;
            emptyCount = 0;
          }
          rankString += square;
        }
      }

      if (emptyCount > 0) {
        rankString += emptyCount;
      }

      return rankString;
    }).join('/');

    // Add default FEN parameters
    return `${fen} w KQkq - 0 1`;
  }

  // Example usage:
  /*
  const positionText = `
  ♜b8 ♞c6 ♝c8 ♛d8 ♚e8 ♝f8 ♞g8 ♜h8
  ♟a7 ♟b7 ♟c7 ♟d7 ♟e7 ♟f7 ♟g7 ♟h7
  ♙a2 ♙b2 ♙c2 ♙d2 ♙e2 ♙f2 ♙g2 ♙h2
  ♖a1 ♘b1 ♗c1 ♕d1 ♔e1 ♗f1 ♘g1 ♖h1
  `;
  
  console.log(figurinePositionsToFEN(positionText));
  // Output: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  */
}

function chessListener(event) {
  // only continue if event is from a chess popup.
  // events from a popup window will have an opener
  // ensure that the popup window is one of ours
  if (!event.source.opener || event.source.location.pathname !== '/plugins/chess/dialog/') {
    if (wiki.debug) { console.log('chessListener - not for us', { event }) }
    return
  }
  if (wiki.debug) { console.log('chessListener - ours', { event }) }

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
      console.error({ where: 'chessListener', message: "unknown action", data })
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

// TODO if item text is empty, or not able to be parsed as pgn, just load a fresh game against random bot, randomize who goes first
// TODO if there is parseable PGN, load it... otherwise try and make sense of it to parse

//  MODES for the chess plugin: 1. A game 2. A position 3. editor 4. puzzle player

// The item text can be recognized as FEN, PGN, the original figurine notation, otherwise just show a fresh game.