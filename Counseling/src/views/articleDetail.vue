<template>
  <div class="articleDetail-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px;height: 60px"></el-image>
        <h1>知识文章详情</h1>
      </div>
    </div>
    <div class="content">
      <div class="diary-card">
        <p class="title">文章信息</p>
        <div class="sub-title">
          <el-tag size="large" class="category-tag">{{ articleDetail.categoryName }}</el-tag>
          <div class="flex-box">
            <el-icon>
              <List />
            </el-icon>
            <span>{{ dayjs(articleDetail.updatedAt).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <h1 class="article-title">{{ articleDetail.title }}</h1>
        <div class="summary-content" v-if="articleDetail.summary">
          <p>{{ articleDetail.summary }}</p>
        </div>
        <div :style="{ marginTop: '20px' }" class="flex-box">
          <div class="item flex-box">
            <el-icon>
              <Avatar />
            </el-icon>
            <span>{{ articleDetail.authorName }}</span>
          </div>
          <div class="item flex-box">
            <el-icon>
              <Platform />
            </el-icon>
            <span>{{ articleDetail.readCount }} 次阅读</span>
          </div>
        </div>
      </div>
      <div class="diary-card">
        <div class="title">正文内容</div>
        <div class="content-wrapper" v-html="formatContent(articleDetail.content)"></div>
        <div class="tags-content" v-if="articleDetail.tagArray && articleDetail.tagArray.length">
          <h4 class="tags-title"> 相关标签 </h4>
          <div class="tags-list">
            <el-tag v-for="tag in articleDetail.tagArray" :key="tag" type="info" effect="light" class="tag-item">{{ tag
              }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getKnowledgeDetail } from '@/api/frontend'
import { dayjs } from 'element-plus'
const iconUrl = new URL('@/assets/images/book.png', import.meta.url).href

const props = defineProps({
  id: String
})

const articleDetail = ref({})

const formatContent = (content) => {
  if (!content) return ''

  // 基本的HTML清理和格式化
  let formatted = content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')

  return formatted
}

onMounted(() => {
  getKnowledgeDetail(props.id).then(res => {
    articleDetail.value = res
  })
})
</script>
