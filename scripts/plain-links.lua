-- Preserve bibliographic text while removing clickable navigation from the reading PDF.
-- DOI and URL strings remain visible as ordinary text when present in the source.
function Link(link)
  return link.content
end
