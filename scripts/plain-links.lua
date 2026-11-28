-- Keep readable link labels, but omit bare external URLs from the print-oriented reading PDF.
-- DOI identifiers written as ordinary bibliographic text (for example, "DOI: 10...") remain visible.
function Link(link)
  local target = link.target or ""
  local label = pandoc.utils.stringify(link.content)
  if target:match("^https?://") and label == target then
    return {}
  end
  return link.content
end
