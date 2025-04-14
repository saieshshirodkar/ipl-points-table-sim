const initialPointsData = [
  {
    "rank": 1,
    "team": "Gujarat Titans",
    "played": 6,
    "won": 4,
    "lost": 2,
    "no_result": 0,
    "points": 8,
    "net_run_rate": 1.081
  },
  {
    "rank": 2,
    "team": "Delhi Capitals",
    "played": 5,
    "won": 4,
    "lost": 1,
    "no_result": 0,
    "points": 8,
    "net_run_rate": 0.899
  },
  {
    "rank": 3,
    "team": "Royal Challengers Bengaluru",
    "played": 6,
    "won": 4,
    "lost": 2,
    "no_result": 0,
    "points": 8,
    "net_run_rate": 0.672
  },
  {
    "rank": 4,
    "team": "Lucknow Super Giants",
    "played": 6,
    "won": 4,
    "lost": 2,
    "no_result": 0,
    "points": 8,
    "net_run_rate": 0.162
  },
  {
    "rank": 5,
    "team": "Kolkata Knight Riders",
    "played": 6,
    "won": 3,
    "lost": 3,
    "no_result": 0,
    "points": 6,
    "net_run_rate": 0.803
  },
  {
    "rank": 6,
    "team": "Punjab Kings",
    "played": 5,
    "won": 3,
    "lost": 2,
    "no_result": 0,
    "points": 6,
    "net_run_rate": 0.065
  },
  {
    "rank": 7,
    "team": "Mumbai Indians",
    "played": 6,
    "won": 2,
    "lost": 4,
    "no_result": 0,
    "points": 4,
    "net_run_rate": 0.104
  },
  {
    "rank": 8,
    "team": "Rajasthan Royals",
    "played": 6,
    "won": 2,
    "lost": 4,
    "no_result": 0,
    "points": 4,
    "net_run_rate": -0.838
  },
  {
    "rank": 9,
    "team": "Sunrisers Hyderabad",
    "played": 6,
    "won": 2,
    "lost": 4,
    "no_result": 0,
    "points": 4,
    "net_run_rate": -1.245
  },
  {
    "rank": 10,
    "team": "Chennai Super Kings",
    "played": 6,
    "won": 1,
    "lost": 5,
    "no_result": 0,
    "points": 2,
    "net_run_rate": -1.554
  }
];

