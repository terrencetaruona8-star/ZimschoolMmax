# ZimSchool Max

Mobile-first learning platform prototype for Zimbabwean learners. The project includes the React app, project brief, and a GitHub Pages deployment workflow.

## Run locally

1. Install Node.js (LTS).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.
4. To create a production build, run `npm run build`.

## Upload to GitHub

1. Create or open your GitHub repository.
2. Extract this ZIP on your device.
3. Upload the **contents of this folder** to the repository root (not the ZIP file itself). Keep `.github/workflows/deploy.yml` in place.
4. Commit the files to the `main` branch.
5. In the repository, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
6. Open **Actions** and wait for “Deploy ZimSchool Max to GitHub Pages” to finish. Your site URL will appear in the deployment details.

If your repository uses a branch other than `main`, edit `.github/workflows/deploy.yml` and change `branches: [main]` to that branch.

## Project brief

See [PROJECT-BRIEF.md](./PROJECT-BRIEF.md) for the vision, planned features, roadmap, and collaborator discussion points.

## Current status and limitations

This is a front-end prototype, not a complete production service. Some features are demonstrations or local-only. Real AI, secure accounts, payments, classroom services, verified content, and production data protection need further development. The Virtual Lab is a simulation and does not replace supervised real laboratory work. Verify all educational content against current ZIMSEC syllabuses before public release.
