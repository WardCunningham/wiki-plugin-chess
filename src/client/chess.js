let iframe, chessObj = {} // An object to hold the chess item's state and other important metadata

const emit = async ($item, item) => {
  chessObj.item = item
  chessObj.mode = await checkMode(item) // The mode of the chess item (GAME, POSITION, PUZZLE, NONE)
  // If a mode is given in the item text, remove it to get the chess state, which is either FEN or PGN format
  if (chessObj.mode !== 'NONE') {
    if (item.text.trim().toUpperCase() === chessObj.mode) {
      chessObj.chessState = ''
    } else {
      // Otherwise remove the mode word and any following whitespace
      chessObj.chessState = item.text.replace(/^[\w]+[\s]+/, '')
    }
  } else {
    chessObj.chessState = item.text // If no mode is given, use the entire text as the chess state
  }
  chessObj.format = await getFormat(chessObj.chessState)

  const defaultPGN = `
    [SetUp "1"]
    [FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]` // Default starting position

  switch (chessObj.format) {
    case 'FIGURINE':
      chessObj.FEN = figurineToFEN(item.text)
      break
    case 'FEN':
      chessObj.FEN = item.text
      break
    case 'PGN':
      try {
        chessObj.PGN = item.text
      } catch (error) {
        trouble('Invalid PGN notation', error)
      }
      break
    case 'EMPTY':
      if (chessObj.mode === 'GAME') {
        console.log('Empty text, loading a new game')
        chessObj.PGN = defaultPGN
      } else if (chessObj.mode === 'POSITION') {
        console.log('Empty text, loading a new position')
        chessObj.FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' // Default starting position
      }
      break
    case 'UNKNOWN':
      console.log('Unknown format, loading a new game')
      chessObj.PGN = defaultPGN
      break
  }

  const html = chessObj.FEN ? 'fen-editor.html' : 'index.html'
  const fenParam = chessObj.FEN ? `?fen=${encodeURIComponent(chessObj.FEN)}` : ''

  iframe = $('<iframe>', {
    id: 'board',
    style: 'height:600px;width:100%;border-width:0px;',
    src: `//${location.host}/plugins/chess/${html}${fenParam}`
  });

  return $item.append(
    $('<div>', {
      style: 'background-color:#eee;border-width:2px;border-color:black;border-style:solid'
    }).append([
      iframe,
      `<button id="openNew" type="button" onclick="window.plugins.chess.doPopup(event)">Open in new window</button>
      <button id="sendMsg" type="button" onclick="window.plugins.chess.sendMessage('load')">Send Message</button>
      <button id="saveChanges" type="button">Save Changes</button>
      <p>isOwner?: ${isOwner}</p>
      <p>isAuthenticated?: ${isAuthenticated}</p>`
    ])
  );
}

