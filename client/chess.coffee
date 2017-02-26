
expand = (text)->
  text
    .replace /&/g, '&amp;'
    .replace /</g, '&lt;'
    .replace />/g, '&gt;'
    .replace /\*(.+?)\*/g, '<i>$1</i>'

piece = (text, row, col) ->
  for i in [0 .. text.length]
    if text.charAt(i+1) == col && text.charAt(i+2) == row
      return text.charAt(i)
  return ''

board = (text) ->
  html = "<center><table style='text-align:center;border-width:0;border-collapse:collapse;'>"
  light = true
  for row in ['8','7','6','5','4','3','2','1']
    html += '<tr>'
    light = !light
    for col in ['a','b','c','d','e','f','g','h']
      color = if (light = !light) then 'white' else 'lightgray'
      style = "width:36px;height:36px;background-color:#{color};font-size:150%;"
      html += "<td style='#{style}' title=#{col}#{row}>" + piece(text, row, col)
  html += '</table>'

emit = ($item, item) ->
  $item.append """
    <div style="background-color:#eee;padding:15px;">
      #{board item.text}
    </div>
  """

bind = ($item, item) ->
  $item.dblclick -> wiki.textEditor $item, item

window.plugins.chess = {emit, bind} if window?
module.exports = {expand} if module?