// Data from ipl matches.json (embedded for simplicity)
const remainingMatchesData = [
    {
      "match_number": 30,
      "date": "2025-04-14",
      "teams": "Lucknow Super Giants vs Chennai Super Kings"
    },
    {
      "match_number": 31,
      "date": "2025-04-15",
      "teams": "Punjab Kings vs Kolkata Knight Riders"
    },
    {
      "match_number": 32,
      "date": "2025-04-16",
      "teams": "Delhi Capitals vs Rajasthan Royals"
    },
    {
      "match_number": 33,
      "date": "2025-04-17",
      "teams": "Mumbai Indians vs Sunrisers Hyderabad"
    },
    {
      "match_number": 34,
      "date": "2025-04-18",
      "teams": "Royal Challengers Bengaluru vs Punjab Kings"
    },
    {
      "match_number": 35,
      "date": "2025-04-19",
      "teams": "Gujarat Titans vs Delhi Capitals"
    },
    {
      "match_number": 36,
      "date": "2025-04-19",
      "teams": "Rajasthan Royals vs Lucknow Super Giants"
    },
    {
      "match_number": 37,
      "date": "2025-04-20",
      "teams": "Punjab Kings vs Royal Challengers Bengaluru"
    },
    {
      "match_number": 38,
      "date": "2025-04-20",
      "teams": "Mumbai Indians vs Chennai Super Kings"
    },
    {
      "match_number": 39,
      "date": "2025-04-21",
      "teams": "Kolkata Knight Riders vs Gujarat Titans"
    },
    {
      "match_number": 40,
      "date": "2025-04-22",
      "teams": "Lucknow Super Giants vs Delhi Capitals"
    },
    {
      "match_number": 41,
      "date": "2025-04-23",
      "teams": "Sunrisers Hyderabad vs Mumbai Indians"
    },
    {
      "match_number": 42,
      "date": "2025-04-24",
      "teams": "Royal Challengers Bengaluru vs Rajasthan Royals"
    },
    {
      "match_number": 43,
      "date": "2025-04-25",
      "teams": "Chennai Super Kings vs Sunrisers Hyderabad"
    },
    {
      "match_number": 44,
      "date": "2025-04-26",
      "teams": "Kolkata Knight Riders vs Punjab Kings"
    },
    {
      "match_number": 45,
      "date": "2025-04-27",
      "teams": "Mumbai Indians vs Lucknow Super Giants"
    },
    {
      "match_number": 46,
      "date": "2025-04-27",
      "teams": "Delhi Capitals vs Royal Challengers Bengaluru"
    },
    {
      "match_number": 47,
      "date": "2025-04-28",
      "teams": "Rajasthan Royals vs Gujarat Titans"
    },
    {
      "match_number": 48,
      "date": "2025-04-29",
      "teams": "Delhi Capitals vs Kolkata Knight Riders"
    },
    {
      "match_number": 49,
      "date": "2025-04-30",
      "teams": "Chennai Super Kings vs Punjab Kings"
    },
    {
      "match_number": 50,
      "date": "2025-05-01",
      "teams": "Rajasthan Royals vs Mumbai Indians"
    },
    {
      "match_number": 51,
      "date": "2025-05-02",
      "teams": "Gujarat Titans vs Sunrisers Hyderabad"
    },
    {
      "match_number": 52,
      "date": "2025-05-03",
      "teams": "Royal Challengers Bengaluru vs Chennai Super Kings"
    },
    {
      "match_number": 53,
      "date": "2025-05-04",
      "teams": "Kolkata Knight Riders vs Rajasthan Royals"
    },
    {
      "match_number": 54,
      "date": "2025-05-04",
      "teams": "Punjab Kings vs Lucknow Super Giants"
    },
    {
      "match_number": 55,
      "date": "2025-05-05",
      "teams": "Sunrisers Hyderabad vs Delhi Capitals"
    },
    {
      "match_number": 56,
      "date": "2025-05-06",
      "teams": "Mumbai Indians vs Gujarat Titans"
    },
    {
      "match_number": 57,
      "date": "2025-05-07",
      "teams": "Kolkata Knight Riders vs Chennai Super Kings"
    },
    {
      "match_number": 58,
      "date": "2025-05-08",
      "teams": "Punjab Kings vs Delhi Capitals"
    },
    {
      "match_number": 59,
      "date": "2025-05-09",
      "teams": "Lucknow Super Giants vs Royal Challengers Bengaluru"
    },
    {
      "match_number": 60,
      "date": "2025-05-10",
      "teams": "Sunrisers Hyderabad vs Kolkata Knight Riders"
    },
    {
      "match_number": 61,
      "date": "2025-05-11",
      "teams": "Punjab Kings vs Mumbai Indians"
    },
    {
      "match_number": 62,
      "date": "2025-05-11",
      "teams": "Delhi Capitals vs Gujarat Titans"
    },
    {
      "match_number": 63,
      "date": "2025-05-12",
      "teams": "Chennai Super Kings vs Rajasthan Royals"
    },
    {
      "match_number": 64,
      "date": "2025-05-13",
      "teams": "Royal Challengers Bengaluru vs Sunrisers Hyderabad"
    },
    {
      "match_number": 65,
      "date": "2025-05-14",
      "teams": "Gujarat Titans vs Lucknow Super Giants"
    },
    {
      "match_number": 66,
      "date": "2025-05-15",
      "teams": "Mumbai Indians vs Delhi Capitals"
    },
    {
      "match_number": 67,
      "date": "2025-05-16",
      "teams": "Rajasthan Royals vs Punjab Kings"
    },
    {
      "match_number": 68,
      "date": "2025-05-17",
      "teams": "Royal Challengers Bengaluru vs Kolkata Knight Riders"
    },
    {
      "match_number": 69,
      "date": "2025-05-18",
      "teams": "Gujarat Titans vs Chennai Super Kings"
    },
    {
      "match_number": 70,
      "date": "2025-05-18",
      "teams": "Lucknow Super Giants vs Sunrisers Hyderabad"
    }
];

