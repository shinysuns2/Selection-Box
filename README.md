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
- Admin login modal (Supabase auth-backed)
- Multilingual UI: Korean, English, Japanese
- Comfortable light/dark theme toggle

## Run

This is a static app. Open `index.html` in any browser.

## Notes

- Data is persisted in browser `localStorage`.
- Shared catalog data (`boxes`, `games`, `categories`) is read/written via Supabase.
- Local browser storage now keeps only personal UI state and selected-in-box items.
