module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => config.plugins.delete('named-chunks'),
  devServer: {
    proxy: 'http://localhost:8080'
  }
}
