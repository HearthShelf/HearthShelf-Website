import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useData } from 'vitepress'
import HomeLayout from './HomeLayout.vue'
import AppFrame from './AppFrame.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    const { frontmatter } = useData()
    if (frontmatter.value.layout === 'page' && frontmatter.value.home) {
      return h(HomeLayout)
    }
    return h(DefaultTheme.Layout)
  },
  enhanceApp({ app }) {
    app.component('HomeLayout', HomeLayout)
    app.component('AppFrame', AppFrame)
  }
}
