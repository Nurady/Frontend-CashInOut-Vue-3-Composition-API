import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/cashes/:slug',
    name: 'cash.show',
    component: () => import(/* webpackChunkName: "show" */ '../views/Show.vue'),
    meta: {
        auth: true
    }
  },
  {
    path: '/cash',
    name: 'cash',
    component: () => import(/* webpackChunkName: "cash" */ '../views/Cash.vue'),
    meta: {
        auth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/auth/Login.vue'),
    meta: {
        guest: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/auth/Register.vue'),
    meta: {
        guest: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'bg-indigo-500 hover:bg-blue-600 text-white rounded-lg'
})

router.beforeEach((to, from, next) => {
    if (to.meta.auth && !store.getters['auth/authenticated']) {
      router.push("/login")
    }  
    if (to.meta.guest && store.getters['auth/authenticated']) {
      router.push("/")
    }  
    next()
})

export default router
