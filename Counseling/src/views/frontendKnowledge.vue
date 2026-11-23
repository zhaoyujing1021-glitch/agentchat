<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image :src="iconUrl" style="width: 60px;height: 60px"></el-image>
        <h1>情绪日志</h1>
      </div>
    </div>
    <div class="content">
      <!-- 左侧菜单 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div v-for="item in recommendList" :key="item.id" class="recommend-item">
            <h4>{{ item.title }}</h4>
            <p class="read-count">
              <el-icon>
                <Histogram />
              </el-icon>
              阅读量 {{ item.readCount }}
            </p>
          </div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="article-list">
        <div v-for="item in articleList" :key="item.id" class="article-item">
          <el-image style="width: 240px; height: 150px" :src="getImage(item.coverImage)"></el-image>
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}</h3>
              <el-tag Plain type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon>
                  <Avatar />
                </el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon>
                  <List />
                </el-icon>
                <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</span>
              </div>
            </div>
            <div :style="{ marginTop: '10px' }">
              <div class="flex-box">
                <el-icon>
                  <Platform />
                </el-icon>
                <span>观看人数 {{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="pagination-wrapper">
  <el-pagination
    style="margin-top: 25px"
    :page-size="pagination.size"
    layout="prev, pager, next"
    :total="pagination.total"
    @change="handleChange" />
</div>
  </div>
</template>

<script setup>
import { dayjs, ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { addEmotionDiary, getKnowledgeList } from '@/api/frontend'

// 推荐阅读列表
const recommendList = ref([])

// 右侧列表数据
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

const articleList = ref([])
// 获取列表数据
const getPageList = () => {
  const params = {
    sortField: 'publishedAt',
    sortDirection: 'desc',
    ...pagination
  }
  getKnowledgeList(params).then(res => {
    articleList.value = res.records
    pagination.total = res.total
  })
}
// 获取封面图片
const getImage = (url) => {
  return url ? 'http://159.75.169.224:1235' + url : 'https://file.itndedu.com/psychology_ai.png'
}
const handleChange = (currentPage) => {
  pagination.currentPage = currentPage
  getPageList()
}
onMounted(() => {
  // 获取推荐阅读列表
  const params = {
    sortField: 'readCount',
    sortDirection: 'desc',
    currentPage: 1,
    size: 5
  }
  getPageList()
  getKnowledgeList(params).then(res => {
    // console.log(res)
    recommendList.value = res.records
  })
})

import iconUrl from '@/assets/images/book.png'
</script>
