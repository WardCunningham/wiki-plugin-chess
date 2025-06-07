let iframe, chessObj = {} // An object to hold the chess item's state and other important metadata

const emit = async ($item, item) => {
  chessObj.item = item
  chessObj.chessState = item.text
  let params

  chessObj.format = await getFormat(chessObj.chessState)
  switch (chessObj.format) {
    case 'FIGURINE':
      chessObj.FEN = figurineToFEN(chessObj.chessState)
      console.log('Loading fen editor')
      params = `?fen=${encodeURIComponent(chessObj.FEN)}`
      break
    case 'FEN':
      chessObj.FEN = chessObj.chessState
      console.log('Loading fen editor')
      params = `?fen=${encodeURIComponent(chessObj.FEN)}`
      break
    case 'PGN':
      chessObj.PGN = chessObj.chessState
      console.log('Loading game mode')
      params = ''
      break
    case 'PUZZLE':
      console.log('Loading puzzle mode')
      params = ''
      break
    case 'UNKNOWN':
      console.log('Loading unknown mode')
      params = ''
      break
  }
  console.log({ chessObj })

  iframe = $('<iframe>', {
    id: 'board',
    style: 'height:820px;width:100%;border-width:0px;',
    src: `//${location.host}/plugins/chess/index.html${params}`
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
  const html = 'index.html'
  const fenParam = chessObj.FEN ? `?fen=${encodeURIComponent(chessObj.FEN)}` : ''
  const msg = { action: "send-state", chessObj }
  popup = window.open(`/plugins/chess/${html}${fenParam}`, 'chess', 'popup,height=720,width=1280')
  if (popup.location.pathname != '/plugins/chess/') {
    console.log('launching new dialog')
    popup.addEventListener('load', event => {
      console.log('launched and loaded')
      popup.postMessage(msg, window.origin)
    })
  }
  else {
    console.log('!!!!!!reusing existing dialog')
    popup.postMessage(msg, window.origin)
  }
}

// Send message to popup window or iframe
const sendMessage = (action) => {
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
async function getFormat(text) {
  if (/[\u2654-\u265F]/.test(text)) {
    return 'FIGURINE' // Matches any of ♔♕♖♗♘♙♚♛♜♝♞♟
  } else if ((text.match(/\//g) || []).length === 7) {
    return 'FEN' // FEN notation has exactly 7 slashes
  } else if (/\[([^\]]*)\]/g.test(text) || /^1\./.test(text.trim())) {
    return 'PGN' // Has square brackets OR starts with "1."
    // } else if ()
    //   return 'PUZZLE' // Matches puzzle notation
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
    case 'get-state':
      sendMessage("set-state")
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

// TODO determine who the players are from PGN, and who's turn it is. Right now assuming stockfish opponent.
// TODO Parse Item text like frame does below 
// TODO enable converting any position into a GAME or PUZZLE


// function parse(text) {
//   const [line, ...rest] = text.split("\n")
//   let src = validateSrc(line)
//   let height = defaultHeight, matchData
//   const caption = []
//   const sources = new Set()
//   const lineups = new Set()
//   for (let line of rest) {
//     if (matchData = line.match(/^HEIGHT (\w+)/)) {
//       height = +matchData[1]
//       continue
//     } else if (matchData = line.match(/^SOURCE (\w+)/)) {
//       sources.add(matchData[1])
//     } else if (matchData = line.match(/^LINEUP (\w+)/)) {
//       lineups.add(matchData[1])
//     } else {
//       caption.push(line)
//     }
//   }
//   return {
//     ...src,
//     caption: caption.join("\n"),
//     height,
//     sources,
//     lineups
//   }
// }