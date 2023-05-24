import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

const databasePath = new URL('../db.json', import.meta.url)

const infoToAddOnBody = {
  id: randomUUID(),
  completed_at: null,
  created_at: new Date(),
  updated_at: new Date()
}

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
    const data = { ...body, ...infoToAddOnBody }
    
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    
    this.#persist()
    
    return body;
  }
  
  update(table, id, body) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    
    
    if (rowIndex > -1) {
      const data = this.#database[table][rowIndex]
      
      const dataUpdated = { ...data, ...body, updated_at: new Date() }
      
      this.#database[table][rowIndex] = { id, ...dataUpdated }
      this.#persist()
      return true
    } else {
      return false;
    }
  }
}