import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useData } from 'vitepress'
import { clerkPlugin } from '@clerk/vue'
import HomeLayout from './HomeLayout.vue'
import AppFrame from './AppFrame.vue'
import NavAuth from './NavAuth.vue'
import NavLogo from './NavLogo.vue'
import NotFound from './NotFound.vue'
import './custom.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export default {
  ...DefaultTheme,
  Layout() {
    const { frontmatter } = useData()
    if (frontmatter.value.layout === 'page' && frontmatter.value.home) {
      return h(HomeLayout)
    }
    // Inject the auth control into the nav. NavAuth wraps its Clerk UI in
    // <ClientOnly> itself, so SSR is safe.
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h(NavLogo),
      'nav-bar-content-after': () => h(NavAuth),
      'not-found': () => h(NotFound),
    })
  },
  enhanceApp({ app }) {
    app.component('HomeLayout', HomeLayout)
    app.component('AppFrame', AppFrame)
    // Clerk plugin. Guarded: only initialise in the browser and only when a key
    // is configured, so SSR/builds without the key don't crash.
    if (PUBLISHABLE_KEY && typeof window !== 'undefined') {
      app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
    }
  },
}