const tableBody = document.getElementById('tableBody');
const matchesContainer = document.getElementById('matchesContainer');

const LOCAL_STORAGE_KEY = 'iplMatchSelections';

let matchSelections = {}; // Store selected winner for each match_number

// Team name mapping
const teamNameMap = {
    "Gujarat Titans": "GT",
    "Delhi Capitals": "DC",
    "Royal Challengers Bengaluru": "RCB",
    "Lucknow Super Giants": "LSG",
    "Kolkata Knight Riders": "KKR",
    "Punjab Kings": "PBKS",
    "Mumbai Indians": "MI",
    "Rajasthan Royals": "RR",
    "Sunrisers Hyderabad": "SRH",
    "Chennai Super Kings": "CSK"
};

// Team color schemes (Background, Text)
const teamColorMap = {
    "Gujarat Titans": { bg: "#1C3C6B", text: "#FFFFFF" }, // Navy Blue, White
    "Delhi Capitals": { bg: "#004C93", text: "#EF1B23" }, // Blue, Red (adjusting text color for contrast)
    "Royal Challengers Bengaluru": { bg: "#EC1C24", text: "#000000" }, // Red, Black
    "Lucknow Super Giants": { bg: "#00A0DD", text: "#FFFFFF" }, // Teal/Cyan, White
    "Kolkata Knight Riders": { bg: "#3A225D", text: "#F2E18A" }, // Purple, Gold
    "Punjab Kings": { bg: "#DD1F2D", text: "#FFFFFF" }, // Red, White
    "Mumbai Indians": { bg: "#006CB7", text: "#FFFFFF" }, // Blue, White
    "Rajasthan Royals": { bg: "#EA1A85", text: "#FFFFFF" }, // Pink, White
    "Sunrisers Hyderabad": { bg: "#F26722", text: "#000000" }, // Orange, Black
    "Chennai Super Kings": { bg: "#FDB913", text: "#000000" }  // Yellow, Black
};

// --- Helper function to estimate initial stats ---
function estimateInitialStats(data) {
    const AVERAGE_TOTAL_RUN_RATE = 16.0; // Runs per over (Team A rate + Team B rate)

    data.forEach(team => {
        if (team.played > 0) {
            const initialOvers = team.played * 20.0;
            team.oversFacedDecimal = initialOvers;
            team.oversBowledDecimal = initialOvers;

            // Estimate run rates based on NRR and average total rate
            // NRR = rateFor - rateAgainst
            // AVERAGE_TOTAL_RUN_RATE = rateFor + rateAgainst
            // => rateFor = (AVERAGE_TOTAL_RUN_RATE + team.net_run_rate) / 2
            // => rateAgainst = (AVERAGE_TOTAL_RUN_RATE - team.net_run_rate) / 2

            const rateFor = (AVERAGE_TOTAL_RUN_RATE + team.net_run_rate) / 2;
            const rateAgainst = (AVERAGE_TOTAL_RUN_RATE - team.net_run_rate) / 2;

            team.runsFor = Math.round(rateFor * initialOvers);
            team.runsAgainst = Math.round(rateAgainst * initialOvers);

            // Adjust NRR slightly based on rounded runs to be consistent
             if (team.oversFacedDecimal > 0 && team.oversBowledDecimal > 0) {
                 team.net_run_rate = (team.runsFor / team.oversFacedDecimal) - (team.runsAgainst / team.oversBowledDecimal);
             }


        } else {
            team.runsFor = 0;
            team.oversFacedDecimal = 0;
            team.runsAgainst = 0;
            team.oversBowledDecimal = 0;
            team.net_run_rate = 0; // Ensure NRR is 0 if no games played
        }
    });
}

