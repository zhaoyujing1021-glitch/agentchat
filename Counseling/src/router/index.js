import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'

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
          title: '注册', 
        }
      }
    ]
  }
]
const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue')
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue')
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue')
      },
      {
        path: 'knowledge',
        component: () => import('@/views/frontendKnowledge.vue')
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
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
      } else if (userInfo.userType == 1) {
        // 用户端账号只能访问前台路由
        if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
          next('/')
        } else {
          next()
        }

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