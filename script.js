// Initial Data (Points Table Snapshot)
const initialPointsData = [
  {
    rank: 1,
    team: "Delhi Capitals",
    played: 6,
    won: 5,
    lost: 1,
    no_result: 0,
    points: 10,
    net_run_rate: 0.772
  },
  {
    rank: 2,
    team: "Gujarat Titans",
    played: 6,
    won: 4,
    lost: 2,
    no_result: 0,
    points: 8,
    net_run_rate: 1.081
  },
  {
    rank: 3,
    team: "Royal Challengers Bengaluru",
    played: 6,
    won: 4,
    lost: 2,
    no_result: 0,
    points: 8,
    net_run_rate: 0.672
  },
  {
    rank: 4,
    team: "Punjab Kings",
    played: 6,
    won: 4,
    lost: 2,
    no_result: 0,
    points: 8,
    net_run_rate: 0.172
  },
  {
    rank: 5,
    team: "Lucknow Super Giants",
    played: 7,
    won: 4,
    lost: 3,
    no_result: 0,
    points: 8,
    net_run_rate: 0.086
  },
  {
    rank: 6,
    team: "Kolkata Knight Riders",
    played: 7,
    won: 3,
    lost: 4,
    no_result: 0,
    points: 6,
    net_run_rate: 0.547
  },
  {
    rank: 7,
    team: "Mumbai Indians",
    played: 6,
    won: 2,
    lost: 4,
    no_result: 0,
    points: 4,
    net_run_rate: 0.104
  },
  {
    rank: 8,
    team: "Rajasthan Royals",
    played: 7,
    won: 2,
    lost: 5,
    no_result: 0,
    points: 4,
    net_run_rate: -0.738
  },
  {
    rank: 9,
    team: "Sunrisers Hyderabad",
    played: 6,
    won: 2,
    lost: 4,
    no_result: 0,
    points: 4,
    net_run_rate: -1.245
  },
  {
    rank: 10,
    team: "Chennai Super Kings",
    played: 7,
    won: 2,
    lost: 5,
    no_result: 0,
    points: 4,
    net_run_rate: -1.276
  }
];

// Static fallback data for remaining matches
const staticRemainingMatchesData = [
  // Removed: LSG vs CSK, PBKS vs KKR, DC vs RR
  { match_number: 33, date: "2025-04-17", teams: "Mumbai Indians vs Sunrisers Hyderabad" },
  { match_number: 34, date: "2025-04-18", teams: "Royal Challengers Bengaluru vs Punjab Kings" },
  { match_number: 35, date: "2025-04-19", teams: "Gujarat Titans vs Delhi Capitals" },
  { match_number: 36, date: "2025-04-19", teams: "Rajasthan Royals vs Lucknow Super Giants" },
  { match_number: 37, date: "2025-04-20", teams: "Punjab Kings vs Royal Challengers Bengaluru" },
  { match_number: 38, date: "2025-04-20", teams: "Mumbai Indians vs Chennai Super Kings" },
  { match_number: 39, date: "2025-04-21", teams: "Kolkata Knight Riders vs Gujarat Titans" }
];

// DOM Elements
const tableBody = document.getElementById('tableBody');
const matchesContainer = document.getElementById('matchesContainer');
const resetButton = document.getElementById('resetSimulationBtn');
const mainHeading = document.querySelector('h1');

// Constants and Mappings
const LOCAL_STORAGE_KEY = 'iplMatchSelections_v2'; // Added versioning in case structure changes

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

const teamColorMap = {
  "Gujarat Titans": { bg: "#1C3C6B", text: "#FFFFFF" }, // Navy Blue, White
  "Delhi Capitals": { bg: "#004C93", text: "#EF1B23" }, // Blue, Red (adjust text color for contrast if needed)
  "Royal Challengers Bengaluru": { bg: "#EC1C24", text: "#000000" }, // Red, Black
  "Lucknow Super Giants": { bg: "#00A0DD", text: "#FFFFFF" }, // Teal/Cyan, White
  "Kolkata Knight Riders": { bg: "#3A225D", text: "#F2E18A" }, // Purple, Gold
  "Punjab Kings": { bg: "#DD1F2D", text: "#FFFFFF" }, // Red, White
  "Mumbai Indians": { bg: "#006CB7", text: "#FFFFFF" }, // Blue, White
  "Rajasthan Royals": { bg: "#EA1A85", text: "#FFFFFF" }, // Pink, White
  "Sunrisers Hyderabad": { bg: "#F26722", text: "#000000" }, // Orange, Black
  "Chennai Super Kings": { bg: "#FDB913", text: "#000000" }  // Yellow, Black
};

