const run = {
  // firefox: '~/Desktop/firefox/firefox'
  // watchIgnored: ['node_modules/**', 'dist/**', 'firefox-profile/**']
  browserConsole: false, // ctrl shift alt i
  firefoxProfile: 'firefox-profile', // will show a popup each time for you to select a profile
  keepProfileChanges: true,
  pref: [],
  profileCreateIfMissing: true,
  target: ['firefox-desktop'],
};

module.exports = {
  artifactsDir: './dist',
  build: { overwriteDest: true },
  lint: { output: 'json', pretty: true },
  run,
  sourceDir: './dist',
  verbose: false,
};