// --- Estimate stats right after data definition ---
estimateInitialStats(initialPointsData);
// console.log("Initial Data with Estimated Stats:", JSON.stringify(initialPointsData, null, 2)); // For debugging

// --- Helper function to parse overs string "X.Y" or "X" to decimal ---
function parseOversToDecimal(oversString) {
    if (typeof oversString !== 'string' || oversString.trim() === '') return null;
    oversString = oversString.trim();

    if (!/^\d+(\.\d)?$/.test(oversString)) return null; // Basic format check

    const parts = oversString.split('.');
    const overs = parseInt(parts[0], 10);
    const balls = parts.length > 1 ? parseInt(parts[1], 10) : 0;

    if (isNaN(overs) || isNaN(balls) || balls < 0 || balls > 5 || overs < 0) {
        return null; // Invalid numbers or balls > 5
    }
     if (overs > 20 || (overs === 20 && balls > 0)) {
         return null; // Cannot exceed 20 overs
     }

    return overs + (balls / 6.0);
}

// Function to render the points table
function renderTable(data) {
    // Clear existing table rows
    tableBody.innerHTML = '';

    // Populate table using the data provided (already sorted with correct ranks/NRR)
    data.forEach(team => {
        const row = tableBody.insertRow();
        row.dataset.team = team.team; // Keep data attribute

        const colors = teamColorMap[team.team];
        if (colors) {
            row.style.backgroundColor = hexToRgba(colors.bg, 0.3);
        }

        const shortTeamName = teamNameMap[team.team] || team.team;
        // Use the final calculated NRR from the team object, ensuring NaN is handled
        const displayNRR = isNaN(team.net_run_rate) ? 'N/A' : team.net_run_rate.toFixed(3);

        // Set textContent directly
        row.insertCell().textContent = team.rank; // Use final rank
        row.insertCell().textContent = shortTeamName;
        row.insertCell().textContent = team.played;
        row.insertCell().textContent = team.won;
        row.insertCell().textContent = team.lost;
        row.insertCell().textContent = team.no_result;
        row.insertCell().textContent = team.points;
        row.insertCell().textContent = displayNRR; // Use final NRR
    });
}

// --- Load selections from localStorage --- 
function loadSelections() {
    const storedSelections = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSelections) {
        try {
            matchSelections = JSON.parse(storedSelections);
        } catch (e) {
            console.error("Error parsing stored selections:", e);
            matchSelections = {}; // Reset if data is corrupt
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    } else {
        matchSelections = {};
    }
}

// --- Save selections to localStorage --- 
function saveSelections() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matchSelections));
}

