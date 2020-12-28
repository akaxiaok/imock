module.exports = {
  lintOnSave: false,
  devServer: {
    // proxy: {
    //   '/': {
    //     target: 'http://localhost:5000',
    //     ws: false,
    //     changeOrigin: true
    //   },
    // }
  },
  configureWebpack: config => {
    config.externals = {
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'highlight.js': 'hljs',
    };
  },
};

