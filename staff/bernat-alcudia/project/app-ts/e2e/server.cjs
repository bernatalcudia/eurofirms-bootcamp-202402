const { spawn } = require('node:child_process')
const path = require('node:path')
const { createRequire } = require('node:module')

const appDir = path.resolve(__dirname, '..')
const apiDir = path.resolve(appDir, '..', 'api-ts')
const apiRequire = createRequire(path.join(apiDir, 'package.json'))
const { MongoMemoryReplSet } = apiRequire('mongodb-memory-server')
let mongo
const children = []
let stopping = false

function start(file, args, cwd, env) {
  const child = spawn(process.execPath, [file, ...args], { cwd, env, stdio: 'inherit' })
  children.push(child)
  child.on('exit', code => {
    if (!stopping) {
      console.error(`Test server exited unexpectedly: ${code}`)
      void stop(1)
    }
  })
}

async function stop(code) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill()
  if (mongo) await mongo.stop()
  process.exit(code)
}

process.on('SIGINT', () => void stop(0))
process.on('SIGTERM', () => void stop(0))

async function main() {
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
  start(path.join(apiDir, 'node_modules', 'tsx', 'dist', 'cli.mjs'), ['index.ts'], apiDir, {
    ...process.env,
    MONGO_URL: mongo.getUri('browser-e2e'),
    JWT_SECRET: 'test-only-local-secret-not-for-production',
    PORT: '19010',
    CORS_ORIGINS: 'http://127.0.0.1:19081,http://localhost:19081',
  })
  start(path.join(appDir, 'node_modules', 'expo', 'bin', 'cli'), ['start', '--web', '--port', '19081'], appDir, {
    ...process.env,
    CI: '1',
    EXPO_NO_DOTENV: '1',
    EXPO_PUBLIC_API_URL: 'http://127.0.0.1:19010',
  })
}

main().catch(error => {
  console.error('Could not start isolated test servers:', error)
  void stop(1)
})
