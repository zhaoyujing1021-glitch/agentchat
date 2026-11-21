<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconUrl" style="width: 25px; height: 25px" alt="AI助手" />
        </div>
        <h3 class="assistant-name">宁渡AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
    </div>

    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="iconUrl1" style="width: 30px; height: 30px" />
          </div>
          <div class="chat-info">
            <h2>宁渡AI助手</h2>
            <p>您的贴心AI心理健康助手</p>
          </div>
        </div>
        <el-button circle @click="createNewFrontendSession" title="新建会话">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
      </div>

      <div class="chat-messages">
        <!-- 欢迎用语 -->
        <div class="message-item ai-message" v-if="message.length === 0">
          <div class="message-avatar">
            <el-image :src="iconUrl" style="width: 18px; height: 18px" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>您好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？</p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
      </div>
      <!-- 消息输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <el-input v-model="userMessage" placeholder="请输入您想要分享的内容..." type="textarea" :rows="3" :disabled="isAiTying"
            @keydown="handleKeyDown" class="message-input" clearable />
        </div>
        <el-button type="primary" class="send-btn" @click="sendMessage">
          <el-icon>
            <Promotion />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { startSession } from '@/api/frontend'
import { ElMessage } from 'element-plus'

const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const iconUrl1 = new URL('@/assets/images/like.png', import.meta.url).href


// 新建会话
const createNewFrontendSession = () => {
  // 创建一个新的会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新对话'
  }
  currentSession.value = newSession
}

// 定义一个当前会话对象
const currentSession = ref(null)
// 定义对话消息
const message = ref([])
// 定义用户输入消息
const userMessage = ref('')
// 定义AI助手是否正在输入
const isAiTyping = ref(false)
//定义处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
const sendMessage = () => {
  if (!userMessage.value.trim()) return

  if (isAiTyping.value) {
    ElMessage.error('AI助手正在输入中，请稍后')
    return
  }

  const message = userMessage.value.trim()
  userMessage.value = ''

  // 如果没有会话或者是临时会话，就需要创建一个新的会话
  if (currentSession.value.status === 'TEMP') {
    startNewSession(message)
  }
}

const startNewSession = (message) => {
  // 构建会话参数
  const sessionParams = {
    initialMessage: message
  }
  if (currentSession.value.sessionTitle === '新对话') {
    sessionParams.sessionTitle = `宁渡AI助手 - ${new Date().toLocaleString()}`
  } else {
    // 如果历史会话记录
    sessionParams.sessionTitle = currentSession.value.sessionTitle
  }
  // 调用后端接口创建新会话
  startSession(sessionParams).then(res => {
    // 将后端返回的数据转为前端会话格式
    const sessionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: sessionParams.sessionTitle
    }
    // 如果当前是临时会话，更新数据
    if (currentSession.value && currentSession.value.status === 'TEMP') {
      // 更新为正式会话
      Object.assign(currentSession.value, sessionData)
    } else {
      // 否则，创建一个新的会话
      currentSession.value = sessionData
    }
  })
}

onMounted(() => {
  // 初始化时创建一个新会话
  createNewFrontendSession()
})
</script>