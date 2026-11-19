<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">
          一次温暖的对话<br/>
          <span class="highlight-text">化孤独为慰藉</span>
        </h2>
<p class="description">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
<div class="hero-actions">
  <el-button size="large">开始倾诉，获得陪伴</el-button>
  <el-button size="large" style="border-color: #fff" color="transparent">记录心情，释放情感</el-button>
</div>
      </div>
      <div class="robot">
        <el-image style="width: 150px; height: 150px" :src="iconUrl" alt="机器人" class="robot-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const iconUrl = new URL('@/assets/images/robot-fill.png', import.meta.url).href

</script>