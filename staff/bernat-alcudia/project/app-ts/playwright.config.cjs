const { defineConfig } = require('@playwright/test')
const fs = require('node:fs')
const path = require('node:path')

const chrome = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (process.platform === 'win32' && process.env.ProgramFiles
    ? path.join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe')
    : '')

module.exports = defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.cjs',
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:19081',
    browserName: 'chromium',
    actionTimeout: 10000,
    launchOptions: chrome && fs.existsSync(chrome) ? { executablePath: chrome } : {},
    viewport: { width: 1200, height: 900 },
  },
  webServer: {
    command: 'node e2e/server.cjs',
    url: 'http://127.0.0.1:19081',
    timeout: 240000,
    reuseExistingServer: false,
  },
})
