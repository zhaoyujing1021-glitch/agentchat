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
      <!-- 会话列表 -->
      <div class="session-history">
        <h4 class="section-title">会话列表</h4>
        <div class="session-list">
          <div v-for="session in sessionList" :key="session.id" @click="handleSessionClick(session)"
            class="session-item">
            <div class="session-info">
              <div class="session-title">
                <span>{{ session.sessionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <div class="session-preview">
                  {{ session.lastMessageContent }}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon>
                      <ChatRound />
                    </el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon>
                      <Clock />
                    </el-icon>
                    {{ session.durationMinutes || 0 }} 分钟
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button text type="danger" size="mini" @click="handleDeleteSession(session.id)">
                  <el-icon>
                    <DeleteFilled />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
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
        <!-- 消息列表 -->
        <div v-for="msg in message" :key="msg.id" class="message-item"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'">
          <div class="message-avatar">
            <el-image v-if="msg.senderType === 1" style="width: 18px; height: 18px" :src="iconUrl2"></el-image>
            <el-image v-if="msg.senderType === 2" style="width: 18px; height: 18px" :src="iconUrl"></el-image>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <!-- AI正在思考中 -->
              <div v-if="msg.senderType === 2 && isAiTyping && !msg.content" class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- AI错误提示 -->
              <div v-else-if="msg.isError" class="error-message">
                <p>{{ msg.content }}</p>
              </div>
              <!-- AI正常返回消息 -->
              <MarkdownRenderer v-else-if="msg.senderType === 2 && !msg.isError" :content="msg.content"
                :is-ai-message="true" />
              <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
            </div>
            <div class="message-time">{{ msg.senderType === 2 && isAiTyping ? '正在输入中...' : msg.createdAt }}</div>
          </div>
        </div>
      </div>
      <!-- 消息输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <el-input
            v-model="userMessage"
            placeholder="请输入您想要分享的内容..."
            type="textarea"
            :rows="3"
            :disabled="isAiTyping"
            @keydown="handleKeyDown"
            class="message-input"
            clearable
          />
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
import { startSession, getSessionList, deleteSession, getSessionDetail } from '@/api/frontend'
import { ElMessage } from 'element-plus'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const iconUrl1 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/users.png', import.meta.url).href

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
const sessionList = ref([])
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
    // 更新会话列表
    getSessionPage()
  })
}
const getSessionPage = () => {
  getSessionList({
    pageNum: 1,
    pageSize: 10
  }).then(res => {
    console.log(res)
    sessionList.value = res.records
  })
}

// 获取会话数据
const handleSessionClick = (session) => {
  console.log(session, 'session')
  // 点击会话时，获取会话详情
  getSessionDetail(session.id).then(res => {
    console.log(res)
    message.value = res
  })
}

const handleDeleteSession = (sessionId) => {
  deleteSession(sessionId).then(res => {
    ElMessage.success('删除成功')
    getSessionPage()
  })
}

// 简单的换行逻辑
const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br>')
}
onMounted(() => {
  getSessionPage()
  // 初始化时创建一个新会话
  createNewFrontendSession()
})
</script>