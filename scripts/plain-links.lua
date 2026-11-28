-- Keep readable link labels and bibliographic identifiers, but omit bare web URLs from the print-oriented PDF.
-- DOI identifiers written as ordinary text (for example, "DOI: 10...") remain visible.
function Link(link)
  local target = link.target or ""
  local label = pandoc.utils.stringify(link.content)
  if target:match("^https?://") and label == target then
    return {}
  end
  return link.content
end

function Str(el)
  el.text = el.text:gsub("https?://%S+", "")
  if el.text == "" then
    return {}
  end
  return el
end
