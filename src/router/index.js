import { createRouter, createWebHashHistory } from 'vue-router'
import PublicView from '../views/PublicView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'

const NAME = 'M. Irfan Maulana'
const HOME_TITLE = `${NAME} · Software Engineer & Product Manager`

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: PublicView, meta: { title: HOME_TITLE } },
    { path: '/projects', component: ProjectsView, meta: { title: `Projects · ${NAME}` } },
    { path: '/admin/login', component: LoginView, meta: { title: `Admin · ${NAME}` } },
    {
      path: '/admin',
      component: DashboardView,
      meta: { requiresAuth: true, title: `Admin · ${NAME}` },
    },
    {
      path: '/admin/settings',
      component: () => import('../views/admin/SettingsView.vue'),
      meta: { requiresAuth: true, title: `Admin · ${NAME}` },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const authenticated = !!localStorage.getItem('admin_jwt')
  if (to.meta.requiresAuth && !authenticated) return '/admin/login'
  if (to.path === '/admin/login' && authenticated) return '/admin'
})

router.afterEach((to) => {
  document.title = to.meta.title || HOME_TITLE
})

export default router
