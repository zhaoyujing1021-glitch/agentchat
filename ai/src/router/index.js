import {createRouter,createWebHistory} from 'vue-router'

//路由配置

const router = createRouter({
  history :createWebHistory(),
  routes:[
    {
      path :'/',
      name:'Home',
      component:()=>import('@vitejs/Home-vue')
    }
  ]
})