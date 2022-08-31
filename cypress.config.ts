import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '4hbvg2',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      console.log({ on, config })
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
