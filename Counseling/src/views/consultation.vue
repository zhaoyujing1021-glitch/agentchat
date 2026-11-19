<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="iconUrl" style="width: 25px;height:25px" alt="AI助手" />
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
            <el-image :src="iconUrl1" style="width: 30px;height: 30px" />
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
    </div>
    <div class="chat-messages">
  <!-- 欢迎用语 -->
  <div class="message-item ai-message" v-if="message.length === 0">
    <div class="message-avatar">
      <el-image :src="iconUrl" style="width: 18px;height: 18px" />
    </div>
    <div class="message-content">
      <div class="message-bubble">
        <p>您好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？</p>
      </div>
      <div class="message-time">刚刚</div>
    </div>
  </div>
</div>
  </div>
</template>
<script setup>

const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const iconUrl1 = new URL('@/assets/images/like.png', import.meta.url).href

const createNewFrontendSession = () => {

}

// 定义对话消息
const message = ref([])
</script>