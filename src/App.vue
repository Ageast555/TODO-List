<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <Sidebar 
      :active-category="activeCategory"
      @category-change="handleCategoryChange"
    />

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部标题栏 -->
      <div class="header">
        <div class="header-title">TODO List</div>
        <div class="header-actions">
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索待办事项"
            style="width: 300px"
            @search="handleSearch"
          />
          <a-button 
            type="text" 
            @click="showSortModal = true"
          >
            <template #icon><FilterOutlined /></template>
            排序
          </a-button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <!-- 中间：待办事项列表 -->
        <div class="todo-list-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
            <div class="todo-list-title">待办事项</div>
            <div style="font-size: 14px; color: #999">
              共 {{ filteredTodos.length }} 项
              <span v-if="activeCategory !== 'all'">
                （当前分类：{{ categoryTodosCount }} 项）
              </span>
            </div>
          </div>
          
          <!-- 提醒通知 -->
          <div v-if="urgentTodos.length > 0 && !reminderDismissed" class="reminder-notification" :class="getReminderClass()" style="margin-bottom: 16px">
            <a-alert
              :message="getReminderMessage()"
              type="warning"
              :show-icon="true"
              @close="dismissReminder"
            >
              <template #description>
                <div style="margin-top: 8px">
                  <div v-for="todo in urgentTodos" :key="todo.id" style="margin-bottom: 4px">
                    • {{ todo.title }} - {{ getDueDateStatusText(todo.dueDate) }}
                  </div>
                </div>
              </template>
            </a-alert>
          </div>

          <!-- 批量操作栏 -->
          <div v-if="selectedTodos.length > 0" style="margin-bottom: 16px">
            <a-space>
              <span>已选择 {{ selectedTodos.length }} 项</span>
              <a-button size="small" @click="batchComplete">批量完成</a-button>
              <a-button size="small" danger @click="batchDelete">批量删除</a-button>
              <a-button size="small" @click="clearSelection">取消选择</a-button>
            </a-space>
          </div>

          <!-- 待办事项列表 -->
          <div v-if="filteredTodos.length > 0">
            <TodoItem
              v-for="todo in filteredTodos"
              :key="todo.id"
              :todo="todo"
              :selected="selectedTodos.includes(todo.id)"
              @toggle="handleToggle"
              @delete="handleDelete"
              @edit="handleEdit"
              @select="handleSelect"
            />
          </div>
          
          <!-- 空状态 -->
          <div v-else class="empty-state">
            <div class="empty-state-icon">📝</div>
            <div class="empty-state-text">暂无待办事项</div>
          </div>
        </div>

        <!-- 右侧：添加/编辑表单 -->
        <div class="todo-form-panel">
          <div class="todo-form-title">待办事项</div>
          <TodoForm
            :todo="editingTodo"
            :categories="categories"
            @submit="handleSubmit"
            @cancel="handleCancelEdit"
          />
        </div>
      </div>
    </div>

    <!-- 排序弹窗 -->
    <a-modal
      v-model:open="showSortModal"
      title="排序选项"
      @ok="applySort"
      @cancel="showSortModal = false"
    >
      <a-radio-group v-model:value="sortType">
        <a-radio value="priority">按优先级排序</a-radio>
        <a-radio value="created">按创建时间排序</a-radio>
        <a-radio value="dueDate">按截止日期排序</a-radio>
        <a-radio value="title">按标题排序</a-radio>
      </a-radio-group>
      <div style="margin-top: 16px">
        <a-checkbox v-model:checked="sortDesc">降序</a-checkbox>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { FilterOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import Sidebar from './components/Sidebar.vue'
import TodoItem from './components/TodoItem.vue'
import TodoForm from './components/TodoForm.vue'
import { storage } from './utils/storage'

const categories = [
  { id: 'all', name: '全部', icon: 'HomeOutlined' },
  { id: 'work', name: '工作', icon: 'BriefcaseOutlined' },
  { id: 'study', name: '学习', icon: 'ReadOutlined' },
  { id: 'life', name: '生活', icon: 'HomeOutlined' }
]

const todos = ref([])
const activeCategory = ref('all')
const searchText = ref('')
const editingTodo = ref(null)
const selectedTodos = ref([])
const showSortModal = ref(false)
const sortType = ref('created')
const sortDesc = ref(false)
const reminderDismissed = ref(false)

onMounted(() => {
  todos.value = storage.getTodos()
})

const saveTodos = () => {
  storage.saveTodos(todos.value)
}

watch(todos, () => {
  saveTodos()
}, { deep: true })

const categoryTodosCount = computed(() => {
  if (activeCategory.value === 'all') return todos.value.length
  return todos.value.filter(todo => todo.category === activeCategory.value).length
})

const filteredTodos = computed(() => {
  let result = [...todos.value]

  if (activeCategory.value !== 'all') {
    result = result.filter(todo => todo.category === activeCategory.value)
  }

  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    result = result.filter(todo => 
      todo.title.toLowerCase().includes(keyword) ||
      (todo.description && todo.description.toLowerCase().includes(keyword))
    )
  }

  result.sort((a, b) => {
    let comparison = 0
    switch (sortType.value) {
      case 'priority':
        comparison = (b.priority || 0) - (a.priority || 0)
        break
      case 'created':
        comparison = new Date(a.createdAt) - new Date(b.createdAt)
        break
      case 'dueDate':
        const aDue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31')
        const bDue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31')
        comparison = aDue - bDue
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
    }
    return sortDesc.value ? -comparison : comparison
  })

  return result
})

