import http from 'node:http'

const server = http.createServer((req, res) => {
  return res.end('Its working!')
})

server.listen(5555)