const bind = async ($item, item) => {
  $item.on('click', event => {
    const { target } = event
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

  $item.on('dblclick', () => wiki.textEditor($item, item))

  function download(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  $item.find('#saveChanges').on('click', e => {
    console.log('saveChanges - event', { e })
    console.log("Show item before trying to save", { item })
    // TODO - replace the following with whatever the latest PGN is, might need composed, especially if tags are changing
    // item.text += "surprise!"
    wiki.pageHandler.put($item.parents('.page:first'), {
      type: 'edit',
      id: item.id,
      item: item,
    })
  })

}

// open chess plugin in new  popup window
let popup
const doPopup = event => {
  const html = chessObj.FEN ? 'fen-editor.html' : 'index.html'
  const fenParam = chessObj.FEN ? `?fen=${encodeURIComponent(chessObj.FEN)}` : ''
  const doing = { type: 'batch' }
  popup = window.open(`/plugins/chess/${html}${fenParam}`, 'chess', 'popup,height=720,width=1280')
  if (popup.location.pathname != '/plugins/chess/') {
    console.log('launching new dialog')
    popup.addEventListener('load', event => {
      console.log('launched and loaded')
      popup.postMessage(doing, window.origin)
    })
  }
  else {
    console.log('reusing existing dialog')
    popup.postMessage(doing, window.origin)
  }
}

const msgTarget = window.opener || window.parent !== window.self ? window.parent : null;

// document.getElementById("sendMsg").addEventListener("click", () => {
//   if (msgTarget) {
//     // const chessObj = {
//     //   PGN: chessConsole.getPGN(),
//     //   FEN: chessConsole.getFEN()
//     // }
//     msgTarget.postMessage({ action: "load", chessObj: { body: "test" } }, "*")
//     console.log("sending message to wiki", { action: "load", chessObj: { body: "test" } })
//   } else {
//     // This is where the chess app is accessed directly, maybe as a PWA too.
//     console.log("this is a top level window, nothing to send messages to")
//   }
// })

// Send message to popup window or iframe
const sendMessage = (action) => {
  console.log({ popup, iframe })
  const msg = { action, chessObj }
  try {
    if (popup) popup.postMessage(msg, window.origin)
    if (iframe) iframe[0].contentWindow.postMessage(msg, window.origin)
  } catch (error) {
    console.error('Error sending message:', error)
    trouble('Error sending message', error)
  }
}


if (typeof window !== 'undefined') {
  window.plugins.chess = { emit, bind, doPopup, sendMessage }
  if (typeof window.chessListener !== 'undefined' || window.chessListener == null) {
    console.log('**** Adding chess listener')
    window.chessListener = chessListener
    window.addEventListener('message', chessListener)
  }
}

// Determines format of chess item text
async function checkMode(item) {
  if (item.text.trim().split(/\s+/)[0].toUpperCase() === 'GAME') { // Check if the first word is 'GAME'
    return 'GAME'
  } else if (item.text.trim().split(/\s+/)[0].toUpperCase() === 'POSITION') { // Check if the first word is 'EDIT'
    return 'POSITION'
  } else if (item.text.trim().split(/\s+/)[0].toUpperCase() === 'PUZZLE') { // Check if the first word is 'EDIT'
    return 'PUZZLE'
  } else {
    return 'NONE'
  }
}

// Determines format of chess item text
async function getFormat(text) {
  if (/[\u2654-\u265F]/.test(text)) {
    return 'FIGURINE' // Matches any of ♔♕♖♗♘♙♚♛♜♝♞♟
  } else if ((text.match(/\//g) || []).length === 7) {
    return 'FEN' // FEN notation has exactly 7 slashes
  } else if (/\[([^\]]*)\]/g.test(text) || /^1\./.test(text.trim())) {
    return 'PGN' // Has square brackets OR starts with "1."
  } else if (text.length === 0) {
    return 'EMPTY'
  } else {
    return 'UNKNOWN'
  }
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


function trouble(text, detail) {
  // console.log(text,detail)
  throw new Error(text + '\n' + detail)
}

// Listener for messages from the chess popup window or iframe
function chessListener(event) {
  console.log('chessListener - event', { event })
  // only continue if event is from a chess popup.
  // events from a popup window will have an opener
  // ensure that the popup window is one of ours
  if (!(event.source.opener || event.source.parent) || event.source.location.pathname !== '/plugins/chess/index.html') {
    if (wiki.debug) {
      console.log('chessListener - not for us', { event })
    }
    console.log("returning because not for us")
    return
  }
  if (wiki.debug) {
    console.log('chessListener - ours', { event })
  }

  const { data } = event
  console.log('chessListener - data', { data })
  const { action } = data
  // const { action, keepLineup = false, pageKey = null, title = null, context = null } = data
  console.log({ action })

  switch (action) {
    case 'test':
      console.log("The test message worked!");
      break
    case 'get state':
      sendMessage("send state")
      // TODO - load the chess item
      break
    default:
      console.error({ where: 'chessListener', message: 'unknown action', data })
  }
}

const expand = text => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
}

export const chess = typeof window == 'undefined' ? { expand } : undefined

// TODO - add a way to save the chess item (See markdown) https://github.com/fedwiki/wiki-plugin-markdown/blob/main/src/markdown.js#L96
// https://github.com/fedwiki/wiki-plugin-markdown/blob/ebe71c3b8c67d4752bc01d0bdf428e5a52379045/src/markdown.js#L96
// TODO determine who the players are, and who's turn it is. Right now assuming stockfish opponent.
// TODO enable converting any position into a GAME or PUZZLE