// Global State
let matchSelections = {}; // Stores { match_number: { winner: "Team Name" | "NO_RESULT", scores: { team1: {r, oStr, oDec}, team2: {r, oStr, oDec} } } }
let selectedFilterTeam = null; // Stores the full name of the team to filter by, or null
let remainingMatchesData = []; // Will be loaded from JSON

// --- Helper Functions ---

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== 'string' || hex.length < 4) return `rgba(200, 200, 200, ${alpha})`; // Fallback grey
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(200, 200, 200, ${alpha})`; // Fallback grey
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Parses standard cricket overs format (Overs.Balls) into decimal
function parseOversToDecimal(oversString) {
  if (typeof oversString !== 'string' || oversString.trim() === '') return { decimal: null, valid: false };
  oversString = oversString.trim();

  const match = oversString.match(/^(\d{1,2})(?:\.([0-5]))?$/);

  if (!match) {
      return { decimal: null, valid: false }; // Invalid format
  }

  const overs = parseInt(match[1], 10);
  const balls = match[2] ? parseInt(match[2], 10) : 0; // Balls are 0 if not specified

  // Validate balls are between 0 and 5 (regex already does this, but explicit check is safer)
  // Validate total overs are within 0.0 to 20.0
  if (balls < 0 || balls > 5 || overs < 0 || overs > 20 || (overs === 20 && balls > 0)) {
      return { decimal: null, valid: false }; // Invalid value
  }

  // Convert to decimal: Overs + (Balls / 6)
  const decimalValue = parseFloat((overs + (balls / 6.0)).toFixed(5)); // Use good precision
  return { decimal: decimalValue, valid: true };
}

function applyTeamColorsToButton(button, colors) {
  if (colors) {
      button.style.backgroundColor = colors.bg;
      button.style.color = colors.text;
      button.style.borderColor = colors.bg; // Make border match bg for solid look
  } else {
      // Reset to default/CSS defined styles or a fallback
      resetButtonColors(button);
  }
}

function resetButtonColors(button) {
  button.style.backgroundColor = '';
  button.style.color = '';
  button.style.borderColor = '';
}

function closeAllDropdowns(excludeDropdown = null) {
  const openDropdowns = document.querySelectorAll('.match-options-dropdown.visible');
  openDropdowns.forEach(dropdown => {
      if (dropdown !== excludeDropdown) {
          dropdown.classList.remove('visible');
      }
  });
}

// --- NRR and Data Handling ---

// Estimate initial runs/overs based on provided NRR and Played count
function estimateInitialStats(data) {
  const AVERAGE_TOTAL_RUN_RATE = 16.0; // Combined runs per over (approx)

  data.forEach(team => {
      if (team.played > 0) {
          const initialOvers = team.played * 20.0; // Base assumption
          team.initialOversFacedDecimal = initialOvers;
          team.initialOversBowledDecimal = initialOvers;

          // Estimate rates using NRR and average
          const rateFor = (AVERAGE_TOTAL_RUN_RATE + team.net_run_rate) / 2;
          const rateAgainst = (AVERAGE_TOTAL_RUN_RATE - team.net_run_rate) / 2;

          team.initialRunsFor = Math.round(rateFor * initialOvers);
          team.initialRunsAgainst = Math.round(rateAgainst * initialOvers);

          // Store the original NRR separately if needed for reference,
          // but the simulation will use stats derived from these initial estimations.
          team.original_nrr = team.net_run_rate;

      } else {
          team.initialRunsFor = 0;
          team.initialOversFacedDecimal = 0;
          team.initialRunsAgainst = 0;
          team.initialOversBowledDecimal = 0;
          team.original_nrr = 0;
      }
      // Reset dynamic properties for calculation
      team.net_run_rate = team.original_nrr; // Start calculation NRR from original
  });
}

// Simulate qualification probabilities via Monte Carlo
function simulateQualification(trials = 10000) {
    const counts = {};
    initialPointsData.forEach(team => counts[team.team] = 0);
    for (let i = 0; i < trials; i++) {
        // Deep copy initial state
        const simData = JSON.parse(JSON.stringify(initialPointsData));
        // Simulate each remaining match randomly
        remainingMatchesData.forEach(match => {
            const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
            const t1 = simData.find(t => t.team === t1Name);
            const t2 = simData.find(t => t.team === t2Name);
            if (!t1 || !t2) return;
            t1.played++; t2.played++;
            if (Math.random() < 0.5) { t1.won++; t1.points += 2; t2.lost++; }
            else { t2.won++; t2.points += 2; t1.lost++; }
        });
        // Sort by points, NRR, wins, then name
        simData.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.net_run_rate !== a.net_run_rate) return b.net_run_rate - a.net_run_rate;
            if (b.won !== a.won) return b.won - a.won;
            return a.team.localeCompare(b.team);
        });
        // Count top 4
        simData.slice(0, 4).forEach(t => counts[t.team]++);
    }
    // Assign probabilities back to initialPointsData
    initialPointsData.forEach(team => {
        team.qualProbability = counts[team.team] / trials;
    });
}

// --- Local Storage ---

function loadSelections() {
  const storedSelections = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedSelections) {
      try {
          matchSelections = JSON.parse(storedSelections);
          // Basic validation could be added here if format changes
      } catch (e) {
          console.error("Error parsing stored selections:", e);
          matchSelections = {};
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
      }
  } else {
      matchSelections = {};
  }
}

function saveSelections() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matchSelections));
}

// --- Data Loading ---
async function loadRemainingMatches() {
    try {
        const response = await fetch(encodeURI('ipl matches.json'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        remainingMatchesData = await response.json();
        // Remove completed matches (LSG vs CSK, PBKS vs KKR, DC vs RR)
        const removed = [
            "Lucknow Super Giants vs Chennai Super Kings",
            "Punjab Kings vs Kolkata Knight Riders",
            "Delhi Capitals vs Rajasthan Royals"
        ];
        remainingMatchesData = remainingMatchesData.filter(m => !removed.includes(m.teams));
        console.log("Remaining matches loaded successfully.");
    } catch (error) {
        console.warn("Could not load remaining matches via fetch, using embedded data:", error);
        remainingMatchesData = staticRemainingMatchesData;
    }
}


// --- Rendering Functions ---

function renderTable(data) {
  tableBody.innerHTML = ''; // Clear existing rows

  data.forEach(team => {
      const row = tableBody.insertRow();
      row.dataset.team = team.team; // Store full team name for filtering

      const colors = teamColorMap[team.team];
      if (colors) {
          // Apply a lighter, transparent background for readability
          row.style.backgroundColor = hexToRgba(colors.bg, 0.15);
      }

      // Highlight the row if it's the currently selected filter team
      if (team.team === selectedFilterTeam) {
          row.classList.add('selected-row');
      }

      const shortTeamName = teamNameMap[team.team] || team.team;
      // Use the final calculated NRR, formatting to 3 decimals
      const displayNRR = typeof team.net_run_rate === 'number' ? team.net_run_rate.toFixed(3) : 'N/A';
      row.insertCell().textContent = team.rank;
      row.insertCell().textContent = shortTeamName;
      row.insertCell().textContent = team.played;
      row.insertCell().textContent = team.won;
      row.insertCell().textContent = team.lost;
      row.insertCell().textContent = team.no_result;
      row.insertCell().textContent = team.points;
      row.insertCell().textContent = displayNRR;
      // Placeholder for qualification probability
      row.insertCell().textContent = team.qualProbability ? `${(team.qualProbability*100).toFixed(1)}%` : '—';
  });
}


function renderMatches() {
  matchesContainer.innerHTML = ''; // Clear existing matches

  remainingMatchesData.forEach(match => {
      const teamsArray = match.teams.split(' vs ');
      const team1FullName = teamsArray[0].trim();
      const team2FullName = teamsArray[1].trim();
      const team1ShortName = teamNameMap[team1FullName] || team1FullName;
      const team2ShortName = teamNameMap[team2FullName] || team2FullName;

      const matchCard = document.createElement('div');
      matchCard.classList.add('match-card');
      matchCard.dataset.matchNumber = match.match_number;

      // --- Icons ---
      const scoreToggleIcon = document.createElement('span');
      scoreToggleIcon.classList.add('score-toggle-icon');
      scoreToggleIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>`;
      scoreToggleIcon.title = 'Toggle Score Input';
      matchCard.appendChild(scoreToggleIcon);

      const dropdownIcon = document.createElement('span');
      dropdownIcon.classList.add('match-options-icon');
      dropdownIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>`;
      dropdownIcon.title = 'Match Options';
      matchCard.appendChild(dropdownIcon);

      // --- Dropdown Menu ---
      const dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add('match-options-dropdown');
      const noResultButton = document.createElement('button');
      noResultButton.classList.add('dropdown-item', 'no-result-button');
      noResultButton.textContent = 'No Result';
      noResultButton.dataset.resultType = 'NO_RESULT'; // For easy identification
      dropdownMenu.appendChild(noResultButton);

      // --- Match Info and Team Buttons ---
      const matchInfo = document.createElement('div');
      matchInfo.classList.add('match-info');
      matchInfo.textContent = `Match ${match.match_number} - ${match.date}`;

      const teamsDiv = document.createElement('div');
      teamsDiv.classList.add('teams');

      const team1Button = document.createElement('button');
      team1Button.classList.add('team-button');
      team1Button.textContent = team1ShortName;
      team1Button.dataset.teamName = team1FullName;
      team1Button.dataset.resultType = 'WIN'; // For easy identification

      const vsTextContainer = document.createElement('span');
      vsTextContainer.classList.add('vs-text');
      vsTextContainer.textContent = 'vs';

      const team2Button = document.createElement('button');
      team2Button.classList.add('team-button');
      team2Button.textContent = team2ShortName;
      team2Button.dataset.teamName = team2FullName;
      team2Button.dataset.resultType = 'WIN'; // For easy identification

      teamsDiv.appendChild(team1Button);
      teamsDiv.appendChild(vsTextContainer);
      teamsDiv.appendChild(team2Button);

      // --- Score Inputs ---
      const scoreInputsDiv = document.createElement('div');
      scoreInputsDiv.classList.add('score-inputs');

      // Team 1 Score/Overs
      const t1ScoreGroup = document.createElement('div');
      t1ScoreGroup.classList.add('score-input-group');
      const t1Label = document.createElement('label');
      t1Label.textContent = `${team1ShortName}:`;
      const t1RunsInput = document.createElement('input');
      t1RunsInput.type = 'number'; t1RunsInput.name = 'team1Runs'; t1RunsInput.placeholder = 'Runs'; t1RunsInput.min = '0';
      const t1OversInput = document.createElement('input');
      t1OversInput.type = 'text'; t1OversInput.name = 'team1Overs';
      t1OversInput.placeholder = 'Overs'; t1OversInput.title = 'Format: OO or OO.B (e.g., 20 or 19.5)'; t1OversInput.pattern = "^\\d{1,2}(\\.[0-5])?$";
      t1ScoreGroup.append(t1Label, t1RunsInput, t1OversInput);

      // Team 2 Score/Overs
      const t2ScoreGroup = document.createElement('div');
      t2ScoreGroup.classList.add('score-input-group');
      const t2Label = document.createElement('label');
      t2Label.textContent = `${team2ShortName}:`;
      const t2RunsInput = document.createElement('input');
      t2RunsInput.type = 'number'; t2RunsInput.name = 'team2Runs'; t2RunsInput.placeholder = 'Runs'; t2RunsInput.min = '0';
      const t2OversInput = document.createElement('input');
      t2OversInput.type = 'text'; t2OversInput.name = 'team2Overs';
      t2OversInput.placeholder = 'Overs'; t2OversInput.title = 'Format: OO or OO.B (e.g., 18.2)'; t2OversInput.pattern = "^\\d{1,2}(\\.[0-5])?$";
      t2ScoreGroup.append(t2Label, t2RunsInput, t2OversInput);

      scoreInputsDiv.appendChild(t1ScoreGroup);
      scoreInputsDiv.appendChild(t2ScoreGroup);

      // --- Assemble Match Card ---
      matchCard.appendChild(matchInfo);
      matchCard.appendChild(teamsDiv);
      matchCard.appendChild(dropdownMenu);
      matchCard.appendChild(scoreInputsDiv);
      matchesContainer.appendChild(matchCard);

      // --- Restore State from matchSelections ---
      const savedSelection = matchSelections[match.match_number];
      if (savedSelection) {
          if (savedSelection.winner === 'NO_RESULT') {
              matchCard.classList.add('no-result-selected');
              scoreInputsDiv.classList.add('disabled');
              scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = true);
          } else if (savedSelection.winner) {
              const winningButton = savedSelection.winner === team1FullName ? team1Button : team2Button;
              winningButton.classList.add('selected');
              applyTeamColorsToButton(winningButton, teamColorMap[savedSelection.winner]);
          }
          // Restore saved scores
          if (savedSelection.scores) {
              t1RunsInput.value = savedSelection.scores.team1?.r ?? '';
              t1OversInput.value = savedSelection.scores.team1?.oStr ?? ''; // Store original string
              t2RunsInput.value = savedSelection.scores.team2?.r ?? '';
              t2OversInput.value = savedSelection.scores.team2?.oStr ?? ''; // Store original string
          }
      }

      // --- Event Listeners for this card ---

      // Score Input Change Listener (Update matchSelections immediately)
      [t1RunsInput, t1OversInput, t2RunsInput, t2OversInput].forEach(input => {
          input.addEventListener('input', () => {
               const currentMatchNumber = match.match_number;
               if (!matchSelections[currentMatchNumber]) {
                  matchSelections[currentMatchNumber] = { winner: null, scores: {} }; // Initialize if needed
               }
               if (!matchSelections[currentMatchNumber].scores) {
                  matchSelections[currentMatchNumber].scores = { team1: {}, team2: {} };
               }

               // Update runs and original overs string
               matchSelections[currentMatchNumber].scores.team1.r = t1RunsInput.value.trim() === '' ? null : parseInt(t1RunsInput.value, 10);
               matchSelections[currentMatchNumber].scores.team1.oStr = t1OversInput.value;
               matchSelections[currentMatchNumber].scores.team2.r = t2RunsInput.value.trim() === '' ? null : parseInt(t2RunsInput.value, 10);
               matchSelections[currentMatchNumber].scores.team2.oStr = t2OversInput.value;

               // Validate and store decimal overs immediately for NRR calculation
               const { decimal: o1Dec, valid: o1Valid } = parseOversToDecimal(t1OversInput.value);
               const { decimal: o2Dec, valid: o2Valid } = parseOversToDecimal(t2OversInput.value);
               matchSelections[currentMatchNumber].scores.team1.oDec = o1Valid ? o1Dec : null;
               matchSelections[currentMatchNumber].scores.team2.oDec = o2Valid ? o2Dec : null;

               saveSelections(); // Save score changes
               updateTableFromSelections(); // Update table on score change
          });
      });


      // Result Selection (Team Wins or No Result)
      [team1Button, team2Button, noResultButton].forEach(button => {
          button.addEventListener('click', (event) => {
              event.stopPropagation(); // Prevent closing dropdown immediately if it was open
              const currentMatchNumber = match.match_number;
              const resultType = button.dataset.resultType;
              const selectedTeamName = resultType === 'WIN' ? button.dataset.teamName : 'NO_RESULT';

              // Get related elements
              const currentScoreInputsDiv = scoreInputsDiv; // Already have reference
              const allInputs = currentScoreInputsDiv.querySelectorAll('input');

              // Logic: If clicking the currently selected option, deselect. Otherwise, select the new one.
              const isCurrentlySelected = matchSelections[currentMatchNumber]?.winner === selectedTeamName;

              // --- Reset UI state for this card ---
              matchCard.classList.remove('no-result-selected');
              [team1Button, team2Button].forEach(btn => {
                  btn.classList.remove('selected');
                  resetButtonColors(btn);
              });
              currentScoreInputsDiv.classList.remove('disabled');
              allInputs.forEach(input => input.disabled = false);
              // --- End Reset UI ---

              if (isCurrentlySelected) {
                  // Deselecting the current option
                  if (matchSelections[currentMatchNumber]) {
                      // Deselecting
                      if (matchSelections[currentMatchNumber]) {
                          matchSelections[currentMatchNumber].winner = null;
                          // Keep scores if entered, don't delete the entry just for deselecting winner
                      }
                  }
              } else {
                  // Selecting a new option
                  // Selecting a new option
                  if (!matchSelections[currentMatchNumber]) {
                      // Initialize with empty scores object if creating new entry
                      matchSelections[currentMatchNumber] = { winner: null, scores: { team1: {}, team2: {} } };
                  }
                  matchSelections[currentMatchNumber].winner = selectedTeamName;

                  if (selectedTeamName === 'NO_RESULT') {
                      matchCard.classList.add('no-result-selected');
                      currentScoreInputsDiv.classList.add('disabled');
                      allInputs.forEach(input => {
                          input.disabled = true;
                          // Clear inputs when selecting No Result (as per plan)
                          // input.value = ''; // Clear visually
                      });
                       // Also clear stored scores for No Result
                       if (matchSelections[currentMatchNumber].scores) {
                           matchSelections[currentMatchNumber].scores = { team1: {}, team2: {} };
                       }
                       // Clear visual inputs (moved clearing logic here)
                       matchCard.querySelectorAll('.score-inputs input').forEach(input => input.value = '');

                  } else {
                      // It's a team win
                      const winnerButton = button; // The button clicked is the winner
                      winnerButton.classList.add('selected');
                      applyTeamColorsToButton(winnerButton, teamColorMap[selectedTeamName]);
                      // Ensure inputs are enabled (already done in reset, but safe)
                      currentScoreInputsDiv.classList.remove('disabled');
                      allInputs.forEach(input => input.disabled = false);
                  }
              }

              closeAllDropdowns(); // Close dropdown after selection
              saveSelections();
              updateTableFromSelections();
          });
      });

      // Dropdown Toggle
      dropdownIcon.addEventListener('click', (event) => {
          event.stopPropagation();
          closeAllDropdowns(dropdownMenu); // Close others
          dropdownMenu.classList.toggle('visible');
      });

      // Score Section Toggle
      scoreToggleIcon.addEventListener('click', () => {
          const currentScoreDiv = scoreInputsDiv; // Already have reference
          const isOpening = !currentScoreDiv.classList.contains('visible');

          // Optional: Close other open score sections for cleaner UI
          if (isOpening) {
              matchesContainer.querySelectorAll('.score-inputs.visible').forEach(div => {
                  if (div !== currentScoreDiv) div.classList.remove('visible');
              });
              matchesContainer.querySelectorAll('.score-toggle-icon.icon-rotated').forEach(icon => {
                  if (icon !== scoreToggleIcon) icon.classList.remove('icon-rotated');
              });
          }
          // Toggle current section
          currentScoreDiv.classList.toggle('visible');
          scoreToggleIcon.classList.toggle('icon-rotated');
      });

  }); // End forEach match
}

// --- Filtering Logic ---

function applyMatchFilter() {
    const allMatchCards = matchesContainer.querySelectorAll('.match-card');
    const tableRows = tableBody.querySelectorAll('tr');

    // Update table row highlighting
    tableRows.forEach(row => {
        if (row.dataset.team === selectedFilterTeam) {
            row.classList.add('selected-row');
        } else {
            row.classList.remove('selected-row');
        }
    });

    // Filter match cards
    allMatchCards.forEach(card => {
        if (!selectedFilterTeam) {
            // No filter active, show all cards
            card.classList.remove('hidden');
        } else {
            // Filter active, check if the card involves the selected team
            const teamButtons = card.querySelectorAll('.team-button[data-team-name]');
            const team1Button = teamButtons[0];
            const team2Button = teamButtons[1];
            const team1Name = team1Button ? team1Button.dataset.teamName : null;
            const team2Name = team2Button ? team2Button.dataset.teamName : null;

            if (team1Name === selectedFilterTeam || team2Name === selectedFilterTeam) {
                card.classList.remove('hidden'); // Show if match involves the team
            } else {
                card.classList.add('hidden'); // Hide otherwise
            }
        }
    });

    // Optional: Add/remove a class on the body or container to indicate filtering state
    if (selectedFilterTeam) {
        document.body.classList.add('filter-active');
    } else {
        document.body.classList.remove('filter-active');
    }
}

// --- Event Listeners ---

// Event listener for table row clicks (using event delegation)
tableBody.addEventListener('click', (event) => {
    const clickedRow = event.target.closest('tr');
    if (!clickedRow) return; // Clicked outside a row

    const teamName = clickedRow.dataset.team;
    if (!teamName) return; // Row doesn't have team data

    // Toggle filter: If clicking the same team, clear filter. Otherwise, set filter.
    if (selectedFilterTeam === teamName) {
        selectedFilterTeam = null; // Clear filter
    } else {
        selectedFilterTeam = teamName; // Set filter
    }

    applyMatchFilter(); // Apply the filter immediately
});

// --- Main Update Logic ---

function updateTableFromSelections() {
  // Create a deep copy of the initial data with ESTIMATED stats
  let updatedPointsData = JSON.parse(JSON.stringify(initialPointsData));

  // Reset calculated stats back to estimated initial values before applying selections
  updatedPointsData.forEach(team => {
      team.played = team.played; // Keep original played
      team.won = team.won;
      team.lost = team.lost;
      team.no_result = team.no_result;
      team.points = team.points;

      // Use the estimated initial runs/overs as the starting point for this calculation cycle
      team.runsFor = team.initialRunsFor;
      team.oversFacedDecimal = team.initialOversFacedDecimal;
      team.runsAgainst = team.initialRunsAgainst;
      team.oversBowledDecimal = team.initialOversBowledDecimal;
      // NRR will be recalculated at the end
  });

  // Process match selections and update cumulative stats
  remainingMatchesData.forEach(matchInfo => {
      const matchNumber = matchInfo.match_number;
      const selection = matchSelections[matchNumber];

      if (!selection || !selection.winner) return; // Skip if no winner selected for this match

      const teamsArray = matchInfo.teams.split(' vs ');
      const team1FullName = teamsArray[0].trim();
      const team2FullName = teamsArray[1].trim();

      const team1Data = updatedPointsData.find(t => t.team === team1FullName);
      const team2Data = updatedPointsData.find(t => t.team === team2FullName);

      if (!team1Data || !team2Data) return; // Should not happen with valid data

      // --- Update Played, Points, Win/Loss/NR ---
      team1Data.played += 1;
      team2Data.played += 1;

      if (selection.winner === 'NO_RESULT') {
          team1Data.no_result += 1;
          team1Data.points += 1;
          team2Data.no_result += 1;
          team2Data.points += 1;
          // No NRR change for No Result matches
      } else {
          // Win/Loss Scenario
          const winningTeamName = selection.winner;
          const losingTeamName = (winningTeamName === team1FullName) ? team2FullName : team1FullName;
          const winnerData = updatedPointsData.find(t => t.team === winningTeamName);
          const loserData = updatedPointsData.find(t => t.team === losingTeamName);

          if (winnerData && loserData) {
              winnerData.won += 1;
              winnerData.points += 2;
              loserData.lost += 1;

              // --- Accumulate Runs/Overs for NRR only if valid scores are present ---
              const scores = selection.scores;
              // Check for existence and validity of score data (runs are numbers >= 0, oDec is not null)
              const scoresValid = scores &&
                                  scores.team1 && typeof scores.team1.r === 'number' && scores.team1.r !== null && scores.team1.oDec !== null &&
                                  scores.team2 && typeof scores.team2.r === 'number' && scores.team2.r !== null && scores.team2.oDec !== null;

              if (scoresValid) {
                  const r1 = scores.team1.r;
                  const o1Dec = scores.team1.oDec; // Use pre-calculated decimal
                  const r2 = scores.team2.r;
                  const o2Dec = scores.team2.oDec; // Use pre-calculated decimal

                  // Identify which score belongs to winner/loser
                  const winnerRuns = (winningTeamName === team1FullName) ? r1 : r2;
                  const winnerOversFaced = (winningTeamName === team1FullName) ? o1Dec : o2Dec;
                  const loserRuns = (winningTeamName === team1FullName) ? r2 : r1;
                  const loserOversFaced = (winningTeamName === team1FullName) ? o2Dec : o1Dec;

                  // Accumulate stats only if scores were valid for this match
                  winnerData.runsFor += winnerRuns;
                  winnerData.oversFacedDecimal += winnerOversFaced; // Overs winner batted
                  winnerData.runsAgainst += loserRuns;
                  winnerData.oversBowledDecimal += loserOversFaced; // Overs winner bowled (loser batted)

                  loserData.runsFor += loserRuns;
                  loserData.oversFacedDecimal += loserOversFaced;   // Overs loser batted
                  loserData.runsAgainst += winnerRuns;
                  loserData.oversBowledDecimal += winnerOversFaced;  // Overs loser bowled (winner batted)
              }
          }
      }
  }); // End processing selections


  // --- Calculate final NRR for ALL teams ---
  updatedPointsData.forEach(team => {
      const runRateFor = (team.oversFacedDecimal > 0) ? (team.runsFor / team.oversFacedDecimal) : 0;
      const runRateAgainst = (team.oversBowledDecimal > 0) ? (team.runsAgainst / team.oversBowledDecimal) : 0;

      team.net_run_rate = parseFloat((runRateFor - runRateAgainst).toFixed(3)); // Round final NRR

      if (isNaN(team.net_run_rate)) { // Handle potential NaN if all inputs were zero
          team.net_run_rate = 0;
      }
  });

  // --- Sort the data ---
  const sortedData = updatedPointsData.sort((a, b) => {
      // Primary sort: Points (descending)
      if (b.points !== a.points) return b.points - a.points;
      // Secondary sort: Net Run Rate (descending)
      const nrrA = a.net_run_rate ?? -Infinity; // Handle potential null/undefined NRR
      const nrrB = b.net_run_rate ?? -Infinity;
      if (nrrB !== nrrA) return nrrB - nrrA;
      // Tertiary sort: Wins (descending) - Sometimes used as tie-breaker
      if (b.won !== a.won) return b.won - a.won;
      // Final tie-breaker: Team name (alphabetical ascending)
      return a.team.localeCompare(b.team);
  });

  // --- Update ranks based on sorted order ---
  sortedData.forEach((team, index) => {
      team.rank = index + 1;
  });

  // --- Render the updated table ---
  renderTable(sortedData);
}


// --- Event Handlers ---

function handleH1Click() {
    location.reload();
}

function handleBodyClick(event) {
    // Close dropdown if click is outside a dropdown toggle icon AND outside a dropdown menu itself
    if (!event.target.closest('.match-options-icon') && !event.target.closest('.match-options-dropdown')) {
        closeAllDropdowns();
    }
}

function handleResetClick() {
    // Clear state
    matchSelections = {};
    selectedFilterTeam = null; // Reset filter state
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Re-render matches to clear UI states (selections, inputs)
    // Ensure match data is available before re-rendering
    if (remainingMatchesData.length > 0) {
        renderMatches();
    } else {
         matchesContainer.innerHTML = ''; // Clear container if no data
    }


    // Update table to reflect the reset (back to initial data)
    updateTableFromSelections();

    // Apply filter (which will now be null, clearing filter UI)
    applyMatchFilter();

    // Close any potentially open dropdowns/score sections
    closeAllDropdowns();
}


// --- Initial Setup ---

// Wrap initialization in an async function to handle await for fetch
async function initializeApp() {
    console.log("Initializing app..."); // Log start
    if (!tableBody || !matchesContainer || !resetButton || !mainHeading) {
        console.error("One or more essential DOM elements not found!", {
            tableBodyExists: !!tableBody,
            matchesContainerExists: !!matchesContainer,
            resetButtonExists: !!resetButton,
            mainHeadingExists: !!mainHeading
        });
        return;
    }
    console.log("Essential DOM elements found.");

    // Attach core listeners immediately
    mainHeading.style.cursor = 'pointer';
    mainHeading.title = 'Click to Refresh Page';
    mainHeading.addEventListener('click', handleH1Click);
    document.body.addEventListener('click', handleBodyClick);
    resetButton.addEventListener('click', handleResetClick);

    // Load data and render
    loadSelections(); // Load selections from localStorage first
    console.log("Loading remaining matches...");
    await loadRemainingMatches(); // Load match data from JSON
    console.log(`Remaining matches data length: ${remainingMatchesData.length}`);

    // Only proceed with rendering if match data loaded successfully
    if (remainingMatchesData.length > 0) {
        console.log("Match data found, proceeding with rendering...");
        estimateInitialStats(initialPointsData); // Estimate initial runs/overs *once*
        simulateQualification(2000); // Compute qualification chances
        renderMatches(); // Render matches, applying loaded selections and scores
        updateTableFromSelections(); // Calculate initial table state based on loaded selections
        applyMatchFilter(); // Apply filter state on load
        console.log("Initial rendering complete.");
    } else {
        // Error message already shown in loadRemainingMatches if fetch failed
        console.error("Initialization halted: No match data available after load attempt.");
        // Clear table body as well if data fails to load
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Error loading data or no data available.</td></tr>';
    }
}

// Start the application initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
