// Initial Data (Points Table Snapshot)
const rawPointsData = {
  "updated": "2025-05-06",
  "points_table": [
    {
      "position": 1,
      "team": "Royal Challengers Bengaluru",
      "matches_played": 11,
      "wins": 8,
      "losses": 3,
      "ties": 0,
      "no_results": 0,
      "points": 16,
      "net_run_rate": 0.482
    },
    {
      "position": 2,
      "team": "Punjab Kings",
      "matches_played": 11,
      "wins": 7,
      "losses": 3,
      "ties": 0,
      "no_results": 1,
      "points": 15,
      "net_run_rate": 0.376
    },
    {
      "position": 3,
      "team": "Mumbai Indians",
      "matches_played": 11,
      "wins": 7,
      "losses": 4,
      "ties": 0,
      "no_results": 0,
      "points": 14,
      "net_run_rate": 1.274
    },
    {
      "position": 4,
      "team": "Gujarat Titans",
      "matches_played": 10,
      "wins": 7,
      "losses": 3,
      "ties": 0,
      "no_results": 0,
      "points": 14,
      "net_run_rate": 0.867
    },
    {
      "position": 5,
      "team": "Delhi Capitals",
      "matches_played": 11,
      "wins": 6,
      "losses": 4,
      "ties": 0,
      "no_results": 1,
      "points": 13,
      "net_run_rate": 0.362
    },
    {
      "position": 6,
      "team": "Kolkata Knight Riders",
      "matches_played": 11,
      "wins": 5,
      "losses": 5,
      "ties": 0,
      "no_results": 1,
      "points": 11,
      "net_run_rate": 0.249
    },
    {
      "position": 7,
      "team": "Lucknow Super Giants",
      "matches_played": 11,
      "wins": 5,
      "losses": 6,
      "ties": 0,
      "no_results": 0,
      "points": 10,
      "net_run_rate": -0.469
    },
    {
      "position": 8,
      "team": "Sunrisers Hyderabad",
      "matches_played": 11,
      "wins": 3,
      "losses": 7,
      "ties": 0,
      "no_results": 1,
      "points": 7,
      "net_run_rate": -1.192,
      "eliminated": true
    },
    {
      "position": 9,
      "team": "Rajasthan Royals",
      "matches_played": 12,
      "wins": 3,
      "losses": 9,
      "ties": 0,
      "no_results": 0,
      "points": 6,
      "net_run_rate": -0.718,
      "eliminated": true
    },
    {
      "position": 10,
      "team": "Chennai Super Kings",
      "matches_played": 11,
      "wins": 2,
      "losses": 9,
      "ties": 0,
      "no_results": 0,
      "points": 4,
      "net_run_rate": -1.117,
      "eliminated": true
    }
  ]
};

// Process raw data into the structure we use
const initialPointsData = rawPointsData.points_table.map(item => ({
  position: item.position,
  team: item.team,
  played: item.matches_played,
  won: item.wins,
  lost: item.losses,
  no_result: item.no_results, // Renamed from 'ties' for consistency if needed, using original structure here
  points: item.points,
  net_run_rate: item.net_run_rate,
  eliminated: item.eliminated || false, // Ensure eliminated exists

  // Add fields for NRR calculation
  initialRunsFor: 0,
  initialOversFacedDecimal: 0,
  initialRunsAgainst: 0,
  initialOversBowledDecimal: 0,
  original_nrr: item.net_run_rate, // Store original NRR

  // Dynamic fields reset each calculation cycle
  runsFor: 0,
  oversFacedDecimal: 0,
  runsAgainst: 0,
  oversBowledDecimal: 0,
  qualProbability: null // Will hold calculated probability
}));


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
const teamSelect = document.getElementById('teamSelect');
const qualifySimBtn = document.getElementById('qualifySimBtn');
const simResultDiv = document.getElementById('simResult');
const randomizeBtn = document.getElementById('randomizeBtn');


// Constants and Mappings
const LOCAL_STORAGE_KEY = 'iplMatchSelections_v2'; // Added versioning

const teamNameMap = {
  "Gujarat Titans": "GT", "Delhi Capitals": "DC", "Royal Challengers Bengaluru": "RCB",
  "Lucknow Super Giants": "LSG", "Kolkata Knight Riders": "KKR", "Punjab Kings": "PBKS",
  "Mumbai Indians": "MI", "Rajasthan Royals": "RR", "Sunrisers Hyderabad": "SRH",
  "Chennai Super Kings": "CSK"
};

const teamColorMap = {
  "Gujarat Titans": { bg: "#1C3C6B", text: "#FFFFFF" }, "Delhi Capitals": { bg: "#004C93", text: "#EF1B23" },
  "Royal Challengers Bengaluru": { bg: "#EC1C24", text: "#000000" }, "Lucknow Super Giants": { bg: "#00A0DD", text: "#FFFFFF" },
  "Kolkata Knight Riders": { bg: "#3A225D", text: "#F2E18A" }, "Punjab Kings": { bg: "#DD1F2D", text: "#FFFFFF" },
  "Mumbai Indians": { bg: "#006CB7", text: "#FFFFFF" }, "Rajasthan Royals": { bg: "#EA1A85", text: "#FFFFFF" },
  "Sunrisers Hyderabad": { bg: "#F26722", text: "#000000" }, "Chennai Super Kings": { bg: "#FDB913", text: "#000000" }
};

// Global State
let matchSelections = {}; // Stores { match_number: { winner: "Team Name" | "NO_RESULT", scores: { ... } } }
let selectedFilterTeam = null; // Stores the full name of the team to filter by, or null
let qualificationCache = {}; // Cache for simulation results
let lastTableData = null; // Track if table data changed to avoid unnecessary re-renders
let lastRenderedMatchCount = -1; // Track rendered matches for optimization

// Other global variables that might be const but SHOULD be let if reassigned elsewhere:
let remainingMatchesData = []; // Will be loaded from JSON
let hiddenMatchNumbers = []; // To store numbers from hidden_matches.json

// --- Helper Functions ---

