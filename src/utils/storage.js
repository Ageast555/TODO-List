const STORAGE_KEY = 'todo-list-data'

export const storage = {
  getTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('读取数据失败:', error)
      return []
    }
  },

  saveTodos(todos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }
}

