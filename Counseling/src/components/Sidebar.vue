<template>
  <el-aside :width="isCollapse ? '64px' : '264px'">
    <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        default-active="2"
        class="menu-style"
      >
        <div class="brand">
          <el-image style="width: 50px;height: 50px;" :src="iconUrl" alt="logo" />
          <div class="info-card" v-show="!isCollapse">
            <h1 class="brand-title">こころAI</h1>
            <p class="brand-subtitle">管理画面</p>
          </div>
        </div>
        <el-menu-item @click="selectMenu(item)" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <template #title><span>{{ item.meta.title }}</span></template>
        </el-menu-item>
     </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const iconUrl = new URL('@/assets/images/logo.png', import.meta.url).href


const isCollapse = computed(() => adminStore.isCollapse)

const selectMenu = (item) => {
  const currentRoute = router.options.routes[0]  
  router.push(`${currentRoute.path}/${item.path}`)
}
</script>