function hexToRgba(hex, alpha) {
    if (!hex || typeof hex !== 'string' || hex.length < 4) return `rgba(200, 200, 200, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(200, 200, 200, ${alpha})`;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseOversToDecimal(oversString) {
    if (typeof oversString !== 'string' || oversString.trim() === '') return { decimal: null, valid: false };
    oversString = oversString.trim();
    const match = oversString.match(/^(\d{1,2})(?:\.([0-5]))?$/);
    if (!match) return { decimal: null, valid: false };
    const overs = parseInt(match[1], 10);
    const balls = match[2] ? parseInt(match[2], 10) : 0;
    if (balls < 0 || balls > 5 || overs < 0 || overs > 20 || (overs === 20 && balls > 0)) {
        return { decimal: null, valid: false };
    }
    const decimalValue = parseFloat((overs + (balls / 6.0)).toFixed(5));
    return { decimal: decimalValue, valid: true };
}

function decimalOversToString(decimalOvers) {
    if (decimalOvers === null || isNaN(decimalOvers)) return '';
    const fullOvers = Math.floor(decimalOvers);
    const balls = Math.round((decimalOvers - fullOvers) * 6);
    if (balls === 0) return `${fullOvers}`;
    if (balls === 6) return `${fullOvers + 1}`; // Handle rounding up to next over
    return `${fullOvers}.${balls}`;
}


function applyTeamColorsToButton(button, colors) {
    if (colors) {
        button.style.backgroundColor = colors.bg;
        button.style.color = colors.text;
        button.style.borderColor = colors.bg;
    } else {
        resetButtonColors(button);
    }
}

function resetButtonColors(button) {
    button.style.backgroundColor = '';
    button.style.color = '';
    button.style.borderColor = '';
}

function closeAllDropdowns(excludeDropdown = null) {
    document.querySelectorAll('.match-options-dropdown.visible').forEach(dropdown => {
        if (dropdown !== excludeDropdown) dropdown.classList.remove('visible');
    });
    // Close score inputs as well for cleaner UI
    document.querySelectorAll('.score-inputs.visible').forEach(div => {
       if (div !== excludeDropdown?.closest('.match-card')?.querySelector('.score-inputs')) {
           div.classList.remove('visible');
           div.closest('.match-card')?.querySelector('.score-toggle-icon')?.classList.remove('icon-rotated');
       }
   });
}

// --- NRR and Data Handling ---

function estimateInitialStats(data) {
    const AVERAGE_TOTAL_RUN_RATE = 16.0; // Combined runs per over approximation

    data.forEach(team => {
        // Store initial values from the raw data load if not already stored
        if (team.initialPlayed === undefined) {
            team.initialPlayed = team.played;
            team.initialWon = team.won;
            team.initialLost = team.lost;
            team.initialNoResult = team.no_result;
            team.initialPoints = team.points;
            team.original_nrr = team.net_run_rate; // Store original NRR correctly here
        }

        if (team.initialPlayed > 0) {
            const initialOvers = team.initialPlayed * 20.0;
            team.initialOversFacedDecimal = initialOvers;
            team.initialOversBowledDecimal = initialOvers;

            const rateFor = (AVERAGE_TOTAL_RUN_RATE + team.original_nrr) / 2;
            const rateAgainst = (AVERAGE_TOTAL_RUN_RATE - team.original_nrr) / 2;

            team.initialRunsFor = Math.max(0, Math.round(rateFor * initialOvers));
            team.initialRunsAgainst = Math.max(0, Math.round(rateAgainst * initialOvers));

        } else {
            team.initialRunsFor = 0;
            team.initialOversFacedDecimal = 0;
            team.initialRunsAgainst = 0;
            team.initialOversBowledDecimal = 0;
        }
        // Reset dynamic properties for calculation start
        team.net_run_rate = team.original_nrr; // Start calculation NRR from original
    });
    // console.log("Initial stats estimated:", initialPointsData.map(t => ({ team: t.team, RF: t.initialRunsFor, OF: t.initialOversFacedDecimal, RA: t.initialRunsAgainst, OB: t.initialOversBowledDecimal })));
}

// Seeded random number generator for consistent results in simulations
function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Calculate team strength (higher is better) - ENHANCED
function calculateTeamStrength(team, allTeamsData, currentSelections, remainingMatches, currentMatchNumber = 999) {
    // currentMatchNumber is the number of the match ABOUT to be simulated, used for form/schedule calcs
    if (!team) return 1;

    // --- Base Factors ---
    const pointsFactor = team.points / 7; // Normalize points (roughly 0-2)
    // Use current NRR from simulation data if available, else original NRR
    const currentNRR = team.net_run_rate ?? team.original_nrr ?? 0;
    const nrrFactor = (currentNRR + 2) / 4; // Normalize NRR (roughly 0-1)
    const matchesPlayed = team.played ?? 0;
    const overallWinRatio = matchesPlayed > 0 ? (team.won ?? 0) / matchesPlayed : 0.5;
    const formReliability = Math.min(1, matchesPlayed / 8);
    const matchesRemaining = Math.max(0, 14 - matchesPlayed);
    const matchesRemainingFactor = matchesRemaining / 14;
    const position = allTeamsData.findIndex(t => t.team === team.team) + 1; // Position in the *current* sim data
    const positionFactor = position > 0 ? (allTeamsData.length + 1 - position) / allTeamsData.length : 0.5; // Normalize position (0-1, higher is better)

    // --- Recent Form (Last 5 completed matches before currentMatchNumber) ---
    let recentFormScore = 0;
    if (currentSelections && remainingMatches) {
        const teamRecentResults = [];
        // Get match numbers involving this team, already completed, sorted descending
        const relevantMatchNumbers = Object.keys(currentSelections)
            .map(Number)
            .filter(num => {
                if (num >= currentMatchNumber) return false; // Exclude future/current match
                const matchInfo = remainingMatches.find(m => m.match_number === num);
                return matchInfo && matchInfo.teams.includes(team.team) && currentSelections[num]?.winner; // Ensure match involved team and has a result
            })
            .sort((a, b) => b - a); // Sort recent first

        const MAX_FORM_MATCHES = 5;
        for (const matchNum of relevantMatchNumbers) {
            if (teamRecentResults.length >= MAX_FORM_MATCHES) break;
            const result = currentSelections[matchNum];

            if (result.winner === team.team) teamRecentResults.push('W');
            else if (result.winner === 'NO_RESULT') teamRecentResults.push('N');
            else teamRecentResults.push('L');
        }

        // Calculate weighted form score
        const weights = [0.4, 0.3, 0.15, 0.1, 0.05]; // Higher weight for most recent
        teamRecentResults.forEach((res, idx) => {
            if (idx < weights.length) {
                if (res === 'W') recentFormScore += weights[idx];
                else if (res === 'N') recentFormScore += weights[idx] * 0.3; // Less boost for NR
                // else if (res === 'L') recentFormScore -= weights[idx] * 0.1; // Optional penalty for loss
            }
        });
        recentFormScore = Math.max(0, recentFormScore); // Ensure non-negative
    }
    const formFactor = recentFormScore; // Score is already weighted (max ~1.0)

    // --- Schedule Difficulty (Opponents in remaining UNPLAYED matches) ---
    let avgOpponentStrengthFactor = 0.5; // Default medium difficulty
    if (remainingMatches && allTeamsData) {
        let totalOpponentStrength = 0;
        let opponentCount = 0;
        remainingMatches.forEach(match => {
            // Consider only matches yet to be played in this sim (match # >= current) AND involving this team
            if (match.match_number >= currentMatchNumber && match.teams.includes(team.team)) {
                 // Check if this match has already been decided in currentSelections (it shouldn't be if >= currentMatchNumber, but safe check)
                 if (!currentSelections[match.match_number]?.winner) {
                      const [t1, t2] = match.teams.split(' vs ').map(s => s.trim());
                      const opponentName = t1 === team.team ? t2 : t1;
                      const opponentTeam = allTeamsData.find(t => t.team === opponentName);
                      if (opponentTeam) {
                           // Calculate opponent strength based on THEIR current sim stats (Points + NRR)
                           const oppPointsFactor = (opponentTeam.points ?? 0) / 7; // Normalize points
                           const oppNrrFactor = ((opponentTeam.net_run_rate ?? opponentTeam.original_nrr ?? 0) + 2) / 4; // Normalize NRR
                           // Simple strength metric for opponent
                           const oppStrength = (oppPointsFactor * 1.5) + (oppNrrFactor * 1.0);
                           totalOpponentStrength += oppStrength;
                           opponentCount++;
                      }
                 }
            }
        });

        if (opponentCount > 0) {
            const avgOppStrength = totalOpponentStrength / opponentCount;
            // Invert and scale: Lower opponent strength = easier schedule = higher factor
            // Normalize roughly to 0-1 range (assuming avgOppStrength is roughly 0-3)
            avgOpponentStrengthFactor = Math.max(0, Math.min(1, 1 - (avgOppStrength / 3.0)));
        } else {
             // No remaining opponents? Schedule factor is neutral or max? Let's go neutral.
             avgOpponentStrengthFactor = 0.5;
             if (matchesPlayed >= 14) avgOpponentStrengthFactor = 0.5; // No impact if all matches played
        }
    }

    // --- Combine Factors with Weights ---
    const finalStrength = (
        pointsFactor * 3.0 +            // Points remain crucial
        nrrFactor * 1.8 +               // NRR slightly more important
        (overallWinRatio * formReliability) * 1.0 + // Base win ratio
        formFactor * 1.5 +              // Recent form has significant weight
        avgOpponentStrengthFactor * 1.2 + // Schedule difficulty is important
        matchesRemainingFactor * 0.5 +  // Less weight on just having games left
        positionFactor * 0.3            // Position has minor influence beyond points/NRR
    );

    // Return a positive strength value
    return Math.max(0.1, finalStrength); // Ensure minimum strength > 0
}


function generateCacheKey(selections) {
    if (!selections || Object.keys(selections).length === 0) return 'empty';
    return Object.entries(selections)
        .filter(([_, sel]) => sel && sel.winner) // Only include matches with a selected winner
        .map(([num, sel]) => `${num}:${sel.winner}`)
        .sort()
        .join('|');
}

// Simulate qualification probabilities - ENHANCED
function simulateQualification(baseData, currentSelections, trials = 5000) {
    const cacheKey = generateCacheKey(currentSelections);
     // Check cache first
     if (qualificationCache[cacheKey]) {
         const cachedData = qualificationCache[cacheKey];
         if (cachedData.trials >= trials) {
              // console.log(`Using cached qualification probabilities (Trials: ${cachedData.trials})`);
              return cachedData.probabilities;
         }
     }

    // console.time(`Qualification simulation (${trials} trials)`); // Less verbose

    if (!Array.isArray(baseData) || baseData.length === 0) {
        console.error("Error in simulateQualification: baseData is invalid.");
        return {};
    }

    const counts = {};
    baseData.forEach(team => counts[team.team] = 0);

    const matchesToSimulate = remainingMatchesData.filter(match =>
        !hiddenMatchNumbers.includes(Number(match.match_number))
    );

     // --- Mathematical Elimination Check (Pre-computation) ---
     // Find the points required to *potentially* qualify based on the initial state + selections
     let potentialCutoffPoints = 0;
     // Always define tempDeterministicData for elimination check
     const tempDeterministicData = JSON.parse(JSON.stringify(baseData));
     if (baseData.length >= 4) {
         // Apply selections deterministically (points only needed)
         matchesToSimulate.forEach(match => {
              const selection = currentSelections[match.match_number];
              if(selection?.winner) {
                   const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
                   const t1 = tempDeterministicData.find(t => t.team === t1Name);
                   const t2 = tempDeterministicData.find(t => t.team === t2Name);
                   if(!t1 || !t2) return;
                   if (selection.winner === 'NO_RESULT') { t1.points++; t2.points++; }
                   else if (selection.winner === t1Name) { t1.points+=2; }
                   else if (selection.winner === t2Name) { t2.points+=2; }
              }
         });
         tempDeterministicData.sort((a, b) => b.points - a.points);
         potentialCutoffPoints = tempDeterministicData[3].points; // Points of 4th placed team in current deterministic view
     }
     const mathematicallyEliminatedTeams = new Set();
     baseData.forEach(team => {
          const teamCurrentPoints = tempDeterministicData.find(t=>t.team === team.team)?.points ?? team.points;
          const teamMatchesPlayed = tempDeterministicData.find(t=>t.team === team.team)?.played ?? team.played; // Approx played
          const maxPossiblePoints = teamCurrentPoints + ((14 - teamMatchesPlayed) * 2);
          if (maxPossiblePoints < potentialCutoffPoints) {
               mathematicallyEliminatedTeams.add(team.team);
               // console.log(`Pre-eliminated (mathematically): ${team.team}`);
          }
          if (team.eliminated) { // Respect initial elimination flag
               mathematicallyEliminatedTeams.add(team.team);
          }
     });
     // --- End Mathematical Elimination Check ---


    for (let i = 0; i < trials; i++) {
        // Deep copy initial state for this trial - Use the *original* baseData structure
        const simData = JSON.parse(JSON.stringify(baseData));
        // Reset dynamic NRR to original for the start of each trial's calculation
        simData.forEach(t => t.net_run_rate = t.original_nrr);

        // Keep track of results within this specific trial
        const trialSelections = JSON.parse(JSON.stringify(currentSelections));

        matchesToSimulate.forEach(match => {
            const matchNumber = match.match_number;
            const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());

            const t1 = simData.find(t => t.team === t1Name);
            const t2 = simData.find(t => t.team === t2Name);

            // Skip if teams not found, or if BOTH teams are already mathematically eliminated, or if match already decided
            if (!t1 || !t2 || (mathematicallyEliminatedTeams.has(t1Name) && mathematicallyEliminatedTeams.has(t2Name))) {
                 return;
            }
             // Check if result is already pre-determined by user selection
            const existingSelection = trialSelections[matchNumber];
            let winner = existingSelection?.winner; // Use optional chaining
            let isNoResult = winner === 'NO_RESULT';

            // Only simulate if no winner is pre-selected
            if (!winner) {
                 // Calculate strengths based on the *current state* of simData in this trial
                 // Pass trialSelections for form calculation up to this point
                 const t1Strength = calculateTeamStrength(t1, simData, trialSelections, remainingMatchesData, matchNumber);
                 const t2Strength = calculateTeamStrength(t2, simData, trialSelections, remainingMatchesData, matchNumber);

                 const totalStrength = t1Strength + t2Strength;

                 // Probabilities, ensuring minimum chance and accounting for No Result
                 const NO_RESULT_PROB = 0.05; // 5% chance of No Result
                 const WIN_PROB_TOTAL = 1.0 - NO_RESULT_PROB;
                 const MIN_WIN_PROB = 0.10 * WIN_PROB_TOTAL; // Min 10% win chance (adjusted for NR)
                 const MAX_WIN_PROB = 0.90 * WIN_PROB_TOTAL; // Max 90% win chance (adjusted for NR)

                 let t1WinProb = (totalStrength > 0) ? (t1Strength / totalStrength) * WIN_PROB_TOTAL : 0.5 * WIN_PROB_TOTAL;
                 // Clamp probabilities
                 t1WinProb = Math.max(MIN_WIN_PROB, Math.min(MAX_WIN_PROB, t1WinProb));
                 const t2WinProb = WIN_PROB_TOTAL - t1WinProb;

                 // Seeded random number for deterministic simulation outcome
                 const seedValue = i + matchNumber * 11 + t1Name.length * 3 + t2Name.length * 5;
                 const rand = seededRandom(seedValue);

                 if (rand < NO_RESULT_PROB) {
                      winner = 'NO_RESULT';
                      isNoResult = true;
                 } else if (rand < NO_RESULT_PROB + t1WinProb) {
                      winner = t1Name;
                      isNoResult = false;
                 } else {
                      winner = t2Name;
                      isNoResult = false;
                 }
                 // Store the simulated result for this trial
                 trialSelections[matchNumber] = { winner: winner, scores: {} }; // No scores needed for sim
            }


            // Apply the result (selected or simulated) to simData points/W/L/NR/Played
             // Only update if the team hasn't already played 14 matches IN THIS SIMULATION
             let t1Played = t1.played < 14;
             let t2Played = t2.played < 14;

             if (t1Played) t1.played++;
             if (t2Played) t2.played++;


            if (isNoResult) {
                 if(t1Played) { t1.no_result++; t1.points++; }
                 if(t2Played) { t2.no_result++; t2.points++; }
            } else if (winner === t1Name) {
                 if(t1Played) { t1.won++; t1.points += 2; }
                 if(t2Played) { t2.lost++; }
            } else if (winner === t2Name) {
                 if(t2Played) { t2.won++; t2.points += 2; }
                 if(t1Played) { t1.lost++; }
            }
            // DO NOT update NRR within the simulation loop
        });

        // Sort final simData table for this trial using original NRR for tie-breaking
        simData.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            // Use ORIGINAL NRR as primary tie-breaker in simulation
            const nrrA = a.original_nrr ?? -Infinity;
            const nrrB = b.original_nrr ?? -Infinity;
            if (nrrB !== nrrA) return nrrB - nrrA;
            if (b.won !== a.won) return b.won - a.won; // Wins as secondary tie-breaker
            return a.team.localeCompare(b.team); // Alphabetical as final tie-breaker
        });

        // Count top 4 qualifiers for this trial, respecting pre-elimination
        simData.slice(0, 4).forEach(t => {
             if (counts[t.team] !== undefined && !mathematicallyEliminatedTeams.has(t.team)) {
                  counts[t.team]++;
             }
        });
    } // End trial loop

    const probabilities = {};
    baseData.forEach(team => {
        if (mathematicallyEliminatedTeams.has(team.team)) {
            probabilities[team.team] = 0.0; // Ensure eliminated teams are 0%
        } else {
            probabilities[team.team] = (counts[team.team] || 0) / trials;
        }
    });

    // Store result in cache
    qualificationCache[cacheKey] = { probabilities, trials };
    // console.timeEnd(`Qualification simulation (${trials} trials)`);
    return probabilities;
}