const urgentTodos = computed(() => {
  const now = dayjs()
  return todos.value.filter(todo => {
    if (todo.completed || !todo.dueDate) return false
    const due = dayjs(todo.dueDate)
    const diffDays = due.diff(now, 'day')
    return diffDays <= 3
  }).sort((a, b) => {
    return dayjs(a.dueDate).diff(dayjs(b.dueDate))
  })
})

const getReminderClass = () => {
  const hasOverdue = urgentTodos.value.some(todo => {
    const diffDays = dayjs(todo.dueDate).diff(dayjs(), 'day')
    return diffDays < 0
  })
  if (hasOverdue) return 'overdue'
  return 'urgent'
}

const getReminderMessage = () => {
  const overdueCount = urgentTodos.value.filter(todo => {
    const diffDays = dayjs(todo.dueDate).diff(dayjs(), 'day')
    return diffDays < 0
  }).length
  
  if (overdueCount > 0) {
    return `⚠️ 有 ${overdueCount} 个待办事项已过期，${urgentTodos.value.length - overdueCount} 个即将到期`
  }
  return `⏰ 有 ${urgentTodos.value.length} 个待办事项即将到期（3天内）`
}

const getDueDateStatusText = (dueDate) => {
  if (!dueDate) return ''
  const now = dayjs()
  const due = dayjs(dueDate)
  const diffDays = due.diff(now, 'day')
  
  if (diffDays < 0) {
    return `已过期 ${Math.abs(diffDays)} 天`
  } else if (diffDays === 0) {
    return '今天到期'
  } else if (diffDays === 1) {
    return '明天到期'
  } else {
    return `${diffDays} 天后到期`
  }
}

const dismissReminder = () => {
  reminderDismissed.value = true
  setTimeout(() => {
    reminderDismissed.value = false
  }, 5000)
}

const handleCategoryChange = (category) => {
  activeCategory.value = category
  selectedTodos.value = []
}

const handleSearch = () => {
}

const handleToggle = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    todo.completedAt = todo.completed ? new Date().toISOString() : null
    message.success(todo.completed ? '已标记为完成' : '已标记为未完成')
  }
}

const handleDelete = (id) => {
  todos.value = todos.value.filter(t => t.id !== id)
  message.success('删除成功')
  if (editingTodo.value && editingTodo.value.id === id) {
    editingTodo.value = null
  }
}

const handleEdit = (todo) => {
  editingTodo.value = { ...todo }
}

const handleSubmit = (todoData) => {
  if (editingTodo.value && editingTodo.value.id) {
    const index = todos.value.findIndex(t => t.id === editingTodo.value.id)
    if (index !== -1) {
      todos.value[index] = {
        ...todos.value[index],
        ...todoData,
        updatedAt: new Date().toISOString()
      }
      message.success('更新成功')
    }
  } else {
    const newTodo = {
      id: Date.now().toString(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString()
    }
    todos.value.unshift(newTodo)
    message.success('添加成功')
  }
  editingTodo.value = null
}

const handleCancelEdit = () => {
  editingTodo.value = null
}

const handleSelect = (id) => {
  const index = selectedTodos.value.indexOf(id)
  if (index > -1) {
    selectedTodos.value.splice(index, 1)
  } else {
    selectedTodos.value.push(id)
  }
}

const batchComplete = () => {
  selectedTodos.value.forEach(id => {
    const todo = todos.value.find(t => t.id === id)
    if (todo && !todo.completed) {
      todo.completed = true
      todo.completedAt = new Date().toISOString()
    }
  })
  message.success(`已批量完成 ${selectedTodos.value.length} 项`)
  selectedTodos.value = []
}

const batchDelete = () => {
  todos.value = todos.value.filter(t => !selectedTodos.value.includes(t.id))
  message.success(`已批量删除 ${selectedTodos.value.length} 项`)
  selectedTodos.value = []
}

const clearSelection = () => {
  selectedTodos.value = []
}

const applySort = () => {
  showSortModal.value = false
  message.success('排序已应用')
}
</script>

