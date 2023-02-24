import { defineBuildConfig } from 'unbuild'

/**
 * 执行打包程序
 */
export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      minify: true
    }
  },
  alias: {
    // we can always use non-transpiled code since we support 14.18.0+
    prompts: 'prompts/lib/index.js'
  },
  hooks: {
    'rollup:options'(ctx, options) {
      if (!options.plugins) {
        options.plugins = []
      }
    }
  }
})