// --- Local Storage ---

function loadSelections() {
    const storedSelections = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSelections) {
        try {
            matchSelections = JSON.parse(storedSelections);
            // Basic validation / migration could happen here if format changes
            if (typeof matchSelections !== 'object' || matchSelections === null) {
                matchSelections = {};
            }
            // Ensure scores object structure exists
             Object.values(matchSelections).forEach(sel => {
                 if (sel && !sel.scores) sel.scores = { team1: {}, team2: {} };
                 if (sel?.scores && !sel.scores.team1) sel.scores.team1 = {};
                 if (sel?.scores && !sel.scores.team2) sel.scores.team2 = {};
             });

        } catch (e) {
            console.error("Error parsing stored selections:", e);
            matchSelections = {};
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    } else {
        matchSelections = {};
    }
    console.log("Loaded selections:", matchSelections);
}

function saveSelections() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matchSelections));
    } catch (e) {
        console.error("Error saving selections to localStorage:", e);
    }
}

// --- Data Loading ---
async function loadRemainingMatches() {
    try {
        const response = await fetch(encodeURI('ipl matches.json?v=' + Date.now())); // Cache buster
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        if (!Array.isArray(jsonData)) throw new Error("Fetched data is not an array");
        remainingMatchesData = jsonData;
        // Apply static removals if needed (though ideally JSON is the source of truth)
        const removed = ["Lucknow Super Giants vs Chennai Super Kings", "Punjab Kings vs Kolkata Knight Riders", "Delhi Capitals vs Rajasthan Royals"];
        remainingMatchesData = remainingMatchesData.filter(m => !removed.includes(m.teams));
        console.log(`Remaining matches loaded successfully (${remainingMatchesData.length} matches).`);
    } catch (error) {
        console.warn("Could not load remaining matches via fetch, using embedded static data:", error);
        remainingMatchesData = staticRemainingMatchesData; // Use fallback
    }
}

async function loadHiddenMatches() {
    try {
        const cacheBuster = '?t=' + Date.now();
        const response = await fetch(encodeURI('hidden_matches.json' + cacheBuster));
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
         if (!Array.isArray(jsonData)) throw new Error("Fetched hidden matches data is not an array");
        hiddenMatchNumbers = jsonData.map(n => Number(n)).filter(n => !isNaN(n)); // Ensure numbers
        console.log("Hidden matches loaded:", hiddenMatchNumbers);
    } catch (error) {
        console.warn("Could not load hidden matches list (hidden_matches.json):", error);
        hiddenMatchNumbers = [];
    }
}

// --- Monte Carlo Simulation for Win Probability (Run Once) ---
window.matchWinProbs = null; // Initialize

function runWinProbabilitySimulations() {
    if (window.matchWinProbs) {
        console.log("Win probabilities already calculated.");
        return; // Don't re-run if already done
    }
    console.log("Running Monte Carlo simulations for initial match win probabilities...");
    const tempWinProbs = {};
    const simulations = 10000; // Number of simulations

    // Use initialPointsData for strength calculation base
    const teamStrengths = {};
    initialPointsData.forEach(team => {
        // Using a simplified strength for this initial display probability
        const pointsFactor = team.points / 7;
        const nrrFactor = (team.original_nrr + 2) / 4;
        const winRatio = team.played > 0 ? team.won / team.played : 0.5;
        teamStrengths[team.team] = (pointsFactor * 1.5) + (nrrFactor * 1.0) + (winRatio * 1.2);
    });


    remainingMatchesData.forEach(match => {
        const [team1FullName, team2FullName] = match.teams.split(' vs ').map(s => s.trim());
        const team1Strength = teamStrengths[team1FullName] || 1;
        const team2Strength = teamStrengths[team2FullName] || 1;
        const totalStrength = Math.max(0.1, team1Strength + team2Strength);
        const team1WinProb = Math.max(0.05, Math.min(0.95, team1Strength / totalStrength));

        let team1Wins = 0;
        for (let i = 0; i < simulations; i++) {
            if (Math.random() < team1WinProb) {
                team1Wins++;
            }
        }
        const team2Wins = simulations - team1Wins;

        tempWinProbs[match.match_number] = {
            [team1FullName]: { count: team1Wins, prob: parseFloat(((team1Wins / simulations) * 100).toFixed(1)) },
            [team2FullName]: { count: team2Wins, prob: parseFloat(((team2Wins / simulations) * 100).toFixed(1)) },
            total: simulations
        };
    });

    window.matchWinProbs = tempWinProbs; // Store globally
    console.log("Initial win probability simulations complete.");
}


// --- Rendering Functions ---

