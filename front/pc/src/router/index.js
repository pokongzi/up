import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('@/views/DownloadView.vue'),
      meta: { title: '资料下载' }
    },
    {
      path: '/questions',
      name: 'questions',
      component: () => import('@/views/QuestionsView.vue'),
      meta: { title: '真题在线查看' }
    },
    {
      path: '/questions/:id',
      name: 'question-detail',
      component: () => import('@/views/QuestionDetailView.vue'),
      meta: { title: '题目详情' }
    },
    {
      path: '/mock',
      name: 'mock',
      component: () => import('@/views/MockView.vue'),
      meta: { title: '在线模拟' }
    },
    {
      path: '/mock/:id',
      name: 'mock-exam',
      component: () => import('@/views/MockExamView.vue'),
      meta: { title: '模拟考试' }
    },
    {
      path: '/mock/result/:id',
      name: 'mock-result',
      component: () => import('@/views/MockResultView.vue'),
      meta: { title: '考试结果' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 申小行真题`
  }
  next()
})

export default router
