# IPL Points Table Simulator

This is a simple web application that displays the IPL (Indian Premier League) points table and allows you to simulate the results of remaining matches to see how the standings change.

## Features

*   **Current Points Table:** Displays an initial points table based on pre-defined data.
*   **Match Simulation:** Shows cards for remaining matches.
*   **Winner Selection:** Click on a team in a match card to select them as the winner.
*   **Score Input (Optional):** Click the dropdown icon (▼) on a match card to enter hypothetical scores and overs faced for each team.
*   **Dynamic Updates:** The points table instantly updates based on selected winners and entered scores.
*   **NRR Calculation:** Net Run Rate is calculated and updated if valid scores and overs are provided for a simulated match.
*   **Responsive Design:** Adapts to different screen sizes, including mobile.
*   **Dark Theme:** Features a clean dark mode interface.
*   **Persistence:** Your match winner selections are saved in your browser's `localStorage` and will be remembered if you refresh the page.
*   **Reset:** A reset button allows you to clear all simulations and return to the initial table state.

## How to Run

1.  **Download Files:** Make sure you have `ipl.html`, `style.css`, and `script.js` in the same directory.
2.  **Run a Local Server:** Since the JavaScript fetches data and uses features that may not work correctly when opening the HTML file directly (`file:///...`), you need to serve the files using a local web server.
    *   **Using Python:**
        *   Open a terminal or command prompt in the project directory.
        *   Run the command: `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
        *   This usually starts a server on port 8000.
    *   **Using VS Code Live Server:**
        *   Install the "Live Server" extension in VS Code.
        *   Right-click on `ipl.html` and select "Open with Live Server".
3.  **Access in Browser:** Open your web browser and navigate to the address provided by your server (e.g., `http://localhost:8000` or `http://127.0.0.1:5500`). Click on `ipl.html` if you see a directory listing.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES6+)

## Credits

*   Made by Saiesh Nitin Shirodkar ([@SaieshShirodkar](https://x.com/SaieshShirodkar))
*   Contact: [shirodkarsrk@gmail.com](mailto:shirodkarsrk@gmail.com) 