// --- Main Update Logic ---
function updateTableFromSelections() {
    // console.time('Update Table From Selections');

    // 1. Create deep copy & reset dynamic stats based on INITIAL estimated stats
    let updatedPointsData = JSON.parse(JSON.stringify(initialPointsData));
    updatedPointsData.forEach(team => {
        // Reset to initial values BEFORE applying selections for this cycle
        // Make sure these initial... properties were set correctly during estimateInitialStats
        team.played = team.initialPlayed ?? 0;
        team.won = team.initialWon ?? 0;
        team.lost = team.initialLost ?? 0;
        team.no_result = team.initialNoResult ?? 0;
        team.points = team.initialPoints ?? 0;
        // Start NRR calculation from estimated base
        team.runsFor = team.initialRunsFor ?? 0;
        team.oversFacedDecimal = team.initialOversFacedDecimal ?? 0;
        team.runsAgainst = team.initialRunsAgainst ?? 0;
        team.oversBowledDecimal = team.initialOversBowledDecimal ?? 0;
    });

    // 2. Process selected matches and update stats deterministically
    remainingMatchesData.forEach(matchInfo => {
        const matchNumber = matchInfo.match_number;
        const selection = matchSelections[matchNumber];
        if (!selection || !selection.winner) return; // Skip unselected

        const [team1FullName, team2FullName] = matchInfo.teams.split(' vs ').map(s => s.trim());
        const team1Data = updatedPointsData.find(t => t.team === team1FullName);
        const team2Data = updatedPointsData.find(t => t.team === team2FullName);
        if (!team1Data || !team2Data) return;

        // --- Update Played, Points, Win/Loss/NR ---
        // Increment played count *once* per selected match considered (if not already 14)
        let t1IncrementPlayed = team1Data.played < 14;
        let t2IncrementPlayed = team2Data.played < 14;
        if (t1IncrementPlayed) team1Data.played += 1;
        if (t2IncrementPlayed) team2Data.played += 1;

        if (selection.winner === 'NO_RESULT') {
            if(t1IncrementPlayed) { team1Data.no_result += 1; team1Data.points += 1; }
            if(t2IncrementPlayed) { team2Data.no_result += 1; team2Data.points += 1; }
            // No NRR impact for No Result
        } else {
            // Win/Loss Scenario
            const winnerData = (selection.winner === team1FullName) ? team1Data : team2Data;
            const loserData = (selection.winner === team1FullName) ? team2Data : team1Data;
            const winnerPlayed = (selection.winner === team1FullName) ? t1IncrementPlayed : t2IncrementPlayed;
            const loserPlayed = (selection.winner === team1FullName) ? t2IncrementPlayed : t1IncrementPlayed;

            if (winnerPlayed) { winnerData.won += 1; winnerData.points += 2; }
            if (loserPlayed) { loserData.lost += 1; }

            // --- Accumulate Runs/Overs for NRR *if* valid scores are entered ---
            const scores = selection.scores;
            // More robust check for valid numbers and non-null decimals
            const scoresValid = scores &&
                scores.team1 && typeof scores.team1.r === 'number' && !isNaN(scores.team1.r) && scores.team1.r >= 0 && scores.team1.oDec !== null && typeof scores.team1.oDec === 'number' && !isNaN(scores.team1.oDec) && scores.team1.oDec >= 0 &&
                scores.team2 && typeof scores.team2.r === 'number' && !isNaN(scores.team2.r) && scores.team2.r >= 0 && scores.team2.oDec !== null && typeof scores.team2.oDec === 'number' && !isNaN(scores.team2.oDec) && scores.team2.oDec >= 0;

            if (scoresValid) {
                const r1 = scores.team1.r; const o1Dec = scores.team1.oDec;
                const r2 = scores.team2.r; const o2Dec = scores.team2.oDec;

                // Team 1's perspective
                team1Data.runsFor += r1; team1Data.oversFacedDecimal += o1Dec;
                team1Data.runsAgainst += r2; team1Data.oversBowledDecimal += o2Dec;

                // Team 2's perspective
                team2Data.runsFor += r2; team2Data.oversFacedDecimal += o2Dec;
                team2Data.runsAgainst += r1; team2Data.oversBowledDecimal += o1Dec;
            } else if (selection.winner !== 'NO_RESULT') { // Only warn if it wasn't a No Result
                 // console.warn(`Match ${matchNumber}: Winner selected but scores missing/invalid. NRR not updated for this match.`);
            }
        }
    }); // End processing selections

    // 3. Calculate final NRR for ALL teams - REFINED CALCULATION
    updatedPointsData.forEach(team => {
        // Ensure cumulative totals are valid numbers
        const totalRunsFor = Number(team.runsFor) || 0;
        const totalOversFaced = Number(team.oversFacedDecimal) || 0;
        const totalRunsAgainst = Number(team.runsAgainst) || 0;
        const totalOversBowled = Number(team.oversBowledDecimal) || 0;

        // Calculate rates, handling division by zero
        const runRateFor = (totalOversFaced > 0) ? (totalRunsFor / totalOversFaced) : 0;
        const runRateAgainst = (totalOversBowled > 0) ? (totalRunsAgainst / totalOversBowled) : 0;

        // Calculate the difference with full precision available
        const nrrDifference = runRateFor - runRateAgainst;

        // Round ONLY at the very end to 3 decimal places using Math.round for potentially better accuracy
        // Multiply by 1000, round, then divide by 1000
        team.net_run_rate = Math.round(nrrDifference * 1000) / 1000;

        // Handle potential NaN results (e.g., if initial data was flawed)
        if (isNaN(team.net_run_rate)) {
            console.warn(`NRR calculation resulted in NaN for ${team.team}. Falling back to original NRR (${team.original_nrr || 0}).`);
            // Fallback to original NRR stored during initial load
            team.net_run_rate = team.original_nrr !== undefined ? team.original_nrr : 0;
        }
    });

    // 4. Sort the table data (using the newly calculated NRR)
    updatedPointsData.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        // Use the CALCULATED NRR for final sorting
        const nrrA = a.net_run_rate ?? -Infinity;
        const nrrB = b.net_run_rate ?? -Infinity;
        if (nrrB !== nrrA) return nrrB - nrrA;
        if (b.won !== a.won) return b.won - a.won;
        return a.team.localeCompare(b.team);
    });

    // 5. Update positions based on sort order
    updatedPointsData.forEach((team, index) => { team.position = index + 1; });

    // 6. Calculate qualification probabilities (using the appropriate simulation function)
    const allMatchesSelectedOrComplete = updatedPointsData.every(team => team.played >= 14);
    let qualProbs;

    if (allMatchesSelectedOrComplete) {
        qualProbs = {};
        updatedPointsData.forEach(team => {
             qualProbs[team.team] = team.position <= 4 ? 1.0 : 0.0;
        });
        const cacheKey = generateCacheKey(matchSelections);
        if (qualificationCache[cacheKey]) delete qualificationCache[cacheKey];
    } else {
        // Run simulation for the table display column (can use fewer trials here)
        qualProbs = simulateQualification(initialPointsData, matchSelections, 5000); // Pass initialPointsData as the base
    }

    // 7. Add probabilities & check for mathematical elimination for display
    updatedPointsData.forEach(team => {
        const fourthPlacePoints = updatedPointsData[3]?.points ?? 0; // Current 4th place points
        const maxPossiblePoints = team.points + ((14 - team.played) * 2);

        if (team.eliminated || maxPossiblePoints < fourthPlacePoints) { // Check initial flag OR mathematical impossibility
            team.qualProbability = 0.0;
        } else {
            team.qualProbability = qualProbs[team.team] ?? null; // Use null if sim somehow failed for team
        }
    });

    // 8. Render the updated table
    renderTable(updatedPointsData);
    // console.timeEnd('Update Table From Selections');
}



// Helper to format NRR with sign and 3 decimals
function formatNRR(nrr) {
    if (typeof nrr !== 'number' || isNaN(nrr)) return 'N/A';
    const sign = nrr > 0 ? '+' : (nrr < 0 ? '' : '');
    return sign + nrr.toFixed(3);
}

function renderTable(data) {
    // console.time('Table render'); // Less verbose logging

    const dataString = JSON.stringify(data.map(t => ({ p: t.position, pts: t.points, nrr: t.net_run_rate, prob: t.qualProbability }))); // Key differentiating factors
    if (lastTableData === dataString) {
        // console.log('Skipping table render - no data changes');
        // console.timeEnd('Table render');
        return;
    }
    lastTableData = dataString;

    const fragment = document.createDocumentFragment();
    // tableBody.innerHTML = ''; // Clear existing rows - Let fragment replace content

    data.forEach(team => {
        const row = document.createElement('tr');
        row.dataset.team = team.team;
        const colors = teamColorMap[team.team];
        const shortTeamName = teamNameMap[team.team] || team.team;
        // Determine if original NRR should be shown (no matches simulated/changed)
let displayNRR;
if (
    typeof team.initialPlayed === 'number' && typeof team.played === 'number' && team.played === team.initialPlayed &&
    typeof team.initialRunsFor === 'number' && typeof team.runsFor === 'number' && team.runsFor === team.initialRunsFor &&
    typeof team.initialRunsAgainst === 'number' && typeof team.runsAgainst === 'number' && team.runsAgainst === team.initialRunsAgainst
) {
    // Show original NRR from data (prefer original_nrr, fallback to net_run_rate)
    displayNRR = formatNRR(team.original_nrr !== undefined ? team.original_nrr : team.net_run_rate);
} else {
    // Show recalculated NRR
    displayNRR = formatNRR(team.net_run_rate);
}

        if (colors) {
            const bgColor = hexToRgba(colors.bg, 0.25);
            const bgColorLight = hexToRgba(colors.bg, 0.1);
            row.style.background = `linear-gradient(to right, ${bgColor}, ${bgColorLight})`;
            row.style.borderLeft = `4px solid ${colors.bg}`;
             if (team.position <= 4 && !team.eliminated) {
                 row.dataset.playoff = "true";
                 row.style.fontWeight = "500";
                 // Optionally enhance border/style further for playoff spots
                 row.style.borderTop = `1px solid ${hexToRgba(colors.bg, 0.3)}`;
                 row.style.borderBottom = `1px solid ${hexToRgba(colors.bg, 0.3)}`;
             }
        }
        if (team.eliminated) {
            row.style.opacity = "0.6";
            row.classList.add('eliminated'); // Use class for styling
            row.title = "Eliminated from playoff contention";
        }
        if (team.team === selectedFilterTeam) {
            row.classList.add('selected-row'); // Use class for styling
        }

        // Create and append cells (more concise)
        row.innerHTML = `
            <td>${team.position}</td>
            <td class="team-name-cell" title="${team.team}">${team.eliminated ? `<span style="text-decoration: line-through;">${shortTeamName}</span> <span class="eliminated-indicator">(E)</span>` : shortTeamName}</td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.lost}</td>
            <td>${team.no_result}</td>
            <td>${team.points}</td>
            <td>${displayNRR}</td>
            <td class="qual-prob-cell"></td>
        `;

        // Qualification Probability Cell Content
        const qualCell = row.querySelector('.qual-prob-cell');
        if (team.eliminated) {
             qualCell.innerHTML = '<span class="prob-eliminated">0.0%</span>';
             qualCell.title = 'Eliminated';
        } else if (team.qualProbability !== null && team.qualProbability !== undefined) {
             const qualValue = (team.qualProbability * 100).toFixed(1);
             qualCell.textContent = `${qualValue}%`;
             if (team.qualProbability >= 0.75) qualCell.classList.add('prob-high');
             else if (team.qualProbability >= 0.4) qualCell.classList.add('prob-medium');
             else qualCell.classList.add('prob-low');
             // Check for 100% qualification (e.g., all matches done)
             if (team.qualProbability === 1.0 && team.position <= 4) {
                 qualCell.classList.add('prob-qualified');
                 qualCell.title = 'Qualified';
             }
        } else {
             qualCell.textContent = '—'; // Default dash
        }

        fragment.appendChild(row);
    });

    tableBody.innerHTML = ''; // Clear only once before append
    tableBody.appendChild(fragment);
    // console.timeEnd('Table render');
}

