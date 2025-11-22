<template>
  <div class="todo-item" :class="{ completed: todo.completed, selected: selected }" @click="handleItemClick">
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


const handleToggle = () => {}
const handleDelete = () => {}
const handleEdit = () => {}
const handleSelect = () => {}
const handleItemClick = () => {}

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
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

