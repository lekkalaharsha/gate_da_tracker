# GATE DA Tracker

**Interactive, offline GATE Data Science study tracker** with automatic scheduling, revision planning, CSV import/export, progress stats, and an integrated 12-week archery training plan. Built with pure HTML/CSS/JS and ideal for hosting on GitHub Pages.

---

## Live demo / source

The uploaded HTML file for this project is available here (local file path used for repo packaging):

`ndex.html`

---

## Features

* Automatic target date assignment, 10-day revision, and final revision windows
* Per-subtopic: Completed / Revised / Practiced toggles and notes
* Importance markers (★ / ★★)
* CSV export/import for backup and transfer
* Auto-updating progress summary and color-coded rows (overdue, due soon, done)
* 12-week archery training schedule with per-session tracking
* Fully client-side; uses `localStorage` for persistence

---

## How to run

**Locally**

1. Download or clone the repo.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge).

**Host on GitHub Pages**

1. Create a new GitHub repository and push the files.
2. In the repository Settings → Pages, set the source to the `main` branch and the root folder.
3. Visit `https://<your-username>.github.io/<your-repo>/` after deployment.

---

## File structure

```
📁 root
└── index.html   # Main application (HTML + CSS + JS)
```

You may optionally split CSS and JS into separate files for better maintainability.

---

## Customization ideas

* Add dark mode toggle
* Export calendar (.ics) for scheduled targets
* Cloud sync (Google Drive/Dropbox) or GitHub Actions-based backups
* Convert to a React app or include chart visualizations for progress

---

## License

MIT License — feel free to use or modify for personal study or to share with peers.

---

## Credits

Built with help from ChatGPT. Original HTML file: `/mnt/data/index.html`.
