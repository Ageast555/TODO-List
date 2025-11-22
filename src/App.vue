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
              共 0 项
            </div>
          </div>
          
          <!-- 空状态 -->
          <div class="empty-state">
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
        <a-radio value="title">按标题排序</a-radio>
      </a-radio-group>
      <div style="margin-top: 16px">
        <a-checkbox v-model:checked="sortDesc">降序</a-checkbox>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FilterOutlined } from '@ant-design/icons-vue'
import Sidebar from './components/Sidebar.vue'
import TodoForm from './components/TodoForm.vue'

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


const filteredTodos = ref([])
const categoryTodosCount = ref(0)

const handleCategoryChange = () => {}
const handleSearch = () => {}
const handleToggle = () => {}
const handleDelete = () => {}
const handleEdit = () => {}
const handleSubmit = () => {}
const handleCancelEdit = () => {}
const handleSelect = () => {}
const batchComplete = () => {}
const batchDelete = () => {}
const clearSelection = () => {}
const applySort = () => {
  showSortModal.value = false
}
</script>

