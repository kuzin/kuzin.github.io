# kuzin.github.io

bs-prototypes moved to **https://zoobean.github.io/bs-prototypes/**. Every old address under
`kuzin.github.io/bs-prototypes/` shows a page with its new link, for 30 days after the move.
Generated from the bs-prototypes registry; nothing else lives here.

## On the day of the move

```bash
node tools/build.mjs ../bs-prototypes --shuts-down <the move date + 30 days, YYYY-MM-DD>
git add -A && git commit -m "Moved-page notices, live" && git checkout main && git merge staged && git push
```

30 days later, switch the notices off (Settings → Pages, or delete the `bs-prototypes/` folder and `404.html` from `main`).
