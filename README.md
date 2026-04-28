# Selection Box Planner (Prototype)

A lightweight web app prototype for planning game selections in 1D boxes (cm-based), with:

- Box size and image management
- Game size/category/image management
- Admin image input supports both URL and local file upload (stored as Data URL)
- Category filter and search
- Players filter and difficulty filter
- Fill/remaining indicators based on selected box length
- Recommendation engine (fit + category/compatibility score)
- In-box cover image stacking with plug-in animation on add
- Admin login modal (prototype password: `boxadmin`)
- Multilingual UI: Korean, English, Japanese
- Comfortable light/dark theme toggle

## Run

This is a static app. Open `index.html` in any browser.

## Notes

- Data is persisted in browser `localStorage`.
- This is a front-end prototype for requirement validation; production should move admin/auth/data to a backend (e.g., Supabase).
