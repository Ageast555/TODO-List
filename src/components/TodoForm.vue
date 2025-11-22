<template>
  <div>
    <a-form :model="formData" layout="vertical">
      <a-form-item label="标题" class="form-item">
        <a-input
          v-model:value="formData.title"
          placeholder="请输入待办事项标题"
          :maxlength="100"
          show-count
        />
      </a-form-item>

      <a-form-item label="描述" class="form-item">
        <a-textarea
          v-model:value="formData.description"
          placeholder="请输入待办事项描述（可选）"
          :rows="4"
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <a-form-item label="分类" class="form-item">
        <a-select
          v-model:value="formData.category"
          placeholder="请选择分类"
        >
          <a-select-option value="work">工作</a-select-option>
          <a-select-option value="study">学习</a-select-option>
          <a-select-option value="life">生活</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="优先级" class="form-item">
        <a-slider
          v-model:value="formData.priority"
          :min="1"
          :max="3"
          :marks="priorityMarks"
          class="priority-slider"
        />
        <div class="priority-labels">
          <span>低</span>
          <span>中</span>
          <span>高</span>
        </div>
      </a-form-item>

      <a-form-item>
        <a-button 
          type="primary" 
          @click="handleSubmit"
          :disabled="!formData.title"
          block
          size="large"
        >
          {{ isEditing ? '更新' : '添加' }}
        </a-button>
        <a-button 
          v-if="isEditing"
          @click="handleCancel"
          block
          style="margin-top: 8px"
        >
          取消
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  title: '',
  description: '',
  category: 'life',
  priority: 1
})

const priorityMarks = {
  1: '低',
  2: '中',
  3: '高'
}

const isEditing = computed(() => {
  return props.todo && props.todo.id
})

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    formData.value = {
      title: newTodo.title || '',
      description: newTodo.description || '',
      category: newTodo.category || 'life',
      priority: newTodo.priority || 1
    }
  } else {
    formData.value = {
      title: '',
      description: '',
      category: 'life',
      priority: 1
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    return
  }
  
  emit('submit', {
    ...formData.value,
    title: formData.value.title.trim(),
    description: formData.value.description.trim()
  })
  
  if (!isEditing.value) {
    formData.value = {
      title: '',
      description: '',
      category: 'life',
      priority: 1
    }
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

