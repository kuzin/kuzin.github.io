// Stamps tools/template.html out at every address the old bs-prototypes site had — the landing page, each registry
// entry and each demo-video page — plus the catch-all 404.html GitHub Pages serves for anything else.
//
//   node tools/build.mjs <path to a bs-prototypes checkout> --shuts-down 2026-11-14
//
// Run it from this repo's root on the day of the move: --shuts-down is the move date plus 30 days.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const repo = resolve(args.find((a) => !a.startsWith('--')) ?? '')
const i = args.indexOf('--shuts-down')
const date = i >= 0 ? args[i + 1] : null
if (!repo || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
  console.error('Usage: node tools/build.mjs <bs-prototypes checkout> --shuts-down YYYY-MM-DD')
  process.exit(1)
}
const root = resolve(dirname(new URL(import.meta.url).pathname), '..')
const template = readFileSync(join(root, 'tools/template.html'), 'utf8').replace(
  /var SHUTS_DOWN_ON = '[^']*'/,
  `var SHUTS_DOWN_ON = '${date}'`,
)
const { PROTOTYPES } = await import(pathToFileURL(join(repo, 'site/prototypes.js')).href)
const videos = JSON.parse(readFileSync(join(repo, 'site/demoVideos.json'), 'utf8'))
// (only what this script makes is replaced: the README and tools stay)
rmSync(join(root, 'bs-prototypes'), { recursive: true, force: true })
const page = (path) => {
  const file = join(root, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, template)
}
const paths = new Set(['bs-prototypes/index.html'])
for (const p of PROTOTYPES) paths.add(`${p.href.replace(/^\//, '')}index.html`)
for (const v of videos) paths.add(`bs-prototypes/watch/${v.id}/index.html`)
for (const p of paths) page(p)
page('404.html')
writeFileSync(join(root, '.nojekyll'), '')
console.log(`${paths.size} pages + 404.html, old addresses stop working on ${date}`)
