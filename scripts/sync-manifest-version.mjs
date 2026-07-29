#!/usr/bin/env node
// npm version 生命周期钩子：将 package.json 的新版本号同步到 src/manifest.json，
// 保证扩展包内的 manifest 版本与 git tag / GitHub Release 严格一致。
// 由 package.json 的 "version" script 调用（npm version 会在 bump 后、commit 前执行）。
import { readFileSync, writeFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const manifestPath = 'src/manifest.json'
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

manifest.version = pkg.version
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`src/manifest.json version -> ${pkg.version}`)
