function stripHtml(html){
  if(!html) return ''
  const parser=new DOMParser()
  const doc=parser.parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

export default stripHtml