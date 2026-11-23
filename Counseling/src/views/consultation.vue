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
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">中性</div>
          <div class="emotion-score">50</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <span class="status-emotion">{{ currentEmotion.isNegative ? '需要关注' : '很不错' }}</span>
          </div>
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span v-for="dot in 3" :key="dot" class="dot"
                :class="{ 'active': getIntensityClass(currentEmotion.emotionScore) >= dot }"></span>
            </span>
            <span class="intensity-text">
              {{ getRiskText(currentEmotion.riskLevel) }}
            </span>
          </div>
          <!-- 温暖建议卡片 -->
          <div class="warm-suggestion" v-if="currentEmotion.suggestion">
            <div class="suggestion-icon">💖</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
            </div>
          </div>
          <!-- 治愈行动 -->
          <div class="healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
            <div class="actions-title">治愈小行动</div>
            <div class="actions-list">
              <div v-for="action in currentEmotion.improvementSuggestions" :key="action" class="action-item">
                <div class="action-icon">✨</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <!-- 风险提示 -->
          <div class="risk-notice" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">温馨提示</div>
              <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
            </div>
          </div>
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
        <div class="message-item ai-message" v-if="messages.length === 0">
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
        <div v-for="msg in messages" :key="msg.id" class="message-item"
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
          <el-input v-model="userMessage" placeholder="请输入您想要分享的内容..." type="textarea" :rows="3" :disabled="isAiTyping"
            @keydown="handleKeyDown" class="message-input" clearable />
          <div class="input-footer">
            <span>按Enter发送，Shift...</span>
            <span>{{ userMessage.length }}/500</span>
          </div>
        </div>
        <el-button :disabled="!userMessage.trim() || userMessage.length > 500" type="primary" class="send-btn"
          @click="sendMessage">
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
import { startSession, getSessionList, deleteSession, getSessionDetail, getSessionEmotion } from '@/api/frontend'
import { ElMessage } from 'element-plus'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const iconUrl1 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/users.png', import.meta.url).href

// 新建会话
// 新建会话
const createNewFrontendSession = () => {
  console.log('createNewFrontendSession triggered')

  // 如果正在流式输出，视需求决定是否允许切换或先重置状态
  isAiTyping.value = false
  userMessage.value = ''
  messages.value = [] // 若希望新建后回到初始欢迎语状态，建议清空旧消息

  currentSession.value = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新对话'
  }
}

// 定义一个当前会话对象
const currentSession = ref(null)
const sessionList = ref([])
// 定义对话消息
const messages = ref([])
// 定义用户输入消息
const userMessage = ref('')
// 定义AI助手是否正在输入
const isAiTyping = ref(false)

// 情绪花园
const currentEmotion = ref({
  primaryEmotion: '中性',
  emotionScore: 50,
  isNegative: false,
  riskLevel: 0,
  suggestion: '情绪状态平稳',
  improvementSuggestions: []
})
const loadSessionEmotion = (sessionId) => {
  // 确保sessionID格式正确
  const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`

  getSessionEmotion(id).then(res => {
    console.log(res)
    currentEmotion.value = res
  })
}

const getIntensityClass = (score) => {
  if (score >= 61) {
    return 3
  }
  if (score >= 31) {
    return 2
  }
  return 1
}
const getRiskText = (level) => {
  switch (level) {
    case 0:
      return '正常'
    case 1:
      return '关注'
    case 2:
      return '预警'
    case 3:
      return '危机'
    default:
      return '正常'
  }
}
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
  } else {
    // 继续现有会话
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createAt: new Date().toISOString()
    })
    startAIResponse(currentSession.value.sessionId, message)
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
    // 添加初始用户消息
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createAt: new Date().toISOString()
    })
    // 开始流式对话
    startAIResponse(currentSession.value.sessionId, message)

  })
}
const startAIResponse = (sessionId, userMessage) => {
  // 防止重复发送
  if (isAiTyping.value) {
    ElMessage.error('AI助手正在输入中，请稍后')
    return
  }

  isAiTyping.value = true

  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    senderType: 2,
    content: '',
    createAt: new Date().toISOString()
  }
  messages.value.push(aiMessage)

  // 调用流式接口
  const ctrl = new AbortController() // 用来中止fetch请求
  fetchEventSource('/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('token'),
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({
      sessionId,
      userMessage
    }),
    signal: ctrl.signal,
    onopen: (response) => {
      console.log(response)
      if (response.headers.get('Content-Type') !== 'text/event-stream') {
        ElMessage.error('服务器返回非流式数据')
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim()
      if (!raw) return
      const eventName = event.event
      // 当前会话的AI消息
      const aiMessage = messages.value[messages.value.length - 1]

      if (eventName === 'done') {
        isAiTyping.value = false
        ctrl.abort()
        //进行情绪分析
        loadSessionEmotion(currentSession.value.sessionId)
        return
      }
      const payload = JSON.parse(raw)
      const ok = String(payload.code) === '200'
      if (ok && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content
      } else if (!ok) {
        // 错误回复的显示
        handleError(payload.message || 'AI回复失败')
      }
    },
    onerror: (err) => {
      handleError(err || 'AI回复失败')
      throw err
    },
    onclose: () => {
      // 开始情绪分析
      loadSessionEmotion(currentSession.value.sessionId)
    }
  })
}

// 错误处理函数
const handleError = (error) => {
  // 当前会话的AI消息
  const aiMessage = messages.value[messages.value.length - 1]
  if (aiMessage) {
    aiMessage.content = 'AI回复失败，请重试'
  }
  isAiTyping.value = false
  ElMessage.error('AI回复失败，请重试')
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
    messages.value = res
  })
  loadSessionEmotion(session.id)
  // 更新当前会话对象数据
  const sessionData = {
    sessionId: "session_" + session.id,
    status: 'ACTIVE',
    sessionTitle: session.sessionTitle
  }
  currentSession.value = sessionData
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