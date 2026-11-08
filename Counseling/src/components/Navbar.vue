<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button>
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-titie">导航栏</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
          <el-dropdown-item command="logout">ログアウト</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const handleCommand =(command) =>{
  if(command === 'logout')
  console.log(key)
  const currentRoute = router.options.routes[0] 
  router.push(`${currentRoute.path}/${key.index}`)
}
</script>