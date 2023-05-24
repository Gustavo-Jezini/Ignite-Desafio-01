export function isBodyComplete(body) {
  const { title, description } = body
  console.log(body);
  
  if (!title || !description)  return false;
  
  return true
}