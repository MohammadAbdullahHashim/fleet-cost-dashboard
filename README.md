# EcoCharge Fleet Dashboard

A prototype web dashboard for monitoring a small fleet of electric vehicles, developed for ICS 432.

## Features

- **Fleet Overview:** Displays a static list of 5-10 electric vehicles with ID, Model, Battery Percentage, and Status.
- **Charging Cost Calculator:** Form to select a vehicle and input charging duration (hours) to calculate estimated cost.

## How to Run

1. Clone the repository or download all files into a folder.
2. Ensure you have `index.html`, `styles.css`, and `script.js` in the same directory.
3. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, etc.).
4. For the best experience, use a local server (e.g., with Python: `python -m http.server 8000` then visit `http://localhost:8000`).

## Testing

Unit tests for the `calculateCost` function are provided in `tests.js`. To run them:
- Open a browser console (F12) after loading the page, then call `runTests()`.
- Alternatively, include `tests.js` after `script.js` in an HTML file and uncomment the call.

## Code Quality & Review

During development, we performed code reviews on all merge requests. One key bug caught was the absence of input validation in the cost calculator. This was fixed by adding a validation step in `calculateCost` that returns `null` for invalid inputs and displays a user‑friendly error message.

## Security & Ethics

See the separate memos in the `/docs` folder for our security risk assessment and ethical analysis of the prototype.

## License

This project is for educational purposes only.