// Faster update for match selection states without full re-render
function updateMatchSelectionStates() {
    // console.time('Update Match States');
    matchesContainer.querySelectorAll('.match-card').forEach(matchCard => {
        const matchNumber = parseInt(matchCard.dataset.matchNumber, 10);
        if (isNaN(matchNumber)) return;

        const savedSelection = matchSelections[matchNumber];
        const teamButtons = matchCard.querySelectorAll('.team-button');
        const team1Button = teamButtons[0];
        const team2Button = teamButtons[1];
        const scoreInputsDiv = matchCard.querySelector('.score-inputs');

        // Reset styles first
        matchCard.classList.remove('no-result-selected');
        team1Button.classList.remove('selected');
        team2Button.classList.remove('selected');
        resetButtonColors(team1Button);
        resetButtonColors(team2Button);
        scoreInputsDiv.classList.remove('disabled');
        scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = false);

        // Apply current selection state
        if (savedSelection) {
            if (savedSelection.winner === 'NO_RESULT') {
                matchCard.classList.add('no-result-selected');
                scoreInputsDiv.classList.add('disabled');
                scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = true);
            } else if (savedSelection.winner) {
                const winningButton = savedSelection.winner === team1Button.dataset.teamName ? team1Button : team2Button;
                if (winningButton) { // Check if button exists
                   winningButton.classList.add('selected');
                   applyTeamColorsToButton(winningButton, teamColorMap[savedSelection.winner]);
                }
            }
            // Score values don't need updating here unless explicitly cleared (like in No Result selection)
        }
    });
    // console.timeEnd('Update Match States');
}

function renderMatches() {
    // console.time('Render matches'); // Less verbose logging

    // Run initial win prob sim only once
    if (!window.matchWinProbs) {
        runWinProbabilitySimulations();
    }

    const visibleMatches = remainingMatchesData.filter(m => !hiddenMatchNumbers.includes(Number(m.match_number)));
    const needsFullRender = matchesContainer.children.length !== visibleMatches.length || lastRenderedMatchCount === -1;
     lastRenderedMatchCount = visibleMatches.length; // Update count


    if (!needsFullRender) {
        // console.log("Updating existing match cards state.");
        updateMatchSelectionStates(); // Just update styles/classes
        // console.timeEnd('Render matches');
        return;
    }

    console.log("Performing full render of match cards.");
    matchesContainer.innerHTML = ''; // Clear for full render
    const fragment = document.createDocumentFragment();

    visibleMatches.forEach(match => {
        const teamsArray = match.teams.split(' vs ');
        const team1FullName = teamsArray[0].trim();
        const team2FullName = teamsArray[1].trim();
        const team1ShortName = teamNameMap[team1FullName] || team1FullName;
        const team2ShortName = teamNameMap[team2FullName] || team2FullName;

        const simResult = window.matchWinProbs ? window.matchWinProbs[match.match_number] : null;
        const team1Prob = simResult && simResult[team1FullName] ? simResult[team1FullName].prob : 50;
        const team2Prob = simResult && simResult[team2FullName] ? simResult[team2FullName].prob : 50;
        const team1ColorObj = teamColorMap[team1FullName] || { bg: '#808080', text: '#fff' };
        const team2ColorObj = teamColorMap[team2FullName] || { bg: '#A9A9A9', text: '#fff' };

        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.dataset.matchNumber = match.match_number;

        // Use innerHTML for faster initial structure creation
        matchCard.innerHTML = `
            <span class="score-toggle-icon" title="Toggle Score Input"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg></span>
            <span class="match-options-icon" title="Match Options"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></span>
            <div class="match-info">Match ${match.match_number} - ${match.date}</div>
            <div class="teams">
                <button class="team-button" data-team-name="${team1FullName}" data-result-type="WIN">${team1ShortName}</button>
                <span class="vs-text">vs</span>
                <button class="team-button" data-team-name="${team2FullName}" data-result-type="WIN">${team2ShortName}</button>
            </div>
            <div class="match-options-dropdown">
                <button class="dropdown-item no-result-button" data-result-type="NO_RESULT">No Result</button>
            </div>
            <div class="score-inputs">
                <div class="score-input-group">
                    <label>${team1ShortName}:</label>
                    <input type="number" name="team1Runs" placeholder="Runs" min="0" step="1">
                    <input type="text" name="team1Overs" placeholder="Overs" title="Format: O or O.B (0-5 balls)" pattern="^\\d{1,2}(\\.[0-5])?$">
                </div>
                <div class="score-input-group">
                    <label>${team2ShortName}:</label>
                    <input type="number" name="team2Runs" placeholder="Runs" min="0" step="1">
                    <input type="text" name="team2Overs" placeholder="Overs" title="Format: O or O.B (0-5 balls)" pattern="^\\d{1,2}(\\.[0-5])?$">
                </div>
            </div>
            <div class="probability-bar-container" title="Initial Win Probability: ${team1FullName} ${team1Prob}% vs ${team2FullName} ${team2Prob}%">
                <div class="prob-segment prob-team1" style="width: ${team1Prob}%; background-color: ${team1ColorObj.bg}; color: ${team1ColorObj.text};">${team1Prob}%</div>
                <div class="prob-segment prob-team2" style="width: ${team2Prob}%; background-color: ${team2ColorObj.bg}; color: ${team2ColorObj.text};">${team2Prob}%</div>
            </div>
        `;

        // Get references to interactive elements
        const scoreToggleIcon = matchCard.querySelector('.score-toggle-icon');
        const dropdownIcon = matchCard.querySelector('.match-options-icon');
        const dropdownMenu = matchCard.querySelector('.match-options-dropdown');
        const scoreInputsDiv = matchCard.querySelector('.score-inputs');
        const team1Button = matchCard.querySelector('.team-button[data-team-name="' + team1FullName + '"]');
        const team2Button = matchCard.querySelector('.team-button[data-team-name="' + team2FullName + '"]');
        const noResultButton = matchCard.querySelector('.no-result-button');
        const t1RunsInput = matchCard.querySelector('input[name="team1Runs"]');
        const t1OversInput = matchCard.querySelector('input[name="team1Overs"]');
        const t2RunsInput = matchCard.querySelector('input[name="team2Runs"]');
        const t2OversInput = matchCard.querySelector('input[name="team2Overs"]');

        // Restore State from matchSelections
        const savedSelection = matchSelections[match.match_number];
        if (savedSelection) {
            if (savedSelection.winner === 'NO_RESULT') {
                matchCard.classList.add('no-result-selected');
                scoreInputsDiv.classList.add('disabled');
                scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = true);
            } else if (savedSelection.winner) {
                const winningButton = savedSelection.winner === team1FullName ? team1Button : team2Button;
                if (winningButton) {
                   winningButton.classList.add('selected');
                   applyTeamColorsToButton(winningButton, teamColorMap[savedSelection.winner]);
                }
            }
            if (savedSelection.scores) {
                t1RunsInput.value = savedSelection.scores.team1?.r ?? '';
                t1OversInput.value = savedSelection.scores.team1?.oStr ?? '';
                t2RunsInput.value = savedSelection.scores.team2?.r ?? '';
                t2OversInput.value = savedSelection.scores.team2?.oStr ?? '';
            }
        }

        // --- Event Listeners --- (Attached after elements are created)

        // Score Input Change Listener
        [t1RunsInput, t1OversInput, t2RunsInput, t2OversInput].forEach(input => {
            input.addEventListener('input', () => {
                const currentMatchNumber = match.match_number;
                if (!matchSelections[currentMatchNumber]) {
                    matchSelections[currentMatchNumber] = { winner: null, scores: { team1: {}, team2: {} } };
                }
                const scores = matchSelections[currentMatchNumber].scores;
                scores.team1.r = t1RunsInput.value.trim() === '' ? null : parseInt(t1RunsInput.value, 10);
                scores.team1.oStr = t1OversInput.value;
                scores.team2.r = t2RunsInput.value.trim() === '' ? null : parseInt(t2RunsInput.value, 10);
                scores.team2.oStr = t2OversInput.value;

                const { decimal: o1Dec, valid: o1Valid } = parseOversToDecimal(t1OversInput.value);
                const { decimal: o2Dec, valid: o2Valid } = parseOversToDecimal(t2OversInput.value);
                scores.team1.oDec = o1Valid ? o1Dec : null;
                scores.team2.oDec = o2Valid ? o2Dec : null;

                // Validate overs input visually
                t1OversInput.setCustomValidity(o1Valid || t1OversInput.value.trim() === '' ? '' : 'Invalid format (e.g., 20 or 19.5)');
                t2OversInput.setCustomValidity(o2Valid || t2OversInput.value.trim() === '' ? '' : 'Invalid format (e.g., 20 or 18.2)');
                t1OversInput.reportValidity();
                t2OversInput.reportValidity();

                saveSelections();
                updateTableFromSelections(); // Update table immediately on score change
            });
        });

        // Result Selection (Team Wins or No Result)
        [team1Button, team2Button, noResultButton].forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const currentMatchNumber = match.match_number;
                const resultType = button.dataset.resultType;
                const selectedResult = resultType === 'WIN' ? button.dataset.teamName : 'NO_RESULT';

                const isCurrentlySelected = matchSelections[currentMatchNumber]?.winner === selectedResult;

                // Reset UI state for this card first
                matchCard.classList.remove('no-result-selected');
                [team1Button, team2Button].forEach(btn => { btn.classList.remove('selected'); resetButtonColors(btn); });
                scoreInputsDiv.classList.remove('disabled');
                scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = false);


                if (isCurrentlySelected) {
                    // Deselecting
                    if (matchSelections[currentMatchNumber]) {
                        matchSelections[currentMatchNumber].winner = null;
                        // Keep scores even if winner is deselected
                    }
                } else {
                    // Selecting a new option
                    if (!matchSelections[currentMatchNumber]) {
                        matchSelections[currentMatchNumber] = { winner: null, scores: { team1: {}, team2: {} } };
                    }
                    matchSelections[currentMatchNumber].winner = selectedResult;

                    if (selectedResult === 'NO_RESULT') {
                        matchCard.classList.add('no-result-selected');
                        scoreInputsDiv.classList.add('disabled');
                        scoreInputsDiv.querySelectorAll('input').forEach(input => {
                             input.disabled = true;
                             input.value = ''; // Clear inputs visually
                        });
                         // Also clear stored scores
                        if (matchSelections[currentMatchNumber].scores) {
                            matchSelections[currentMatchNumber].scores = { team1: {}, team2: {} };
                        }
                    } else {
                        // Team win selected
                        button.classList.add('selected');
                        applyTeamColorsToButton(button, teamColorMap[selectedResult]);
                        // Inputs enabled by default reset state
                    }
                }

                closeAllDropdowns();
                saveSelections();
                updateTableFromSelections(); // Update table after selection change
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
            closeAllDropdowns(); // Close option dropdowns when opening scores
            const isOpening = !scoreInputsDiv.classList.contains('visible');
             // Optional: Close other score sections
             if (isOpening) {
                  document.querySelectorAll('.score-inputs.visible').forEach(div => {
                       if (div !== scoreInputsDiv) {
                            div.classList.remove('visible');
                            div.closest('.match-card')?.querySelector('.score-toggle-icon')?.classList.remove('icon-rotated');
                       }
                  });
             }
            scoreInputsDiv.classList.toggle('visible');
            scoreToggleIcon.classList.toggle('icon-rotated');
        });

        fragment.appendChild(matchCard);
    }); // End forEach match

    matchesContainer.appendChild(fragment);
    // console.timeEnd('Render matches');
}


