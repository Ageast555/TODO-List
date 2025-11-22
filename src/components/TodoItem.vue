<template>
  <div class="todo-item" :class="{ completed: todo.completed, selected: selected, 'due-urgent': isDueUrgent(), 'due-overdue': isDueOverdue() }" @click="handleItemClick">
    <a-checkbox
      :checked="todo.completed"
      @change.stop="handleToggle"
      style="margin-top: 2px"
    />
    
    <div class="todo-item-content">
      <div class="todo-item-title" :class="{ completed: todo.completed }">
        {{ todo.title }}
        <a-tag v-if="todo.category" :color="getCategoryColor(todo.category)">
          {{ getCategoryName(todo.category) }}
        </a-tag>
        <a-tag v-if="todo.priority" :color="getPriorityColor(todo.priority)" size="small">
          {{ getPriorityText(todo.priority) }}
        </a-tag>
      </div>
      <div v-if="todo.description" class="todo-item-description">
        {{ todo.description }}
      </div>
      <div class="todo-item-meta">
        <span v-if="todo.createdAt">
          创建于 {{ formatDate(todo.createdAt) }}
        </span>
        <span v-if="todo.completedAt">
          | 完成于 {{ formatDate(todo.completedAt) }}
        </span>
        <span v-if="todo.dueDate" :class="getDueDateClass(todo.dueDate, todo.completed)">
          | 截止日期：{{ formatDateOnly(todo.dueDate) }}
          <a-tag v-if="!todo.completed" :color="getDueDateTagColor(todo.dueDate)" size="small" style="margin-left: 8px">
            {{ getDueDateStatus(todo.dueDate) }}
          </a-tag>
        </span>
      </div>
    </div>

    <div class="todo-item-actions">
      <a-button 
        type="text" 
        size="small"
        @click.stop="handleEdit"
      >
        编辑
      </a-button>
      <a-popconfirm
        title="确定要删除这个待办事项吗？"
        @confirm="handleDelete"
      >
        <a-button 
          type="text" 
          danger 
          size="small"
        >
          删除
        </a-button>
      </a-popconfirm>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'delete', 'edit', 'select'])

const handleToggle = () => {
  emit('toggle', props.todo.id)
}

const handleDelete = () => {
  emit('delete', props.todo.id)
}

const handleEdit = () => {
  emit('edit', props.todo)
}

const handleSelect = () => {
  emit('select', props.todo.id)
}

const handleItemClick = (e) => {
  if (!e.target.closest('button') && !e.target.closest('.ant-checkbox')) {
    handleSelect()
  }
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const formatDateOnly = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD')
}

const getDueDateStatus = (dueDate) => {
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
  } else if (diffDays <= 3) {
    return `${diffDays} 天后到期`
  } else {
    return ''
  }
}

const getDueDateTagColor = (dueDate) => {
  if (!dueDate) return 'default'
  const now = dayjs()
  const due = dayjs(dueDate)
  const diffDays = due.diff(now, 'day')
  
  if (diffDays < 0) {
    return 'red'
  } else if (diffDays === 0) {
    return 'red'
  } else if (diffDays <= 1) {
    return 'orange'
  } else if (diffDays <= 3) {
    return 'orange'
  } else {
    return 'default'
  }
}

const getDueDateClass = (dueDate, completed) => {
  if (completed) return ''
  if (!dueDate) return ''
  const now = dayjs()
  const due = dayjs(dueDate)
  const diffDays = due.diff(now, 'day')
  
  if (diffDays < 0) {
    return 'due-date-overdue'
  } else if (diffDays <= 3) {
    return 'due-date-urgent'
  }
  return ''
}

const isDueUrgent = () => {
  if (props.todo.completed || !props.todo.dueDate) return false
  const now = dayjs()
  const due = dayjs(props.todo.dueDate)
  const diffDays = due.diff(now, 'day')
  return diffDays >= 0 && diffDays <= 3
}

const isDueOverdue = () => {
  if (props.todo.completed || !props.todo.dueDate) return false
  const now = dayjs()
  const due = dayjs(props.todo.dueDate)
  return due.diff(now, 'day') < 0
}

const getCategoryName = (category) => {
  const names = {
    work: '工作',
    study: '学习',
    life: '生活'
  }
  return names[category] || category
}

const getCategoryColor = (category) => {
  const colors = {
    work: 'blue',
    study: 'green',
    life: 'orange'
  }
  return colors[category] || 'default'
}

const getPriorityColor = (priority) => {
  if (priority >= 3) return 'red'
  if (priority === 2) return 'orange'
  return 'default'
}

const getPriorityText = (priority) => {
  const texts = {
    1: '低',
    2: '中',
    3: '高'
  }
  return texts[priority] || '低'
}
</script>

