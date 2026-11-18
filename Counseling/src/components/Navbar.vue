<template>
  <div class="navbar">
    <div class="flex-box">
      <!-- 绑定点击事件 -->
      <el-button @click="handleCollapse">
        <el-icon>
          <Expand />
        </el-icon>
      </el-button>
      <p class="page-titie">{{ route.meta.title }}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <p class="user-name">admin</p>
          <el-icon>
            <ArrowDown />
          </el-icon>
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
import { useAdminStore } from '@/stores/admin'
import { useRouter,useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus'


const adminStore = useAdminStore()
const router = useRouter()
const route = useRoute()

const handleCollapse = () => {
  adminStore.toggleCollapse()

}

const handleCommand = (command) => {
  console.log(command)
  if (command === 'logout') {
    // 处理退出登录逻辑
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 确认退出登录
      // 清除缓存
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      // 跳转到登录页
      router.push('/auth/login')
    })
  }
}
</script>