// --- Filtering Logic ---

function applyMatchFilter() {
    const allMatchCards = matchesContainer.querySelectorAll('.match-card');
    const tableRows = tableBody.querySelectorAll('tr');

    // Update table row highlighting (using CSS classes)
    tableRows.forEach(row => {
        row.classList.toggle('selected-row', row.dataset.team === selectedFilterTeam);
    });

    // Filter match cards visibility
    let visibleCount = 0;
    allMatchCards.forEach(card => {
        const teamButtons = card.querySelectorAll('.team-button[data-team-name]');
        const team1Name = teamButtons[0]?.dataset.teamName;
        const team2Name = teamButtons[1]?.dataset.teamName;
        const isVisible = !selectedFilterTeam || team1Name === selectedFilterTeam || team2Name === selectedFilterTeam;

        card.classList.toggle('hidden', !isVisible);
        if(isVisible) visibleCount++;
    });

    // Add/remove body class for filter state styling
    document.body.classList.toggle('filter-active', !!selectedFilterTeam);

    // If the number of visible matches changed, we might need a full re-render next time renderMatches is called
    // This helps if filtering hides/shows many cards, ensuring layout is correct.
    if (visibleCount !== lastRenderedMatchCount) {
         lastRenderedMatchCount = -1; // Force potential full re-render on next match render call
    }
}

// --- Event Listeners Setup ---

function setupEventListeners() {
    // (Keep your other event listeners here)

    // Reset Button
    if (resetButton) {
        resetButton.addEventListener('click', handleResetClick);
    } else {
        console.error("Reset button not found!");
    }

    // (Keep attachment logic for other listeners like tableBody, randomizeBtn, mainHeading, etc.)
    // ... other listeners ...
     // Table Row Click for Filtering
    tableBody.addEventListener('click', (event) => {
        const clickedRow = event.target.closest('tr');
        if (!clickedRow || !clickedRow.dataset.team) return;
        const teamName = clickedRow.dataset.team;

        selectedFilterTeam = (selectedFilterTeam === teamName) ? null : teamName;
        applyMatchFilter(); // Apply filter immediately
        // If filter change might require match re-layout, trigger render check
        // renderMatches(); // This might be too aggressive, applyMatchFilter handles visibility
    });

     // Randomize Button
     if (randomizeBtn) {
         randomizeBtn.addEventListener('click', handleRandomizeClick);
     } else {
         console.warn("Randomize button not found!");
     }

    // Main Heading Click for Reload
    if (mainHeading) {
        mainHeading.style.cursor = 'pointer';
        mainHeading.title = 'Click to Refresh Page';
        mainHeading.addEventListener('click', () => location.reload());
    } else {
        console.error("Main heading (h1) not found!");
    }

    // Body Click to Close Dropdowns
    document.body.addEventListener('click', (event) => {
        // Close dropdowns/score inputs if clicking outside interactive elements
        if (!event.target.closest('.match-options-icon') &&
            !event.target.closest('.match-options-dropdown') &&
            !event.target.closest('.score-toggle-icon') &&
            !event.target.closest('.score-inputs') && // Also check click isn't inside score input area
            !event.target.closest('.team-button') && // Don't close if clicking a team button
            !event.target.closest('button')) { // General check for buttons maybe? Be careful not too broad.
            closeAllDropdowns();
        }
    });

     // Team Simulation Button ("Playoffs Chances")
     if (teamSelect && qualifySimBtn && simResultDiv) {
         qualifySimBtn.addEventListener('click', handleQualifySimulationClick);
     } else {
         console.warn("Team simulation elements (select, button, result div) not all found.");
     }
}


// --- Main Update Logic ---

function updateTableFromSelections() {
    // console.time('Update Table From Selections'); // Less verbose logging

    // 1. Create deep copy & reset dynamic stats based on INITIAL estimated stats
    let updatedPointsData = JSON.parse(JSON.stringify(initialPointsData));
    updatedPointsData.forEach(team => {
        // Reset to initial values BEFORE applying selections for this cycle
        team.played = team.initialPlayed || team.played; // Use original raw played count
        team.won = team.initialWon || team.won;
        team.lost = team.initialLost || team.lost;
        team.no_result = team.initialNoResult || team.no_result;
        team.points = team.initialPoints || team.points;

        // Start NRR calculation from estimated base
        team.runsFor = team.initialRunsFor;
        team.oversFacedDecimal = team.initialOversFacedDecimal;
        team.runsAgainst = team.initialRunsAgainst;
        team.oversBowledDecimal = team.initialOversBowledDecimal;
    });
     // Store initial stats if not already done (first run)
     if (!updatedPointsData[0].initialPlayed) {
         updatedPointsData.forEach(team => {
             team.initialPlayed = team.played;
             team.initialWon = team.won;
             team.initialLost = team.lost;
             team.initialNoResult = team.no_result;
             team.initialPoints = team.points;
         });
     }

    // 2. Process selected matches and update stats deterministically
    remainingMatchesData.forEach(matchInfo => {
        const matchNumber = matchInfo.match_number;
        const selection = matchSelections[matchNumber];
        if (!selection || !selection.winner) return; // Skip unselected

        const [team1FullName, team2FullName] = matchInfo.teams.split(' vs ').map(s => s.trim());
        const team1Data = updatedPointsData.find(t => t.team === team1FullName);
        const team2Data = updatedPointsData.find(t => t.team === team2FullName);
        if (!team1Data || !team2Data) return;

        // Update Played, Points, Win/Loss/NR (if not already maxed)
         // Check if this match result has already been accounted for in the initial data load state
         // We assume the initial data reflects *some* matches played. We only increment based on *selected* future matches.
         // This logic needs refinement based on whether initialPointsData represents the *absolute beginning* or a *snapshot*.
         // Assuming it's a snapshot, we only add stats for matches *in remainingMatchesData* that are selected.
         // A simple check: Only increment if team's played count is less than max (14)
         const t1PlayedBefore = team1Data.played; // Store played before increment
         const t2PlayedBefore = team2Data.played;

         // Increment played count *once* per selected match considered
         if (team1Data.played < 14) team1Data.played += 1;
         if (team2Data.played < 14) team2Data.played += 1;


        if (selection.winner === 'NO_RESULT') {
             team1Data.no_result += 1; team1Data.points += 1;
             team2Data.no_result += 1; team2Data.points += 1;
            // No NRR impact for No Result
        } else {
            // Win/Loss Scenario
            const winnerData = (selection.winner === team1FullName) ? team1Data : team2Data;
            const loserData = (selection.winner === team1FullName) ? team2Data : team1Data;

            winnerData.won += 1; winnerData.points += 2;
            loserData.lost += 1;

            // Accumulate Runs/Overs for NRR *if* valid scores are entered
            const scores = selection.scores;
            const scoresValid = scores &&
                scores.team1 && typeof scores.team1.r === 'number' && scores.team1.r >= 0 && scores.team1.oDec !== null && scores.team1.oDec >= 0 &&
                scores.team2 && typeof scores.team2.r === 'number' && scores.team2.r >= 0 && scores.team2.oDec !== null && scores.team2.oDec >= 0;

            if (scoresValid) {
                const r1 = scores.team1.r; const o1Dec = scores.team1.oDec;
                const r2 = scores.team2.r; const o2Dec = scores.team2.oDec;

                // Team 1's perspective
                team1Data.runsFor += r1; team1Data.oversFacedDecimal += o1Dec;
                team1Data.runsAgainst += r2; team1Data.oversBowledDecimal += o2Dec;

                // Team 2's perspective
                team2Data.runsFor += r2; team2Data.oversFacedDecimal += o2Dec;
                team2Data.runsAgainst += r1; team2Data.oversBowledDecimal += o1Dec;
            } else {
                 // If scores invalid/missing, apply a default NRR impact (less accurate)
                 // Example: Assume winner won by avg margin, loser lost by avg margin
                 // This is complex and less ideal than requiring score input.
                 // For now, if scores are missing, NRR won't change for that match.
                 console.warn(`Match ${matchNumber}: Winner selected but scores missing/invalid. NRR not updated for this match.`);
            }
        }
    });

    // 3. Calculate final NRR for all teams
    updatedPointsData.forEach(team => {
        // Avoid division by zero
        const runRateFor = (team.oversFacedDecimal > 0) ? (team.runsFor / team.oversFacedDecimal) : 0;
        const runRateAgainst = (team.oversBowledDecimal > 0) ? (team.runsAgainst / team.oversBowledDecimal) : 0;
        team.net_run_rate = parseFloat((runRateFor - runRateAgainst).toFixed(3));
        if (isNaN(team.net_run_rate)) team.net_run_rate = team.original_nrr || 0; // Fallback if calculation fails
    });

    // 4. Sort the table data
    updatedPointsData.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const nrrA = a.net_run_rate ?? -Infinity;
        const nrrB = b.net_run_rate ?? -Infinity;
        if (nrrB !== nrrA) return nrrB - nrrA;
        if (b.won !== a.won) return b.won - a.won;
        return a.team.localeCompare(b.team);
    });

    // 5. Update positions based on sort order
    updatedPointsData.forEach((team, index) => { team.position = index + 1; });

    // 6. Calculate qualification probabilities (use QUICK simulation here)
    const allMatchesSelectedOrComplete = updatedPointsData.every(team => team.played >= 14);
    let qualProbs;

    if (allMatchesSelectedOrComplete) {
        qualProbs = {};
        updatedPointsData.forEach(team => {
             qualProbs[team.team] = team.position <= 4 ? 1.0 : 0.0;
        });
         // Clear cache if state is now deterministic
         const cacheKey = generateCacheKey(matchSelections);
         if (qualificationCache[cacheKey]) delete qualificationCache[cacheKey];
    } else {
        // Run a faster simulation just for the table display column
        qualProbs = simulateQualification(initialPointsData, matchSelections, 5000); // Fewer trials
    }

    // 7. Add probabilities to team data
    updatedPointsData.forEach(team => {
         if (team.eliminated) {
             team.qualProbability = 0.0;
         } else {
             team.qualProbability = qualProbs[team.team] ?? null; // Use null if sim fails? Or 0?
         }
         // Check if team is mathematically eliminated based on current selections
         const maxPossiblePoints = team.points + ( (14 - team.played) * 2);
         // Find points of 4th placed team *currently*
         const fourthPlacePoints = updatedPointsData[3]?.points ?? 0; // Get points of 4th team after sorting
         if (!team.eliminated && maxPossiblePoints < fourthPlacePoints) {
             // TODO: Add more robust mathematical elimination check (consider NRR etc.)
             // Simple check: if max points < current 4th place points, likely eliminated
             // team.qualProbability = 0.0; // Could override simulation here
         }
    });


    // 8. Render the updated table
    renderTable(updatedPointsData);
    // console.timeEnd('Update Table From Selections');
}


