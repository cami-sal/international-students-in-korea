# 100 Students: Who Studies in Korea

An interactive scrollytelling data visualization exploring the 307,464 international students enrolled in South Korean higher education in April 2026 — who they are, where they come from, what they study, and where they live.

## Project Structure

```text
.
├── index.html      # Main HTML entry point (GitHub Pages ready)
├── favicon.svg     # Lightweight SVG favicon
├── css/
│   └── styles.css  # Responsive & dark-mode stylesheet
├── js/
│   ├── data.js     # Datasets, narrative steps, and simplified KOSTAT map paths
│   └── app.js      # Interactive charts, choropleth/dot maps, 100-figure stage, scroll sync
├── .gitignore      # Ignores OS and local editor files
├── .nojekyll       # Disables Jekyll processing on GitHub Pages
└── README.md
```

## Running Locally

Because the scripts use standard relative paths without build steps or module bundlers, you can preview the project either way:

- Open `index.html` directly in a browser, or
- Start a quick local server:
  ```bash
  python3 -m http.server 8000
  ```
  and open `http://localhost:8000`.

## Deploying on GitHub Pages

1. Push this folder to a GitHub repository (removing any old backup `.html` files if no longer needed).
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, and click **Save**.
4. GitHub Pages will publish `index.html` automatically at `https://<your-username>.github.io/<repo-name>/`.

## Data Sources

- Ministry of Education & KEDI international student statistics (1999–2026)
- 2026 nationality breakdown & September 2026 policy shift from press reports of the Ministry release (Korea Herald, Seoulz)
- Province boundaries from Statistics Korea (KOSTAT, 2018), simplified for display
