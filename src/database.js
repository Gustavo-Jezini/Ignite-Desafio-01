import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}
  
  constructor() {
      fs.readFile(databasePath, 'utf-8')
        .then(data => this.#database = JSON.parse(data))
        .catch(() => this.#persist())
    } 
  
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }
  
  select(table) {
    const data = this.#database ?? []
    
    return data
  }
  
  insert(table, body) {
    const data = this.#database ?? []
    
    data[table].push(body)
    
    this.#persist()
    
    return body;
  }
}