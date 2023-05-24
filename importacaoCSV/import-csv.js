import { parse } from 'csv-parse';
import fs from 'node:fs'

// criar um caminho onde o csv será criado
const csvPath = new URL('./tasks.csv', import.meta.url)

// https://csv.js.org/parse/api/stream/
// Initialize the parser
// Serve para extrair os valores e estruturar os dados contidos no csv
const parser = parse({
  delimiter: ';',
  skipEmptyLines: true,
  fromLine: 2 // A primeira linha são os titulos
});

// a stream que será lida
// Eu deveria ter criado o arquivo CSV primeiro -> Ele será lido!!
const stream = fs.createReadStream(csvPath)


async function run() {
  const linesParse = stream.pipe(parser)
  
  for await (const line of linesParse) {
    // console.log(line); -> ocorre a leitura do arquivo CSV
    // [ 'task 01', ' descricao task 01' ]
    // [ 'task 02', ' descricao task 02' ]
    // [ 'task 03', ' descricao task 03' ]
    const [title, description] = line;

    await fetch('http://localhost:5555/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
  }
}

run()