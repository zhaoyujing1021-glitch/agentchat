<template>
  <div class="dashboard-container">
    <el-row :gutter="20" v-if="aiData.systemOverview">
      <!-- 总用户数 -->
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar users">
              <el-image style="width: 40px; height: 40px" :src="iconUrl1" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="value">{{ aiData.systemOverview.totalUsers }}</p>
              <p class="subtitle-title">活跃用户: {{ aiData.systemOverview.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 情绪日志 -->
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar like">
              <el-image style="width: 40px; height: 40px" :src="iconUrl2" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="value">{{ aiData.systemOverview.totalDiaries }}</p>
              <p class="subtitle-title">今日新增: {{ aiData.systemOverview.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 咨询会话 -->
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar comments">
              <el-image style="width: 40px; height: 40px" :src="iconUrl3" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="value">{{ aiData.systemOverview.totalSessions }}</p>
              <p class="subtitle-title">今日新增: {{ aiData.systemOverview.todayNewSessions }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 平均情绪 -->
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="avatar smile">
              <el-image style="width: 40px; height: 40px" :src="iconUrl4" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="value">{{ aiData.systemOverview.avgMoodScore }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { getAnalyticsOverview } from '@/api/admin'
import { onMounted, ref } from 'vue'

// 统计图片引入
const iconUrl1 = new URL('@/assets/images/users.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const iconUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const aiData = ref({})
onMounted(() => {
  getAnalyticsOverview().then(res => {
    console.log(res)
    aiData.value = res
  })
})

</script>