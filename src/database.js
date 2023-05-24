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
    const data = this.#database[table] ?? []
    
    return data
  }
  
  insert(table, body) {
    // const data = this.#database[table] ?? { table }
    // Não dá pra fazer dessa forma pois -> data: { table: 'tasks' }
    
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(body)
    } else {
      this.#database[table] = [body]
    }
    
    this.#persist()
    
    return body;
  }
}