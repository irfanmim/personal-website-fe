import { createRouter, createWebHashHistory } from 'vue-router'
import PublicView from '../views/PublicView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: PublicView },
    { path: '/projects', component: ProjectsView },
    { path: '/admin/login', component: LoginView },
    {
      path: '/admin',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/settings',
      component: () => import('../views/admin/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const authenticated = !!localStorage.getItem('admin_jwt')
  if (to.meta.requiresAuth && !authenticated) return '/admin/login'
  if (to.path === '/admin/login' && authenticated) return '/admin'
})

export default router