// --- Event Handler Functions ---

function handleResetClick() {
    console.log("Resetting simulation...");
    // Provide immediate visual feedback
    if (resetButton) { // Check if button exists
        resetButton.disabled = true; // Disable briefly during reset
        resetButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        setTimeout(() => {
            resetButton.style.backgroundColor = "";
            resetButton.disabled = false;
        }, 200); // Slightly longer timeout for visual effect
    }

    // 1. Clear Core State Variables
    matchSelections = {};
    selectedFilterTeam = null;
    qualificationCache = {}; // Clear simulation cache

    // 2. Clear Rendering Cache Flags
    lastTableData = null; // Force table re-render
    lastRenderedMatchCount = -1; // Force matches re-render

    // 3. Clear Local Storage
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // 4. Clear specific UI elements if they exist
    if (simResultDiv) simResultDiv.innerHTML = '';
    if (teamSelect) teamSelect.value = ''; // Reset dropdown if it exists

    // 5. Defer heavy updates to allow UI feedback (like button press)
    // Use setTimeout to ensure visual feedback happens first
    setTimeout(() => {
        try {
            // --- Re-render and Recalculate ---
            // Note: estimateInitialStats should have run on load and initialPointsData holds those estimates.
            // We don't need to re-run estimateInitialStats itself, just use the initial data.

            // Re-render matches based on the now empty matchSelections
            renderMatches();

            // Recalculate table based on the now empty matchSelections (goes back to initial state)
            // updateTableFromSelections handles using initialPointsData as base when selections are empty.
            updateTableFromSelections();

            // Reset any visual filtering
            applyMatchFilter();

            // Close any open dropdowns/score inputs
            closeAllDropdowns();

            console.log("Simulation reset complete.");

        } catch (error) {
            console.error("Error during reset process:", error);
            // Optionally display an error message to the user
            if (simResultDiv) simResultDiv.innerHTML = '<span style="color: red;">Error during reset.</span>';
            // Re-enable button even if error occurred
             if (resetButton) resetButton.disabled = false;
        }
    }, 50); // Small delay
}

function handleQualifySimulationClick() {
    const selectedTeam = teamSelect ? teamSelect.value : null;
    if (!selectedTeam && teamSelect) { // Check teamSelect exists before accessing value
        simResultDiv.textContent = 'Please select a team.';
        return;
    }

    qualifySimBtn.disabled = true;
    const originalText = qualifySimBtn.textContent;
    qualifySimBtn.textContent = 'Simulating...';
    simResultDiv.textContent = 'Running 20,000 simulations... This may take a moment.';
    console.log(`Starting detailed qualification simulation for ${selectedTeam || 'all teams'}...`);


    // Run the detailed simulation in the background
    setTimeout(() => {
        console.time('Detailed Qualification Simulation (Button)');
        // Use HIGH number of trials for accuracy when button clicked
        const qualProbs = simulateQualification(initialPointsData, matchSelections, 20000);
        console.timeEnd('Detailed Qualification Simulation (Button)');

        // Update the main table data object with these more accurate probabilities
        initialPointsData.forEach(team => {
            team.qualProbability = qualProbs[team.team] ?? 0;
        });

        // Re-run the deterministic part of the update and re-render the table
        // This ensures the table reflects the LATEST deterministic state + the NEW accurate probs
        updateTableFromSelections(); // This will use the updated qualProbs from above

        // Update the specific team result display if a team was selected
        if (selectedTeam) {
             const teamProb = qualProbs[selectedTeam] ?? 0;
             let percent = (teamProb * 100).toFixed(1);
             simResultDiv.innerHTML = `${selectedTeam} playoffs chance: <strong>${percent}%</strong>`;
        } else {
            simResultDiv.textContent = 'Detailed simulation complete. See table.';
        }

        qualifySimBtn.textContent = originalText; // Restore button text
        qualifySimBtn.disabled = false;
        console.log(`Detailed qualification simulation complete.`);

    }, 50); // setTimeout allows UI to update ("Simulating...") before blocking
}

// --- Helper Function for Randomize Button ---
function generateRandomMatchResult(team1Name, team2Name) {
    const NO_RESULT_CHANCE = 0.03;
    if (Math.random() < NO_RESULT_CHANCE) {
        return { winner: 'NO_RESULT', scores: { team1: {}, team2: {} } };
    }

    // Simulate Team 1 (Batting First) - More realistic scores
    const t1Runs = Math.floor(Math.random() * (220 - 130 + 1)) + 130; // Range 130-220
    const t1OversDecimal = 20.0;
    const t1OversString = decimalOversToString(t1OversDecimal);

    // Simulate Team 2 (Chasing)
    const target = t1Runs + 1;
    let t2Runs, t2OversDecimal;
    const CHASE_SUCCESS_CHANCE = 0.5; // 50% chance base

    if (Math.random() < CHASE_SUCCESS_CHANCE) {
        // Chase Success
        t2Runs = target + Math.floor(Math.random() * 15); // Win margin 1-15 runs more likely
        // Overs taken: Generally between 17.0 and 20.0
        const oversRand = Math.random();
        if (oversRand < 0.1) t2OversDecimal = Math.min(19.5, 16.0 + Math.random() * 2); // Quick chase (16-18) - 10%
        else if (oversRand < 0.7) t2OversDecimal = Math.min(19.5, 18.0 + Math.random() * 1.8); // Normal chase (18-19.5) - 60%
        else t2OversDecimal = 20.0; // Full overs chase - 30%

        // Ensure overs make sense (can't be 0 if runs > 0)
        if (t2Runs > 0 && t2OversDecimal <= 0) t2OversDecimal = 1 + Math.random(); // At least 1 over
        t2OversDecimal = parseFloat(t2OversDecimal.toFixed(1)); // Format balls correctly .1 to .5

    } else {
        // Chase Failure
        // Lose by 5 to 60 runs typically
        const lossMargin = Math.floor(Math.random() * (60 - 5 + 1)) + 5;
        t2Runs = Math.max(0, t1Runs - lossMargin);
        // Overs: Usually 20.0, sometimes bowled out earlier (15-19.5)
        const oversRand = Math.random();
         if (oversRand < 0.75) t2OversDecimal = 20.0; // 75% chance 20 overs
         else t2OversDecimal = Math.min(19.5, 15.0 + Math.random() * 4.8); // 25% chance 15.0-19.5

         if (t2Runs > 0 && t2OversDecimal <= 0) t2OversDecimal = 1 + Math.random(); // At least 1 over
         t2OversDecimal = parseFloat(t2OversDecimal.toFixed(1));
    }

    const t2OversString = decimalOversToString(t2OversDecimal);
    const winner = (t2Runs > t1Runs) ? team2Name : team1Name;

    // Ensure runs/overs are valid numbers before returning
    const finalT1Runs = isNaN(t1Runs) ? 0 : t1Runs;
    const finalT1Overs = isNaN(t1OversDecimal) ? 0 : t1OversDecimal;
    const finalT2Runs = isNaN(t2Runs) ? 0 : t2Runs;
    const finalT2Overs = isNaN(t2OversDecimal) ? 0 : t2OversDecimal;


    return {
        winner,
        scores: {
            team1: { r: finalT1Runs, oStr: decimalOversToString(finalT1Overs), oDec: finalT1Overs },
            team2: { r: finalT2Runs, oStr: decimalOversToString(finalT2Overs), oDec: finalT2Overs }
        }
    };
}

