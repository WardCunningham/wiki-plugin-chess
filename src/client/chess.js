let popup, mode = 'GAME' // A global variable to keep track of the mode of the chess plugin, GAME is assumed by default.

const emit = ($item, item) => {
  return $item.append(`
    <iframe id="board" style="height:600px;width:100%;" src="//${location.host}/plugins/chess/index.html"></iframe>
    <button id="openNew" type="button" onclick="window.plugins.chess.dopopup(event)">Open in new window</button>
    <button id="sendMsg" type="button" onclick="window.plugins.chess.sendmessage(event)">Send Message</button>
    `)
}

const bind = async ($item, item) => {

  let format = await determineFormat(item)
  let position

  switch (format) {
    case 'FIGURINE':
      position = figurineToFEN(item.text)
      mode = 'POSITION'
      break
    case 'FEN':
      position = item.text
      mode = 'POSITION'
      break
    case 'PGN':
      try {
        mode = 'GAME'
      } catch (error) {
        console.error('Error loading PGN:', error)
        trouble('Invalid PGN notation', item.text)
        mode = 'POSITION'
      }
      break
    case 'UNKNOWN':
      console.log('Unknown format, loading a new game')
      mode = 'GAME'
      break
  }

  $item.on('click', event => {
    console.log("Clicked on item!")
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

  function download(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return $item.dblclick(() => {
    return wiki.textEditor($item, item)
  })
}

function trouble(text, detail) {
  // console.log(text,detail)
  throw new Error(text + '\n' + detail)
}

// open chess plugin in new window
const dopopup = event => {
  const doing = { type: 'batch' }
  popup = window.open('/plugins/chess/index.html', 'chess', 'popup,height=720,width=1280')
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

// Send message to popup window
const sendmessage = event => {
  if (popup) {
    const msg = { type: 'message to popup' }
    popup.postMessage(msg, window.origin)
  }
  else {
    console.log('No popup window found.')
  }
}

if (typeof window !== 'undefined') {
  window.plugins.chess = { emit, bind, dopopup, sendmessage }
  if (typeof window.chessListener !== 'undefined' || window.chessListener == null) {
    console.log('**** Adding chess listener')
    window.chessListener = chessListener
    window.addEventListener('message', chessListener)
  }
}

// Determines format of chess item text
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

// TODO - try and get this to a point where a game can be played on wiki
// MODES for the chess plugin: 1. game 2. position 3. puzzle 
// TODO fix favicon to match origin
// TODO enabled switching between modes
// Make the plugin also work offline as installable PWA
// Convert any position into a GAME or PUZZLE