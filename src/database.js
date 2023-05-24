import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

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
  
  select(table, id) {
    const data = this.#database[table] ?? []
    
    if (id) {
      return this.#database[table].find(task => task.id === id)
    }
    
    return data
  }
  
  insert(table, body) {
    const infoToAddOnBody = {
      id: randomUUID(),
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date()
    }
    
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
      
      const dataUpdated = { ...data, ...body }
      
      this.#database[table][rowIndex] = { id, ...dataUpdated }
      this.#persist()
      return true;
    } else {
      return false;
    }
  }
  
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
      return true;
    } else {
      return false;
    }
    
  }
}