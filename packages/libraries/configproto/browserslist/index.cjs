// @see https://github.com/browserslist/browserslist#shareable-configs
// ^ you have to disable validation via BROWSERSLIST_DANGEROUS_EXTEND=1 npx webpack
// @see https://github.com/browserslist/browserslist#configuring-for-different-environments
module.exports = {
  client: ['defaults'],
  node: ['node >= 14'],
  ssr: ['defaults and node >= 14']
}
