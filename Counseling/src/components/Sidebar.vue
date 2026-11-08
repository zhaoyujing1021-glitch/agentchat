<template>
  <el-aside width="264px">
    <el-menu
        default-active="2"
        @open="handleOpen"
        @close="handleClose"
        class="menu-style"
      >
        <div class="brand">
          <el-image style="width: 50px;height: 50px;" :src="iconUrl" alt="logo" />
          <div class="info-card">
            <h1 class="brand-title">こころAI</h1>
            <p class="brand-subtitle">管理画面</p>
          </div>
        </div>
        <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
       
      </el-menu>
  </el-aside>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter()

const iconUrl = new URL('@/assets/images/logo.png',import.meta.url).href

const selectMenu =(key) =>{
  console.log(key)
  const currentRoute = router.options.routes[0] 
  router.push(`${currentRoute.path}/${key.index}`)
}
</script>
