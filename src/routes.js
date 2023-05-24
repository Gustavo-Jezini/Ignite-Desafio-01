import { Database } from "./database.js"
import { isBodyComplete } from "./middlewares/isBodyComplete.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { id } = (req.query);
      const tasks = database.select('tasks', id)
      
      return res.writeHead(200).end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const isComplete = isBodyComplete(req.body);
      
      if (isComplete) {
        database.insert('tasks', req.body)
        return res.writeHead(201).end('Criado com sucesso!')
      } else {
        return res.writeHead(400).end('Informações faltando')
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const isComplete = isBodyComplete(req.body);
      if (isComplete) {
        const { id } = req.params
        const updateSuceeded = database.update('tasks', id, { ...req.body, updated_at: new Date()})
              
        return updateSuceeded
        ? res.writeHead(202).end('Atualizado com sucesso') 
        : res.writeHead(400).end('ID não encontrado')
        
        
      } else {
        return res.writeHead(400).end('Informações faltando')
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      
      const task = database.select('tasks', id)
      
      if (!task) {
        return res.writeHead(404).end('Tarefa não encontrada')
      }

      const isTaskCompleted = !!task.completed_at
      const completed_at = isTaskCompleted ? null : new Date()
      
      database.update('tasks', id, { completed_at })

      
      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const deleteSucceeded = database.delete('tasks', id)
      
      if (deleteSucceeded) {
        return res.end('Tarefa deletada!')
      } else {
        return res.end('ID não encontrado')
      }
    },
  }
]