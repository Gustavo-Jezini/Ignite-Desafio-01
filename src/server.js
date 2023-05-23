import http from 'node:http'
import { routes } from './routes.js'

const server = http.createServer((req, res) => {
  const { method, url } = req
  
  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })
  
  console.log(route);
  return res.end('Its working!')
})

server.listen(5555)