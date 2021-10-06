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
    browserConsole: false, // ctrl shift alt i
    firefoxProfile: 'firefox-profile', // will show a popup each time for you to select a profile
    profileCreateIfMissing: true,
    keepProfileChanges: true,
    pref: [],
    target: ['firefox-desktop'],
    watchIgnored: ['node_modules/**', 'dist/**', 'firefox-profile/**']
    // firefox: '~/Desktop/firefox/firefox'
  }
}
