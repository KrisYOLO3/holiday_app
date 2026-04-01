
async function getData<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(`HTTP error ${response.status}`)
  return response.json() as Promise<T>
}
export default getData  

