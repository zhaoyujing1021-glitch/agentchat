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
    <el-row style="margin-top: 20px;" :gutter="20">
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">
              情绪趋势分析
            </div>
          </template>
          <div class="chart-content">
            <div class="chart-content">
              <div ref="emotionChartRef" style="width: 100%; height:300px"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
  </div>
</template>
<script setup>
import { getAnalyticsOverview } from '@/api/admin'
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// 统计图片引入
const iconUrl1 = new URL('@/assets/images/users.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const iconUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const aiData = ref({})

// 情绪趋势
let emotionChart = null
const emotionChartRef = ref(null)

// 初始化图标
const initCharts = () => {
  initEmotionChart()
}

const initEmotionChart = () => {
  if (!emotionChartRef.value) return
  // 销毁现有的图表
  if (emotionChart) {
    emotionChart.dispose()
  }
  //创建echarts实例
  emotionChart = echarts.init(emotionChartRef.value)
  // 获取情绪趋势的数据
  const TrendData = aiData.value.emotionTrend
  // 配置项
  const option = {
    title: {
      text: '情绪趋势分析',
        textStyle: {
          color: '#2d3436',
          fontSize: 16,
          fontWeight: 600
        },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 40
    },
    grid: { // 控制容器样式
      left: '3%',
      right: '4%',
      top: 80,
      bottom: '3%'
    },
    xAxis: {
      type: 'category',
      data: TrendData.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#2d3436'
        }
      }
    },
    yAxis: [{
      type: 'value',
      name: '情绪评分',
      position: 'left',
      axisLine: {
        lineStyle: {
          color: '#2d3436'
        }
      }
    },{
      type: 'value',
      name: '记录数量',
      position: 'right',
      axisLine: {
        lineStyle: {
          color: '#2d3436'
        }
      }
    }],
    series: [{
      name: '平均情绪评分',
      type: 'line',
      data: TrendData.map(item => item.avgMoodScore),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#fab1a0'
      },
      itemStyle: {
        color: '#fab1a0'
      }
    },
    {
      name: '记录数量',
      type: 'line',
      data: TrendData.map(item => item.recordCount),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#faebaf'
      },
      itemStyle: {
        color: '##faebaf'
      }
    }]
  }
  emotionChart.setOption(option)
}

onMounted(() => {
  getAnalyticsOverview().then(res => {
    console.log(res)
    aiData.value = res
    initCharts()
  })
})

</script>