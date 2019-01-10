const appConfig = require('./src/app.config')

module.exports = {
  configureWebpack: {
    name: appConfig.title,
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  css: {
    sourceMap: true
  },
  devServer: {
    port: 5858,
    ...(process.env.VUE_APP_API
      ? // 代理生产地址.
        {
          proxy: {
            '/api': {
              target: process.env.VUE_APP_API
            }
          }
        }
      : // 代理本地地址.
        {})
    // { before: require('./tests/mock-api') }),
  }
}