// Function to update the table by re-rendering
function updateTableFromSelections() {
    // Create a deep copy of the initial data
    let updatedPointsData = JSON.parse(JSON.stringify(initialPointsData));

    // Process match selections and update cumulative stats
    for (const matchNumber in matchSelections) {
        const selectedResult = matchSelections[matchNumber];
        const matchInfo = remainingMatchesData.find(m => m.match_number == matchNumber);
        if (!matchInfo) continue;
        const teamsArray = matchInfo.teams.split(' vs ');
        const team1FullName = teamsArray[0].trim();
        const team2FullName = teamsArray[1].trim();
        
        const team1Data = updatedPointsData.find(t => t.team === team1FullName);
        const team2Data = updatedPointsData.find(t => t.team === team2FullName);
        
        if (!team1Data || !team2Data) continue;
        
        // Handle No Result case
        if (selectedResult === 'NO_RESULT') {
            team1Data.played += 1;
            team1Data.no_result += 1;
            team1Data.points += 1;
            
            team2Data.played += 1;
            team2Data.no_result += 1;
            team2Data.points += 1;
            continue;
        }

        // Handle normal win/loss case
        const winningTeamName = selectedResult;
        const losingTeamName = (winningTeamName === team1FullName) ? team2FullName : team1FullName;
        const winnerData = updatedPointsData.find(t => t.team === winningTeamName);
        const loserData = updatedPointsData.find(t => t.team === losingTeamName);
        if (winnerData && loserData) {
            // Update P, W, L, Pts
            winnerData.played += 1;
            winnerData.won += 1;
            winnerData.points += 2;
            loserData.played += 1;
            loserData.lost += 1;

            // Update cumulative Runs/Overs if scores are provided
            const matchCard = matchesContainer.querySelector(`.match-card[data-match-number="${matchNumber}"]`);
            if (matchCard) {
                const t1RunsInput = matchCard.querySelector('input[name="team1Runs"]');
                const t1OversInput = matchCard.querySelector('input[name="team1Overs"]');
                const t2RunsInput = matchCard.querySelector('input[name="team2Runs"]');
                const t2OversInput = matchCard.querySelector('input[name="team2Overs"]');
                const r1 = parseInt(t1RunsInput?.value, 10);
                const o1Str = t1OversInput?.value;
                const r2 = parseInt(t2RunsInput?.value, 10);
                const o2Str = t2OversInput?.value;
                const o1Dec = parseOversToDecimal(o1Str);
                const o2Dec = parseOversToDecimal(o2Str);
                if (!isNaN(r1) && r1 >= 0 && !isNaN(r2) && r2 >= 0 && o1Dec !== null && o2Dec !== null) {
                    const winnerRuns = (winningTeamName === team1FullName) ? r1 : r2;
                    const winnerOvers = (winningTeamName === team1FullName) ? o1Dec : o2Dec;
                    const loserRuns = (winningTeamName === team1FullName) ? r2 : r1;
                    const loserOvers = (winningTeamName === team1FullName) ? o2Dec : o1Dec;
                    winnerData.runsFor += winnerRuns;
                    winnerData.oversFacedDecimal += winnerOvers;
                    winnerData.runsAgainst += loserRuns;
                    winnerData.oversBowledDecimal += loserOvers;
                    loserData.runsFor += loserRuns;
                    loserData.oversFacedDecimal += loserOvers;
                    loserData.runsAgainst += winnerRuns;
                    loserData.oversBowledDecimal += winnerOvers;
                }
            }
        }
    }

    // Calculate final NRR for each team based on cumulative stats
    updatedPointsData.forEach(team => {
        if (team.oversFacedDecimal > 0 && team.oversBowledDecimal > 0) {
            team.net_run_rate = (team.runsFor / team.oversFacedDecimal) - (team.runsAgainst / team.oversBowledDecimal);
        } else {
            team.net_run_rate = 0;
        }
    });

    // Now Sort the data using the final calculated NRR
    const sortedData = updatedPointsData.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        // NRR comparison uses the final calculated team.net_run_rate
        const nrrA = isNaN(a.net_run_rate) ? -Infinity : a.net_run_rate;
        const nrrB = isNaN(b.net_run_rate) ? -Infinity : b.net_run_rate;
        if (nrrB !== nrrA) return nrrB - nrrA;
        return a.team.localeCompare(b.team); // Alphabetical tie-breaker
    });

    // Update ranks based on the final sorted order
    sortedData.forEach((team, index) => {
        team.rank = index + 1;
    });

    // Simply re-render the entire table with the final, sorted data
    renderTable(sortedData);
}

