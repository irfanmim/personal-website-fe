import { createRouter, createWebHashHistory } from 'vue-router'
import PublicView from '../views/PublicView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: PublicView },
    { path: '/projects', component: ProjectsView },
    { path: '/admin/login', component: LoginView },
    {
      path: '/admin',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const authenticated = sessionStorage.getItem('admin_token') === 'authenticated'
  if (to.meta.requiresAuth && !authenticated) return '/admin/login'
  if (to.path === '/admin/login' && authenticated) return '/admin'
})

export default router
