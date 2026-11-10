<template>
  <div class="auth-layout">
    <div class="left-section">
        <div class="content">
          <h2 class="title">心理ai助手</h2>
          <p class="text">鸡汤文案</p>
          <div class="robot">
            <el-image style="width: 90px; height: 90px;" :src="iconUrl"></el-image>
          </div>
        </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
  const iconUrl = new URL('@/assets/images/robot.png', import.meta.url).href
</script>