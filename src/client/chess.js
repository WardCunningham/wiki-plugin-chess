const expand = text => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
}

const emit = ($item, item) => {
  return $item.append(`<iframe id="board" style="height:500px;width:100%;" src="//${location.host}/plugins/chess/index.html"></iframe>`)
}

const bind = ($item, item) => {
  return $item.dblclick(() => {
    return wiki.textEditor($item, item)
  })
}

if (typeof window !== 'undefined') {
  window.plugins.chess = { emit, bind }
}

export const chess = typeof window == 'undefined' ? { expand } : undefined
