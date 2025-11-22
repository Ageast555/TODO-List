<template>
  <div class="sidebar">
    <div
      v-for="category in categories"
      :key="category.id"
      class="sidebar-item"
      :class="{ active: activeCategory === category.id }"
      @click="$emit('category-change', category.id)"
    >
      <component :is="getIcon(category.icon)" />
      <span>{{ category.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { 
  HomeOutlined, 
  FolderOutlined, 
  BookOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  activeCategory: {
    type: String,
    default: 'all'
  }
})

defineEmits(['category-change'])

const categories = [
  { id: 'all', name: '全部', icon: 'HomeOutlined' },
  { id: 'work', name: '工作', icon: 'FolderOutlined' },
  { id: 'study', name: '学习', icon: 'BookOutlined' },
  { id: 'life', name: '生活', icon: 'AppstoreOutlined' }
]

const getIcon = (iconName) => {
  const icons = {
    HomeOutlined,
    FolderOutlined,
    BookOutlined,
    AppstoreOutlined
  }
  return icons[iconName] || HomeOutlined
}
</script>