// Function to render the matches section
function renderMatches() {
    matchesContainer.innerHTML = ''; // Clear existing matches
    // Don't reset matchSelections here, keep loaded ones

    remainingMatchesData.forEach(match => {
        const teamsArray = match.teams.split(' vs ');
        const team1FullName = teamsArray[0].trim();
        const team2FullName = teamsArray[1].trim();
        const team1ShortName = teamNameMap[team1FullName] || team1FullName;
        const team2ShortName = teamNameMap[team2FullName] || team2FullName;

        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');
        matchCard.dataset.matchNumber = match.match_number;

        const scoreToggleIcon = document.createElement('span');
        scoreToggleIcon.classList.add('score-toggle-icon');
        scoreToggleIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>`;
        scoreToggleIcon.title = 'Toggle Score Input';
        matchCard.appendChild(scoreToggleIcon);
        const matchInfo = document.createElement('div');
        matchInfo.classList.add('match-info');
        matchInfo.textContent = `Match ${match.match_number} - ${match.date}`;
        const teamsDiv = document.createElement('div');
        teamsDiv.classList.add('teams');
        const team1Button = document.createElement('button');
        team1Button.classList.add('team-button');
        team1Button.textContent = team1ShortName;
        team1Button.dataset.teamName = team1FullName;
        const team2Button = document.createElement('button');
        team2Button.classList.add('team-button');
        team2Button.textContent = team2ShortName;
        team2Button.dataset.teamName = team2FullName;
        
        // Add No Result button
        const noResultButton = document.createElement('button');
        noResultButton.classList.add('team-button', 'no-result-button');
        noResultButton.textContent = 'No Result';
        noResultButton.dataset.noResult = 'true';

        // --- Reflect loaded selection state --- 
        const selectedWinner = matchSelections[match.match_number];
        if (selectedWinner) {
            if (selectedWinner === team1FullName) {
                team1Button.classList.add('selected');
                applyTeamColorsToButton(team1Button, teamColorMap[team1FullName]);
            } else if (selectedWinner === team2FullName) {
                team2Button.classList.add('selected');
                applyTeamColorsToButton(team2Button, teamColorMap[team2FullName]);
            } else if (selectedWinner === 'NO_RESULT') {
                noResultButton.classList.add('selected');
                applyNoResultButtonStyle(noResultButton);
            }
        }
        // --- End reflect loaded state ---

        // Event listener for team selection
        [team1Button, team2Button, noResultButton].forEach(button => {
            button.addEventListener('click', () => {
                const currentMatchNumber = match.match_number;
                const isNoResult = button.dataset.noResult === 'true';
                const selectedTeamFullName = isNoResult ? 'NO_RESULT' : button.dataset.teamName;
                const otherButtons = [team1Button, team2Button, noResultButton].filter(b => b !== button);
                
                // Update selection state and button appearance
                if (button.classList.contains('selected')) {
                    button.classList.remove('selected');
                    if (isNoResult) {
                        resetButtonColors(button);
                    } else {
                        resetButtonColors(button);
                    }
                    delete matchSelections[currentMatchNumber];
                } else {
                    button.classList.add('selected');
                    otherButtons.forEach(b => {
                        b.classList.remove('selected');
                        resetButtonColors(b);
                    });
                    
                    if (isNoResult) {
                        applyNoResultButtonStyle(button);
                    } else {
                        const colors = teamColorMap[selectedTeamFullName];
                        applyTeamColorsToButton(button, colors);
                    }
                    matchSelections[currentMatchNumber] = selectedTeamFullName;
                }

                saveSelections(); // <-- Save selections on change
                updateTableFromSelections(); // Update table immediately
            });
        });

        const scoreInputsDiv = document.createElement('div');
        scoreInputsDiv.classList.add('score-inputs');
        const t1Label = document.createElement('label');
        t1Label.textContent = `${team1ShortName} Score:`;
        scoreInputsDiv.appendChild(t1Label);
        const t1RunsInput = document.createElement('input');
        t1RunsInput.type = 'number'; t1RunsInput.name = 'team1Runs'; t1RunsInput.placeholder = 'Runs'; t1RunsInput.min = '0';
        scoreInputsDiv.appendChild(t1RunsInput);
        const t1OversInput = document.createElement('input');
        t1OversInput.type = 'text'; t1OversInput.name = 'team1Overs'; t1OversInput.placeholder = 'Overs (e.g., 19.5)'; t1OversInput.pattern = "^\\d{1,2}(\\.[0-5])?$";
        scoreInputsDiv.appendChild(t1OversInput);
        const t2Label = document.createElement('label');
        t2Label.textContent = `${team2ShortName} Score:`;
        scoreInputsDiv.appendChild(t2Label);
        const t2RunsInput = document.createElement('input');
        t2RunsInput.type = 'number'; t2RunsInput.name = 'team2Runs'; t2RunsInput.placeholder = 'Runs'; t2RunsInput.min = '0';
        scoreInputsDiv.appendChild(t2RunsInput);
        const t2OversInput = document.createElement('input');
        t2OversInput.type = 'text'; t2OversInput.name = 'team2Overs'; t2OversInput.placeholder = 'Overs (e.g., 18.2)'; t2OversInput.pattern = "^\\d{1,2}(\\.[0-5])?$";
        scoreInputsDiv.appendChild(t2OversInput);
        
        teamsDiv.appendChild(team1Button);
        teamsDiv.appendChild(document.createTextNode(' vs '));
        teamsDiv.appendChild(team2Button);
        teamsDiv.appendChild(document.createElement('br')); // Add line break
        teamsDiv.appendChild(noResultButton); // Add No Result button
        
        matchCard.appendChild(matchInfo);
        matchCard.appendChild(teamsDiv);
        matchCard.appendChild(scoreInputsDiv); 
        matchesContainer.appendChild(matchCard);

        scoreToggleIcon.addEventListener('click', () => {
            const currentScoreDiv = matchCard.querySelector('.score-inputs');
            const isOpening = !currentScoreDiv.classList.contains('visible');
            if (isOpening) {
                const allVisibleScoreDivs = matchesContainer.querySelectorAll('.score-inputs.visible');
                allVisibleScoreDivs.forEach(div => { div.classList.remove('visible'); });
                const allRotatedIcons = matchesContainer.querySelectorAll('.score-toggle-icon.icon-rotated');
                allRotatedIcons.forEach(icon => { icon.classList.remove('icon-rotated'); });
            }
            currentScoreDiv.classList.toggle('visible');
            if (currentScoreDiv.classList.contains('visible')) {
                scoreToggleIcon.classList.add('icon-rotated');
            } else {
                scoreToggleIcon.classList.remove('icon-rotated');
            }
        });
    });
}

// Helper functions for applying/resetting button colors
function applyTeamColorsToButton(button, colors) {
    if (colors) {
        button.style.backgroundColor = colors.bg;
        button.style.color = colors.text;
        button.style.borderColor = colors.bg;
    } else {
        button.style.backgroundColor = '#007bff'; // Fallback
        button.style.color = '#ffffff';
        button.style.borderColor = '#0056b3';
    }
}

function resetButtonColors(button) {
    button.style.backgroundColor = '';
    button.style.color = '';
    button.style.borderColor = '';
}

// Helper function to style No Result button
function applyNoResultButtonStyle(button) {
    button.style.backgroundColor = '#5A5A5A'; // Gray background
    button.style.color = '#FFFFFF'; // White text
    button.style.borderColor = '#5A5A5A'; // Gray border
}

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    loadSelections();
    estimateInitialStats(initialPointsData);
    renderMatches(); // Render matches first
    updateTableFromSelections(); // Then update table based on loaded/initial state

    // Add H1 refresh listener
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
        mainHeading.style.cursor = 'pointer';
        mainHeading.addEventListener('click', () => location.reload());
    }

    // --- Add Reset Button Listener --- 
    const resetButton = document.getElementById('resetSimulationBtn');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Clear selections object and localStorage
            matchSelections = {};
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            // Clear score input fields
            const scoreInputs = matchesContainer.querySelectorAll('.score-inputs input');
            scoreInputs.forEach(input => input.value = '');

            // Close any open score sections
            const allVisibleScoreDivs = matchesContainer.querySelectorAll('.score-inputs.visible');
            allVisibleScoreDivs.forEach(div => { div.classList.remove('visible'); });
            const allRotatedIcons = matchesContainer.querySelectorAll('.score-toggle-icon.icon-rotated');
            allRotatedIcons.forEach(icon => { icon.classList.remove('icon-rotated'); });

            // Reset button styles (remove selected class and inline styles)
            const teamButtons = matchesContainer.querySelectorAll('.team-button.selected');
            teamButtons.forEach(button => {
                button.classList.remove('selected');
                resetButtonColors(button); // Use helper to reset styles
            });

            // Update table to reflect reset state
            updateTableFromSelections(); 
        });
    }
    // --- End Reset Button Listener --- 

});

// Need helper hexToRgba if not already present
function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(0,0,0,${alpha})`; // Fallback
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
} 