module.exports = {
  verbose: false,
  sourceDir: './src',
  artifactsDir: './dist',
  lint: {
    output: 'json',
    pretty: true
  },
  build: {
    overwriteDest: true
  },
  run: {
    browserConsole: true,
    firefoxProfile: './firefox-profile',
    profileCreateIfMissing: true,
    keepProfileChanges: true,
    pref: [],
    target: ['firefox-desktop'],
    watchIgnored: ['node_modules/**', 'dist/**', 'firefox-profile/**']
    // firefox: '~/Desktop/firefox/firefox'
  }
}
