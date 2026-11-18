import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'

//アクセス バックエンド
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情感分析',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册', // 【修改】原先meta.title重复写成了登录
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: backendRoutes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    try {
      const userInfoStr = localStorage.getItem('userInfo')
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null
      
      if (userInfo && userInfo.userType == 2) {
        if (to.path.startsWith('/back')) {
          next()
        } else {
          next('/back/dashboard')
        }
      } else {
        // 【修改】如果 userType 不是 2 或者 userInfo 为空，防止卡死，给个默认处理或放行
        next()
      }
    } catch (e) {
      // 解析 JSON 失败说明缓存脏了，清除并跳回登录
      localStorage.clear()
      next('/auth/login')
    }
  } else {
    if (to.path.startsWith('/back')) {
      // 如果是访问后台页面，那么跳转到登录页
      next('/auth/login')
    } else {
      next()
    }
  }
})

export default router