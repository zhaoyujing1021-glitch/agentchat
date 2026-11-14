import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const isCollapse = ref(false)
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
    
  }

  return {
    isCollapse,
    toggleCollapse
  }
})
export function createArticle(data) {
  return service.post('/knowledge/article', data)
}

export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}