function handleRandomizeClick() {
    console.log("Randomizing remaining match results...");
    if (randomizeBtn) {
        randomizeBtn.disabled = true; // Disable during processing
        randomizeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        setTimeout(() => {
            randomizeBtn.style.backgroundColor = "";
            randomizeBtn.disabled = false;
        } , 150);
    }

    if (!Array.isArray(remainingMatchesData)) {
        console.error("Remaining matches data not available for randomization.");
        return;
    }

    const favoriteTeam = teamSelect ? teamSelect.value : null;
    if (simResultDiv) simResultDiv.innerHTML = 'Randomizing...';

    // Clear existing selections FIRST
    matchSelections = {};

    // Generate random results (potentially favoring a team)
    // Use a temporary data structure to track points during the randomization process
    // to help the "favor team" logic make better decisions
    let tempPointsData = JSON.parse(JSON.stringify(initialPointsData)); // Start with initial state
     // Apply initial stats estimation if not done
     if (!tempPointsData[0].initialRunsFor) {
          estimateInitialStats(tempPointsData);
     }
     // Reset dynamic properties before starting the sim
     tempPointsData.forEach(team => {
         team.played = team.initialPlayed || team.played;
         team.won = team.initialWon || team.won;
         team.lost = team.initialLost || team.lost;
         team.no_result = team.initialNoResult || team.no_result;
         team.points = team.initialPoints || team.points;
     });


    remainingMatchesData.forEach(match => {
        if (hiddenMatchNumbers.includes(Number(match.match_number))) return; // Skip hidden

        const matchNumber = match.match_number;
        const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
        const team1CurrentData = tempPointsData.find(t => t.team === t1Name);
        const team2CurrentData = tempPointsData.find(t => t.team === t2Name);
        const favoriteTeamData = favoriteTeam ? tempPointsData.find(t => t.team === favoriteTeam) : null;

        let result;

        // --- Logic to potentially favor the selected team ---
        if (favoriteTeam && (t1Name === favoriteTeam || t2Name === favoriteTeam)) {
            // Match involves favorite team: Make them win
            const winner = favoriteTeam;
            const loser = (t1Name === favoriteTeam) ? t2Name : t1Name;
            // Generate a plausible win result
            const winScore = Math.floor(Math.random() * (200 - 160 + 1)) + 160;
            const loseScore = Math.max(0, winScore - (Math.floor(Math.random() * 40) + 10)); // Lose by 10-50 runs
            result = {
                winner: winner,
                scores: {
                    team1: { r: (t1Name === winner ? winScore : loseScore), oStr: "20", oDec: 20.0 },
                    team2: { r: (t2Name === winner ? winScore : loseScore), oStr: "20", oDec: 20.0 } // Simplification: assume 20 overs
                }
            };
            console.log(`Match ${matchNumber}: Favoring ${favoriteTeam} to win.`);

        } else if (favoriteTeam && favoriteTeamData && team1CurrentData && team2CurrentData) {
            // Match does NOT involve favorite team. Check if opponents are threats.
            // "Threat" could mean: currently above favorite, or could overtake favorite.
            const favPoints = favoriteTeamData.points;
            const t1Points = team1CurrentData.points;
            const t2Points = team2CurrentData.points;
            let shouldIntervene = false;
            let loserToPick = null;

            // Simple intervention: If both teams are currently ahead of favorite team, make one lose.
            if (t1Points > favPoints && t2Points > favPoints) {
                shouldIntervene = true;
                loserToPick = (t1Points > t2Points) ? t1Name : t2Name; // Make the higher-ranked threat lose
                 console.log(`Match ${matchNumber}: Both ${t1Name}(${t1Points}) and ${t2Name}(${t2Points}) ahead of ${favoriteTeam}(${favPoints}). Making ${loserToPick} lose.`);
            }
            // Add more complex intervention logic here if needed (e.g., based on potential points)

            if (shouldIntervene && loserToPick) {
                 const winner = (loserToPick === t1Name) ? t2Name : t1Name;
                 const winScore = Math.floor(Math.random() * (190 - 150 + 1)) + 150;
                 const loseScore = Math.max(0, winScore - (Math.floor(Math.random() * 30) + 10));
                 result = {
                      winner: winner,
                      scores: {
                           team1: { r: (t1Name === winner ? winScore : loseScore), oStr: "20", oDec: 20.0 },
                           team2: { r: (t2Name === winner ? winScore : loseScore), oStr: "20", oDec: 20.0 }
                      }
                 };
            } else {
                 // No intervention needed, generate random result
                 result = generateRandomMatchResult(t1Name, t2Name);
            }
        } else {
            // No favorite team selected, or data missing - normal random result
            result = generateRandomMatchResult(t1Name, t2Name);
        }

        // Store the generated result
        matchSelections[matchNumber] = {
            winner: result.winner,
            scores: result.scores
        };

        // Update the temporary points data based on the result for the next match's decision
         if (team1CurrentData && team2CurrentData) {
              team1CurrentData.played++; team2CurrentData.played++;
              if (result.winner === 'NO_RESULT') {
                   team1CurrentData.points++; team1CurrentData.no_result++;
                   team2CurrentData.points++; team2CurrentData.no_result++;
              } else if (result.winner === t1Name) {
                   team1CurrentData.points += 2; team1CurrentData.won++;
                   team2CurrentData.lost++;
              } else if (result.winner === t2Name) {
                   team2CurrentData.points += 2; team2CurrentData.won++;
                   team1CurrentData.lost++;
              }
         }
    });

    // Check final standing of favorite team after randomization
     if (favoriteTeam && simResultDiv) {
          // Sort the *final* temp data
          tempPointsData.sort((a, b) => {
              if (b.points !== a.points) return b.points - a.points;
              // Add NRR / Wins tiebreaker if needed for accurate rank check
               const nrrA = a.original_nrr ?? -Infinity; // Use original for consistency in this sim context
               const nrrB = b.original_nrr ?? -Infinity;
               if (nrrB !== nrrA) return nrrB - nrrA;
               if (b.won !== a.won) return b.won - a.won;
              return a.team.localeCompare(b.team);
          });
          const favoriteRank = tempPointsData.findIndex(t => t.team === favoriteTeam) + 1;
          const favoriteFinalPoints = tempPointsData.find(t => t.team === favoriteTeam)?.points;

          if (favoriteRank > 0 && favoriteRank <= 4) {
              simResultDiv.innerHTML = `<span style="color: #4caf50;">Favored simulation placed ${favoriteTeam} in top 4! (Rank: #${favoriteRank}, Points: ${favoriteFinalPoints})</span>`;
          } else if (favoriteRank > 4) {
              simResultDiv.innerHTML = `<span style="color: #ff9800;">Favored simulation result: ${favoriteTeam} finished at #${favoriteRank} (Points: ${favoriteFinalPoints}).</span>`;
          } else {
              simResultDiv.innerHTML = `<span style="color: #f44336;">Could not determine rank for ${favoriteTeam} in favored simulation.</span>`;
          }
     } else if (simResultDiv) {
          simResultDiv.innerHTML = 'Randomization complete.';
     }


    // Save, re-render matches with new selections, and update table
    saveSelections();
    lastRenderedMatchCount = -1; // Force full match re-render to show scores/winners
    renderMatches();
    updateTableFromSelections();
    applyMatchFilter(); // Apply filter if active

    console.log("Randomization finished.");
}


// --- Initial Setup ---

async function initializeApp() {
    console.log("Initializing IPL Points Table Simulator...");

    // Check essential elements
    if (!tableBody || !matchesContainer || !resetButton || !mainHeading) {
        console.error("Initialization Error: One or more essential DOM elements not found!", {
            tableBodyExists: !!tableBody, matchesContainerExists: !!matchesContainer,
            resetButtonExists: !!resetButton, mainHeadingExists: !!mainHeading
        });
        // Display error message to user
        if(matchesContainer) matchesContainer.innerHTML = '<p style="color: red; text-align: center;">Error: Page elements missing. Cannot load simulator.</p>';
        return;
    }
    console.log("Essential DOM elements found.");

    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Loading data...</td></tr>';
    matchesContainer.innerHTML = '<p style="text-align: center;">Loading matches...</p>';


    loadSelections(); // Load saved user choices first
    await loadRemainingMatches(); // Fetch or use fallback matches
    await loadHiddenMatches(); // Fetch hidden match list

    if (remainingMatchesData.length === 0 && staticRemainingMatchesData.length === 0) {
         console.error("Initialization Error: No match data available (fetch failed and no fallback).");
         tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: red;">Error: Could not load match data.</td></tr>';
         matchesContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading match data.</p>';
         return;
    }

    console.log(`Using ${remainingMatchesData.length} matches for simulation.`);

    estimateInitialStats(initialPointsData); // Estimate initial NRR stats *once*
    runWinProbabilitySimulations(); // Calculate initial win probs *once*
    setupEventListeners(); // Setup button/click handlers

    renderMatches(); // Render match cards (applies loaded selections)
    updateTableFromSelections(); // Calculate initial table state based on data + selections
    applyMatchFilter(); // Apply filter state on load

    console.log("IPL Points Table Simulator Initialized Successfully.");
}

// Start the application initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);