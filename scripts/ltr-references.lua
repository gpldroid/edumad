local function has_arabic(s)
  for _, cp in utf8.codes(s) do
    if (cp >= 0x0600 and cp <= 0x06FF) or (cp >= 0x0750 and cp <= 0x077F) or (cp >= 0x08A0 and cp <= 0x08FF) or (cp >= 0xFB50 and cp <= 0xFDFF) or (cp >= 0xFE70 and cp <= 0xFEFF) then
      return true
    end
  end
  return false
end

local function has_latin(s)
  return s:match("[A-Za-z]") ~= nil
end

function Inlines(inlines)
  local output, run = {}, {}

  local function flush()
    if #run > 0 then
      table.insert(output, pandoc.Span(run, pandoc.Attr("", {}, { lang = "en" })))
      run = {}
    end
  end

  for _, inline in ipairs(inlines) do
    local value = pandoc.utils.stringify(inline)
    if not has_arabic(value) and (has_latin(value) or (#run > 0 and value:match("^[%d%p%s]+$"))) then
      table.insert(run, inline)
    else
      flush()
      table.insert(output, inline)
    end
  end

  flush()
  return pandoc.Inlines(output)
end
