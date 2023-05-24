export function isBodyComplete(body) {
  const { title, description } = body
  
  if (!title || !description)  return false;
  
  return true
}