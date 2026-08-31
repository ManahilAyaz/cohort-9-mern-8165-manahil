function stripHtml(html){
  if(!html) return ''

  const withSpacing=html
    .replace(/<\/(li|p|div|h[1-6])>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')

  const parser=new DOMParser()
  const doc=parser.parseFromString(withSpacing, 'text/html')
  const text=doc.body.textContent || ''

  return text.replace(/\s+/g, ' ').trim()
}

export default stripHtml