// Initial Data (Points Table Snapshot)
const rawPointsData = {
  "updated": "2025-04-26",
  "points_table": [
    {
      "position": 1,
      "team": "Gujarat Titans",
      "matches_played": 8,
      "wins": 6,
      "losses": 2,
      "ties": 0,
      "no_results": 0,
      "points": 12,
      "net_run_rate": 1.104
    },
    {
      "position": 2,
      "team": "Delhi Capitals",
      "matches_played": 8,
      "wins": 6,
      "losses": 2,
      "ties": 0,
      "no_results": 0,
      "points": 12,
      "net_run_rate": 0.657
    },
    {
      "position": 3,
      "team": "Royal Challengers Bengaluru",
      "matches_played": 9,
      "wins": 6,
      "losses": 3,
      "ties": 0,
      "no_results": 0,
      "points": 12,
      "net_run_rate": 0.482
    },
    {
      "position": 4,
      "team": "Mumbai Indians",
      "matches_played": 9,
      "wins": 5,
      "losses": 4,
      "ties": 0,
      "no_results": 0,
      "points": 10,
      "net_run_rate": 0.673
    },
    {
      "position": 5,
      "team": "Punjab Kings",
      "matches_played": 9,
      "wins": 5,
      "losses": 3,
      "ties": 0,
      "no_results": 1,
      "points": 11,
      "net_run_rate": 0.177
    },
    {
      "position": 6,
      "team": "Lucknow Super Giants",
      "matches_played": 9,
      "wins": 5,
      "losses": 4,
      "ties": 0,
      "no_results": 0,
      "points": 10,
      "net_run_rate": -0.054
    },
    {
      "position": 7,
      "team": "Kolkata Knight Riders",
      "matches_played": 9,
      "wins": 3,
      "losses": 5,
      "ties": 0,
      "no_results": 1,
      "points": 7,
      "net_run_rate": 0.212
    },
    {
      "position": 8,
      "team": "Sunrisers Hyderabad",
      "matches_played": 9,
      "wins": 3,
      "losses": 6,
      "ties": 0,
      "no_results": 0,
      "points": 6,
      "net_run_rate": -1.103
    },
    {
      "position": 9,
      "team": "Rajasthan Royals",
      "matches_played": 9,
      "wins": 2,
      "losses": 7,
      "ties": 0,
      "no_results": 0,
      "points": 4,
      "net_run_rate": -0.625
    },
    {
      "position": 10,
      "team": "Chennai Super Kings",
      "matches_played": 9,
      "wins": 2,
      "losses": 7,
      "ties": 0,
      "no_results": 0,
      "points": 4,
      "net_run_rate": -1.392
    }
  ]
};

const initialPointsData = rawPointsData.points_table.map(item => ({
  position: item.position,
  team: item.team,
  played: item.matches_played,
  won: item.wins,
  lost: item.losses,
  no_result: item.no_results,
  points: item.points,
  net_run_rate: item.net_run_rate
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
let hiddenMatchNumbers = []; // To store numbers from hidden_matches.json

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
// Accepts the base data (usually initialPointsData) and the current manual selections
// Respects manual selections and randomizes the rest
// Returns an object mapping team names to qualification probabilities
function simulateQualification(baseData, currentSelections, trials = 20000) {
    // Ensure baseData is an array before proceeding
    if (!Array.isArray(baseData)) {
        console.error("Error in simulateQualification: baseData is not an array. Received:", baseData);
        // Return empty probabilities object to avoid crashing further down
        return {};
    }

    // Initialize counters for qualification outcomes
    const counts = {};
    const top2Counts = {}; // For direct qualifier counts (top 2)
    const playoffCounts = {}; // For playoff qualifiers (3rd and 4th)
    
    // Initialize all counters
    baseData.forEach(team => {
        counts[team.team] = 0;
        top2Counts[team.team] = 0;
        playoffCounts[team.team] = 0;
    });

    // Filter remaining matches to only include those not yet played according to baseData
    const matchesToSimulate = remainingMatchesData.filter(match => {
        const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
        const t1Base = baseData.find(t => t.team === t1Name);
        const t2Base = baseData.find(t => t.team === t2Name);
        return t1Base && t2Base; 
    });

    // Calculate current form factors for more realistic simulation
    const formFactors = {};
    baseData.forEach(team => {
        // Calculate win percentage as a form factor (min 30% chance)
        const winPct = team.played > 0 ? team.won / team.played : 0.5;
        // Blend win percentage (70% weight) with 50% baseline (30% weight) to avoid extremes
        formFactors[team.team] = 0.3 + (0.7 * winPct);
    });
    
    // Run the Monte Carlo simulation
    for (let i = 0; i < trials; i++) {
        // Deep copy initial state for this trial
        const simData = JSON.parse(JSON.stringify(baseData));
        
        // Track NRR components for each team
        const nrrComponents = {};
        simData.forEach(team => {
            // Estimate initial runs scored/conceded based on current NRR
            const estimate = estimateInitialStatsForNRR(team);
            nrrComponents[team.team] = {
                runsScored: estimate.runsScored,
                runsConceded: estimate.runsConceded,
                oversPlayed: estimate.oversPlayed,
                oversBowled: estimate.oversBowled
            };
        });

        // Simulate each remaining match
        matchesToSimulate.forEach(match => {
            const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
            const t1 = simData.find(t => t.team === t1Name);
            const t2 = simData.find(t => t.team === t2Name);
            if (!t1 || !t2) return;

            const selection = currentSelections[match.match_number];
            let winner = null;
            let isNoResult = false;
            let nrrImpact = null;

            // Check if this match has a manual selection
            if (selection && selection.winner) {
                if (selection.winner === 'NO_RESULT') {
                    isNoResult = true;
                } else {
                    winner = selection.winner;
                    // If we have score details, use them for NRR calculation
                    if (selection.scores) {
                        nrrImpact = calculateNRRImpactFromScores(selection.scores, t1Name, t2Name);
                    }
                }
            } else {
                // No manual selection, use weighted randomization based on form
                const t1Strength = formFactors[t1Name];
                const t2Strength = formFactors[t2Name];
                const totalStrength = t1Strength + t2Strength;
                const t1WinProb = t1Strength / totalStrength * 0.95; // 95% of probability mass to wins
                
                const rand = Math.random();
                if (rand < 0.05) { // 5% chance of No Result
                    isNoResult = true;
                } else if (rand < (0.05 + t1WinProb)) {
                    winner = t1Name;
                    // Generate random score for NRR impact (winner usually has positive NRR)
                    nrrImpact = generateRandomNRRImpact(true);
                } else {
                    winner = t2Name;
                    // Generate random score for NRR impact (loser)
                    nrrImpact = generateRandomNRRImpact(false);
                }
            }

            // Apply the result to standings and NRR components
            if (t1.played < 14) {
                t1.played++;
            }
            if (t2.played < 14) {
                t2.played++;
            }
            if (isNoResult) {
                t1.no_result++; t1.points++;
                t2.no_result++; t2.points++;
            } else if (winner === t1Name) {
                t1.won++; t1.points += 2;
                t2.lost++;
                
                // Apply NRR impact if available
                if (nrrImpact) {
                    updateNRRComponents(nrrComponents, t1Name, t2Name, nrrImpact);
                }
            } else if (winner === t2Name) {
                t2.won++; t2.points += 2;
                t1.lost++;
                
                // Apply NRR impact if available
                if (nrrImpact) {
                    updateNRRComponents(nrrComponents, t2Name, t1Name, nrrImpact);
                }
            }
        });
        
        // Calculate final NRR for all teams
        simData.forEach(team => {
            const comp = nrrComponents[team.team];
            if (comp.oversPlayed > 0 && comp.oversBowled > 0) {
                team.net_run_rate = ((comp.runsScored / comp.oversPlayed) - (comp.runsConceded / comp.oversBowled)).toFixed(3);
                team.net_run_rate = parseFloat(team.net_run_rate); // Convert back to number
            }
        });

        // Sort by points, NRR, wins, then name (official IPL tiebreakers)
        simData.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.net_run_rate !== a.net_run_rate) return b.net_run_rate - a.net_run_rate;
            if (b.won !== a.won) return b.won - a.won;
            return a.team.localeCompare(b.team);
        });

        // Count top 4 - standard qualification
        simData.slice(0, 4).forEach(t => counts[t.team]++);
        
        // Count top 2 - direct qualifiers
        simData.slice(0, 2).forEach(t => top2Counts[t.team]++);
        
        // Count positions 3-4 - playoff qualification
        simData.slice(2, 4).forEach(t => playoffCounts[t.team]++);
    }

    // Calculate probabilities with additional details
    const probabilities = {};
    baseData.forEach(team => {
        probabilities[team.team] = {
            qualify: counts[team.team] / trials, // Overall qualification (top 4)
            directQualify: top2Counts[team.team] / trials, // Top 2 finish
            playoffQualify: playoffCounts[team.team] / trials // 3rd/4th finish
        };
    });

    return probabilities;
}

// Helper functions for the improved qualification simulation

// Estimate initial runs/overs for NRR calculation based on existing NRR
function estimateInitialStatsForNRR(team) {
    const nrr = team.net_run_rate || 0;
    const played = team.played || 0;
    
    // Create reasonable baseline numbers that would result in the given NRR
    let runsScored, runsConceded, oversPlayed, oversBowled;
    
    if (played === 0) {
        // If no matches played, use neutral baseline
        runsScored = 0;
        runsConceded = 0;
        oversPlayed = 0.1; // Small non-zero value to avoid division by zero
        oversBowled = 0.1;
    } else {
        // Scale these values based on matches played for more realistic numbers
        const baseOvers = played * 20; // 20 overs per match
        oversPlayed = baseOvers;
        oversBowled = baseOvers;
        
        // Base run rate around 8 runs per over (typical T20 rate)
        const baseRunRate = 8;
        runsScored = baseOvers * (baseRunRate + (nrr / 2));
        runsConceded = baseOvers * (baseRunRate - (nrr / 2));
    }
    
    return { runsScored, runsConceded, oversPlayed, oversBowled };
}

// Generate random NRR impact for a simulated match
function generateRandomNRRImpact(isWinner) {
    // Generate more realistic score ranges for T20 cricket
    const winningScore = Math.floor(140 + Math.random() * 60); // 140-200 range
    
    // Margin of victory varies based on winner/loser
    let margin;
    if (isWinner) {
        // Winners usually have positive NRR impact
        margin = Math.floor(10 + Math.random() * 50); // 10-60 run margin
    } else {
        // Less extreme for losses
        margin = Math.floor(5 + Math.random() * 25); // 5-30 run margin
    }
    
    const losingScore = winningScore - margin;
    
    // For simplicity, assume full 20 overs for both teams
    return {
        winnerRuns: winningScore,
        loserRuns: losingScore,
        winnerOvers: 20,
        loserOvers: 20
    };
}

// Calculate NRR impact from explicit match scores
function calculateNRRImpactFromScores(scores, team1, team2) {
    // This is a simplified version - would need actual score details
    // from the selection.scores object
    if (!scores || !scores[team1] || !scores[team2]) {
        return null;
    }
    
    // This implementation depends on the structure of your scores object
    // For now, return a placeholder
    return {
        winnerRuns: 160,
        loserRuns: 140,
        winnerOvers: 20,
        loserOvers: 20
    };
}

// Update NRR components based on match results
function updateNRRComponents(nrrComponents, winnerName, loserName, nrrImpact) {
    // Update winner's components
    nrrComponents[winnerName].runsScored += nrrImpact.winnerRuns;
    nrrComponents[winnerName].runsConceded += nrrImpact.loserRuns;
    nrrComponents[winnerName].oversPlayed += nrrImpact.winnerOvers;
    nrrComponents[winnerName].oversBowled += nrrImpact.loserOvers;
    
    // Update loser's components
    nrrComponents[loserName].runsScored += nrrImpact.loserRuns;
    nrrComponents[loserName].runsConceded += nrrImpact.winnerRuns;
    nrrComponents[loserName].oversPlayed += nrrImpact.loserOvers;
    nrrComponents[loserName].oversBowled += nrrImpact.winnerOvers;
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

async function loadHiddenMatches() {
    try {
        // Add a timestamp query parameter to prevent caching
        const cacheBuster = '?t=' + Date.now();
        const response = await fetch(encodeURI('hidden_matches.json' + cacheBuster));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        hiddenMatchNumbers = await response.json();
        // Convert any string values to numbers for reliable comparison
        hiddenMatchNumbers = hiddenMatchNumbers.map(n => Number(n));
        console.log("Hidden matches loaded:", hiddenMatchNumbers); // Log loaded data
    } catch (error) {
        console.warn("Could not load hidden matches via fetch:", error);
        hiddenMatchNumbers = []; // Default to empty if fetch fails
    }
}

// --- Monte Carlo Simulation for Win Probability ---

// Global object to store simulation results
window.matchWinProbs = undefined;

function runMonteCarloSimulations() {
    console.log("Running Monte Carlo simulations for match probabilities...");
    matchWinProbs = {};
    const simulations = 10000; // High number of simulations for statistical robustness

    // Create a map of team metrics for quick lookup
    const teamMetrics = {};
    initialPointsData.forEach(team => {
        teamMetrics[team.team] = {
            points: team.points,
            nrr: team.net_run_rate,
            position: team.position,
            winRatio: team.won / (team.played || 1), // Avoid division by zero
        };
    });

    // Calculate team strength score - higher is better
    const calculateTeamStrength = (teamName) => {
        const metrics = teamMetrics[teamName];
        if (!metrics) {
            console.warn(`No metrics found for team: ${teamName}`);
            return 1; // Default neutral strength
        }

        // Weights for different factors (can be adjusted)
        const pointsWeight = 1.5;    // Points are most important
        const nrrWeight = 1.0;       // NRR is important
        const positionWeight = 0.7;  // Position has some influence
        const winRatioWeight = 1.2;  // Win ratio is significant

        // Points factor (higher is better)
        const pointsFactor = metrics.points / 10; // Normalize to ~0-2 range typically

        // NRR factor (transform to 0-2 range where higher NRR = higher value)
        // Most NRRs are between -2 and +2
        const nrrFactor = (metrics.nrr + 2) / 4; 

        // Position factor (invert so lower position = higher value)
        // 10 teams, so normalize to 0-1 range
        const positionFactor = (11 - metrics.position) / 10;

        // Win ratio factor (0-1 range)
        const winRatioFactor = metrics.winRatio;

        // Calculate weighted score
        return (
            pointsFactor * pointsWeight +
            nrrFactor * nrrWeight +
            positionFactor * positionWeight +
            winRatioFactor * winRatioWeight
        );
    };

    // Simulate each match
    remainingMatchesData.forEach(match => {
        const teamsArray = match.teams.split(' vs ');
        const team1FullName = teamsArray[0].trim();
        const team2FullName = teamsArray[1].trim();

        // Get team strengths
        const team1Strength = calculateTeamStrength(team1FullName);
        const team2Strength = calculateTeamStrength(team2FullName);

        // Calculate win probability based on relative team strengths
        const totalStrength = team1Strength + team2Strength;
        const team1WinProb = team1Strength / totalStrength;

        let team1Wins = 0;
        let team2Wins = 0;

        // Run the simulations
        for (let i = 0; i < simulations; i++) {
            // Use the calculated probability instead of 50/50
            if (Math.random() < team1WinProb) {
                team1Wins++;
            } else {
                team2Wins++;
            }
        }

        const totalSims = team1Wins + team2Wins;
        console.log(`Match: ${team1FullName} vs ${team2FullName}`);
        console.log(`  Strengths: ${team1FullName}=${team1Strength.toFixed(2)}, ${team2FullName}=${team2Strength.toFixed(2)}`);
        console.log(`  Win probability: ${team1FullName}=${(team1WinProb*100).toFixed(1)}%, ${team2FullName}=${((1-team1WinProb)*100).toFixed(1)}%`);
        console.log(`  Simulation results: ${team1FullName}=${team1Wins}, ${team2FullName}=${team2Wins}`);

        matchWinProbs[match.match_number] = {
            [team1FullName]: {
                count: team1Wins,
                prob: totalSims > 0 ? parseFloat(((team1Wins / totalSims) * 100).toFixed(1)) : 50
            },
            [team2FullName]: {
                count: team2Wins,
                prob: totalSims > 0 ? parseFloat(((team2Wins / totalSims) * 100).toFixed(1)) : 50
            },
            total: totalSims
        };
    });

    console.log("Monte Carlo simulations complete:", matchWinProbs);
}

// --- Rendering Functions ---

function renderTable(data) {
  tableBody.innerHTML = ''; // Clear existing rows

  data.forEach(team => {
      const row = tableBody.insertRow();
      row.dataset.team = team.team; // Store full team name for filtering

      const colors = teamColorMap[team.team];
      if (colors) {
          // More vibrant team colors with gradient effect
          const bgColor = hexToRgba(colors.bg, 0.25);
          const bgColorLight = hexToRgba(colors.bg, 0.1);
          row.style.background = `linear-gradient(to right, ${bgColor}, ${bgColorLight})`;
          // Add subtle border on the left side
          row.style.borderLeft = `4px solid ${colors.bg}`;
          // Special styling for playoff spots (top 4)
          if (team.position <= 4) {
              row.style.borderLeft = `4px solid ${colors.bg}`;
              // Add custom attribute for potential CSS styling
              row.dataset.playoff = "true";
              // Add subtle top/bottom borders for separation
              row.style.borderTop = `1px solid ${hexToRgba(colors.bg, 0.3)}`;
              row.style.borderBottom = `1px solid ${hexToRgba(colors.bg, 0.3)}`;
              // Slightly bolder text for playoff teams
              row.style.fontWeight = "500";
          }
      }

      // Highlight the row if it's the currently selected filter team
      if (team.team === selectedFilterTeam) {
          row.classList.add('selected-row');
          // Make the selected team more prominent
          row.style.boxShadow = `0 0 8px ${hexToRgba(colors?.bg || '#333', 0.5)}`;
          row.style.transform = "scale(1.01)";
          row.style.zIndex = "1";
      }

      const shortTeamName = teamNameMap[team.team] || team.team;
      // Use the calculated NRR for display, with 3 decimal formatting 
      const displayNRR = typeof team.net_run_rate === 'number' ? team.net_run_rate.toFixed(3) : 'N/A';
      
      row.insertCell().textContent = team.position;
      row.insertCell().textContent = shortTeamName;
      row.insertCell().textContent = team.played;
      row.insertCell().textContent = team.won;
      row.insertCell().textContent = team.lost;
      row.insertCell().textContent = team.no_result;
      row.insertCell().textContent = team.points;
      row.insertCell().textContent = displayNRR;
      
      // Create qual percentage cell with tooltip showing detailed breakdown
      const qualCell = row.insertCell();
      
      if (team.qualData && team.qualData.qualify > 0) {
          const qualPct = (team.qualData.qualify * 100).toFixed(1);
          qualCell.textContent = `${qualPct}%`;
          
          // Set cell color based on qualification percentage
          if (team.qualData.qualify >= 0.95) {
              qualCell.style.color = '#00b300'; // Bright green for near-certain
              qualCell.style.fontWeight = 'bold';
          } else if (team.qualData.qualify >= 0.75) {
              qualCell.style.color = '#5cb85c'; // Medium green for likely
          } else if (team.qualData.qualify >= 0.5) {
              qualCell.style.color = '#f0ad4e'; // Orange for toss-up
          } else if (team.qualData.qualify >= 0.25) {
              qualCell.style.color = '#d9534f'; // Light red for unlikely
          } else {
              qualCell.style.color = '#cc0000'; // Dark red for very unlikely
          }
          
          // Add tooltip with detailed breakdown
          qualCell.title = `Overall: ${qualPct}%\nTop 2: ${(team.qualData.directQualify*100).toFixed(1)}%\nPlayoffs (3-4): ${(team.qualData.playoffQualify*100).toFixed(1)}%`;
          qualCell.classList.add('tooltip-cell');
      } else {
          qualCell.textContent = '—';
          qualCell.style.color = '#999';
      }
  });
}

function renderMatches() {
  matchesContainer.innerHTML = ''; // Clear existing matches

  // Ensure simulation results are available
  if (!window.matchWinProbs) {
    runMonteCarloSimulations();
  }

  remainingMatchesData.forEach(match => {
      if (hiddenMatchNumbers.includes(Number(match.match_number))) return;

      const teamsArray = match.teams.split(' vs ');
      const team1FullName = teamsArray[0].trim();
      const team2FullName = teamsArray[1].trim();
      const team1ShortName = teamNameMap[team1FullName] || team1FullName;
      const team2ShortName = teamNameMap[team2FullName] || team2FullName;

      // --- Monte Carlo Probabilities ---
      const simResult = matchWinProbs && matchWinProbs[match.match_number];
      const team1Prob = simResult ? simResult[team1FullName].prob : 50;
      const team2Prob = simResult ? simResult[team2FullName].prob : 50;
      const team1Count = simResult ? simResult[team1FullName].count : 0;
      const team2Count = simResult ? simResult[team2FullName].count : 0;
      const simTotal = simResult ? simResult.total : 0;
      const team1ColorObj = teamColorMap[team1FullName] || { bg: '#808080', text: '#fff' };
      const team2ColorObj = teamColorMap[team2FullName] || { bg: '#A9A9A9', text: '#fff' };
      const team1Color = team1ColorObj.bg;
      const team2Color = team2ColorObj.bg;

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

      // --- Probability Bar ---
      const probBarContainer = document.createElement('div');
      probBarContainer.classList.add('probability-bar-container');
      probBarContainer.title = `Win Probability: ${team1FullName} ${team1Prob}% (${team1Count}/${simTotal}) vs ${team2FullName} ${team2Prob}% (${team2Count}/${simTotal})`;

      const probTeam1 = document.createElement('div');
      probTeam1.classList.add('prob-segment', 'prob-team1');
      probTeam1.style.width = `${team1Prob}%`;
      probTeam1.style.backgroundColor = team1Color;
      probTeam1.textContent = `${team1Prob}%`;

      const probTeam2 = document.createElement('div');
      probTeam2.classList.add('prob-segment', 'prob-team2');
      probTeam2.style.width = `${team2Prob}%`;
      probTeam2.style.backgroundColor = team2Color;
      probTeam2.textContent = `${team2Prob}%`;

      probBarContainer.appendChild(probTeam1);
      probBarContainer.appendChild(probTeam2);

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
      matchCard.appendChild(probBarContainer);
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
              // Provide immediate visual feedback before processing
              button.style.backgroundColor = "#555";
              const currentMatchNumber = match.match_number;
              const resultType = button.dataset.resultType;
              const selectedTeamName = resultType === 'WIN' ? button.dataset.teamName : 'NO_RESULT';

              // Logic: If clicking the currently selected option, deselect. Otherwise, select the new one.
              const isCurrentlySelected = matchSelections[currentMatchNumber]?.winner === selectedTeamName;

              // --- Reset UI state for this card ---
              matchCard.classList.remove('no-result-selected');
              [team1Button, team2Button].forEach(btn => {
                  btn.classList.remove('selected');
                  resetButtonColors(btn);
              });
              scoreInputsDiv.classList.remove('disabled');
              scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = false);
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
                      scoreInputsDiv.classList.add('disabled');
                      scoreInputsDiv.querySelectorAll('input').forEach(input => {
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
                      scoreInputsDiv.classList.remove('disabled');
                      scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = false);
                  }
              }

              closeAllDropdowns(); // Close dropdown after selection
              // Defer heavy operations with setTimeout(0)
              setTimeout(() => {
                  saveSelections();
                  updateTableFromSelections();
              }, 0);
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

  // Fallback: ensure any hidden matches are removed
  hiddenMatchNumbers.forEach(num => {
      const selector = `.match-card[data-match-number="${num}"]`;
      const card = matchesContainer.querySelector(selector);
      if (card) card.remove();
  });
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

  // If there are no user selections, restore NRRs exactly from rawPointsData
  if (!matchSelections || Object.keys(matchSelections).length === 0) {
    // Use the original NRR from rawPointsData for display
    updatedPointsData.forEach((team, idx) => {
      if (rawPointsData.points_table[idx] && rawPointsData.points_table[idx].team === team.team) {
        team.net_run_rate = rawPointsData.points_table[idx].net_run_rate;
      }
    });
  }

  // Reset calculated stats back to estimated initial values before applying selections
  updatedPointsData.forEach(team => {
      team.played = team.played; // Keep original played
      team.won = team.won;
      team.lost = team.lost;
      team.no_result = team.no_result;
      team.points = team.points;

      // Use the estimated initial runs/overs as the starting point for this calculation cycle
      team.runsFor = team.initialRunsFor || 0;
      team.oversFacedDecimal = team.initialOversFacedDecimal || 0;
      team.runsAgainst = team.initialRunsAgainst || 0;
      team.oversBowledDecimal = team.initialOversBowledDecimal || 0;
  }); // End reset

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
      if (team1Data.played < 14) {
          team1Data.played += 1;
      }
      if (team2Data.played < 14) {
          team2Data.played += 1;
      }

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

      if (isNaN(team.net_run_rate)) {
          team.net_run_rate = 0; // Default to 0 if calculation results in NaN
      }
  });

  // --- Sort the table data ---
  updatedPointsData.sort((a, b) => {
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
  updatedPointsData.forEach((team, index) => {
      team.position = index + 1;
  });

  // --- Calculate qualification probabilities ---
  // Check if all teams have played all 14 matches
  const allMatchesComplete = updatedPointsData.every(team => team.played >= 14);
  
  if (allMatchesComplete) {
    // If all matches are complete, top 4 have 100% qualification, others 0%
    updatedPointsData.forEach(team => {
      // Set detailed qualification data for teams
      if (team.position <= 2) {
        // Top 2 teams (direct qualifiers)
        team.qualData = {
          qualify: 1.0,
          directQualify: 1.0,
          playoffQualify: 0.0
        };
      } else if (team.position <= 4) {
        // Teams in positions 3-4 (playoff qualifiers)
        team.qualData = {
          qualify: 1.0,
          directQualify: 0.0,
          playoffQualify: 1.0
        };
      } else {
        // Teams that didn't qualify
        team.qualData = {
          qualify: 0.0,
          directQualify: 0.0,
          playoffQualify: 0.0
        };
      }
    });
  } else {
    // Not all matches complete, run simulations with more trials for better accuracy
    const qualProbs = simulateQualification(initialPointsData, matchSelections, 10000);
    
    // Add detailed qualification data to each team
    updatedPointsData.forEach(team => {
      if (qualProbs[team.team]) {
        team.qualData = qualProbs[team.team];
      } else {
        // Default values if no probability data available
        team.qualData = {
          qualify: 0,
          directQualify: 0,
          playoffQualify: 0
        };
      }
    });
  }

  // --- Render the updated table ---
  renderTable(updatedPointsData);
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
    // Provide immediate visual feedback
    resetButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    setTimeout(() => resetButton.style.backgroundColor = "", 100);
    
    matchSelections = {};
    selectedFilterTeam = null; // Reset filter state
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Render first for immediate feedback
    if (remainingMatchesData.length > 0) {
      renderMatches();
    } else {
      matchesContainer.innerHTML = '';
    }
    
    // Handle storage and updates in the background
    setTimeout(() => {
      updateTableFromSelections();
      applyMatchFilter();
      closeAllDropdowns();
    }, 0);
}

function handleRandomizeClick() {
    // Provide immediate visual feedback
    const randomizeBtn = document.getElementById('randomizeBtn');
    if (randomizeBtn) {
      randomizeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      setTimeout(() => randomizeBtn.style.backgroundColor = "", 100);
    }
    
    if (!Array.isArray(remainingMatchesData)) return;
    
    // Check if a user has selected a favorite team
    const teamSelect = document.getElementById('teamSelect');
    const favoriteTeam = teamSelect ? teamSelect.value : null;
    const simResultDiv = document.getElementById('simResult');
    
    // Clear matchSelections first for immediate UI reset
    matchSelections = {};
    renderMatches();
    
    // Generate random results in the background
    setTimeout(() => {
      if (favoriteTeam) {
        // Create a copy of initial data to work with
        const tempData = JSON.parse(JSON.stringify(initialPointsData));
        
        remainingMatchesData.forEach(match => {
          if (hiddenMatchNumbers.includes(Number(match.match_number))) return;
          
          const matchNumber = match.match_number;
          const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
          
          // If match involves favorite team, make them win
          if (t1Name === favoriteTeam || t2Name === favoriteTeam) {
            // Team selection (favorite team wins)
            const winner = (t1Name === favoriteTeam) ? t1Name : t2Name;
            
            // Generate results with favorable outcome
            let result;
            if (t1Name === favoriteTeam) {
              result = {
                winner: t1Name,
                scores: {
                  team1: { r: 180, oStr: "20", oDec: 20 },
                  team2: { r: 160, oStr: "20", oDec: 20 }
                }
              };
            } else {
              result = {
                winner: t2Name,
                scores: {
                  team1: { r: 160, oStr: "20", oDec: 20 },
                  team2: { r: 180, oStr: "20", oDec: 20 }
                }
              };
            }
            
            matchSelections[matchNumber] = { 
              winner: result.winner, 
              scores: result.scores 
            };
            
            // Update temp data to track standings
            const team1 = tempData.find(t => t.team === t1Name);
            const team2 = tempData.find(t => t.team === t2Name);
            
            if (team1 && team2) {
              team1.played++;
              team2.played++;
              
              if (result.winner === t1Name) {
                team1.won++;
                team2.lost++;
                team1.points += 2;
              } else {
                team2.won++;
                team1.lost++;
                team2.points += 2;
              }
            }
          } else {
            // For matches not involving favorite team
            // Check if either team is ahead of favorite team
            const favoriteTeamData = tempData.find(t => t.team === favoriteTeam);
            const team1Data = tempData.find(t => t.team === t1Name);
            const team2Data = tempData.find(t => t.team === t2Name);
            
            if (favoriteTeamData && team1Data && team2Data) {
              // If both teams have more points than favorite team, make one lose
              if (team1Data.points > favoriteTeamData.points && 
                  team2Data.points > favoriteTeamData.points) {
                // Choose the team with more points to lose
                const winner = team1Data.points > team2Data.points ? t2Name : t1Name;
                
                const result = {
                  winner: winner,
                  scores: winner === t1Name ? 
                    { team1: { r: 180, oStr: "20", oDec: 20 }, team2: { r: 160, oStr: "20", oDec: 20 } } :
                    { team1: { r: 160, oStr: "20", oDec: 20 }, team2: { r: 180, oStr: "20", oDec: 20 } }
                };
                
                matchSelections[matchNumber] = { 
                  winner: result.winner, 
                  scores: result.scores 
                };
                
                // Update data
                team1Data.played++;
                team2Data.played++;
                
                if (result.winner === t1Name) {
                  team1Data.won++;
                  team2Data.lost++;
                  team1Data.points += 2;
                } else {
                  team2Data.won++;
                  team1Data.lost++;
                  team2Data.points += 2;
                }
              } else {
                // Normal randomization for other matches
                const result = generateRandomMatchResult(t1Name, t2Name);
                matchSelections[matchNumber] = { 
                  winner: result.winner, 
                  scores: result.scores 
                };
                
                // Update data
                team1Data.played++;
                team2Data.played++;
                
                if (result.winner === t1Name) {
                  team1Data.won++;
                  team2Data.lost++;
                  team1Data.points += 2;
                } else if (result.winner === t2Name) {
                  team2Data.won++;
                  team1Data.lost++;
                  team2Data.points += 2;
                } else if (result.winner === 'NO_RESULT') {
                  team1Data.no_result++;
                  team2Data.no_result++;
                  team1Data.points++;
                  team2Data.points++;
                }
              }
            } else {
              // Fallback to normal randomization
              const result = generateRandomMatchResult(t1Name, t2Name);
              matchSelections[matchNumber] = { 
                winner: result.winner, 
                scores: result.scores 
              };
            }
          }
        });
        
        // Check if the favorite team is in top 4
        tempData.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.net_run_rate !== a.net_run_rate) return b.net_run_rate - a.net_run_rate;
          return 0;
        });
        
        const favoriteRank = tempData.findIndex(t => t.team === favoriteTeam) + 1;
        
        if (favoriteRank <= 4) {
          if (simResultDiv) {
            simResultDiv.innerHTML = `<span style="color: #4db6ac;">Successfully placed ${favoriteTeam} in the top 4 (position #${favoriteRank})!</span>`;
          }
        } else {
          if (simResultDiv) {
            simResultDiv.innerHTML = `<span style="color: #ff6b6b;">Sorry, couldn't get ${favoriteTeam} into top 4. Best position: #${favoriteRank}</span>`;
          }
        }
      } else {
        // No favorite team, just randomize normally
        remainingMatchesData.forEach(match => {
          if (hiddenMatchNumbers.includes(Number(match.match_number))) return;
          
          const matchNumber = match.match_number;
          const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
          
          const result = generateRandomMatchResult(t1Name, t2Name);
          matchSelections[matchNumber] = { 
            winner: result.winner, 
            scores: result.scores 
          };
        });
      }
      
      saveSelections();
      renderMatches();
      updateTableFromSelections();
      applyMatchFilter();
    }, 0);
}

// --- Helper Function to convert decimal overs to string format ---
function decimalOversToString(decimalOvers) {
    if (decimalOvers === null || isNaN(decimalOvers)) return '';
    const fullOvers = Math.floor(decimalOvers);
    const balls = Math.round((decimalOvers - fullOvers) * 6);
    if (balls === 0 || balls === 6) { // Handle full overs or rounding edge cases
        return `${fullOvers + (balls === 6 ? 1 : 0)}`;
    }
    return `${fullOvers}.${balls}`;
}

// --- Helper Function to generate a random match result including scores ---
function generateRandomMatchResult(team1Name, team2Name) {
    const NO_RESULT_CHANCE = 0.03; // 3% chance of no result
    if (Math.random() < NO_RESULT_CHANCE) {
        return { winner: 'NO_RESULT', scores: { team1: {}, team2: {} } };
    }

    // Simulate Team 1 (Batting First)
    const t1Runs = Math.floor(Math.random() * (240 - 120 + 1)) + 120; // Score between 120-240
    const t1OversDecimal = 20.0;
    const t1OversString = decimalOversToString(t1OversDecimal);

    // Simulate Team 2 (Chasing)
    const target = t1Runs + 1;
    let t2Runs, t2OversDecimal;
    const CHASE_SUCCESS_CHANCE = 0.5;

    if (Math.random() < CHASE_SUCCESS_CHANCE) {
        // Chase Success
        t2Runs = target + Math.floor(Math.random() * 20); // Win by 1-20 runs for more NRR impact
        // Simulate overs taken: less likely to be full 20
        const oversRand = Math.random();
        if (oversRand < 0.6) { // 60% chance: 15.0 - 19.5 overs
            t2OversDecimal = Math.floor(Math.random() * (19 - 15 + 1) + 15) + (Math.floor(Math.random() * 6) / 6);
        } else { // 40% chance: 20 overs (or close like 19.x)
            t2OversDecimal = 19 + (Math.floor(Math.random() * 6) / 6); // 19.0 to 19.5
            if (t2OversDecimal < 19) t2OversDecimal = 19.0; // Ensure at least 19
            if (Math.random() < 0.5) t2OversDecimal = 20.0; // Make 20.0 common
        }
         t2OversDecimal = Math.min(20.0, Math.max(15.0, parseFloat(t2OversDecimal.toFixed(1)))); // Clamp & format

    } else {
        // Chase Failure
        // More variation for bigger NRR differences
        t2Runs = Math.floor(Math.random() * (target - 1 - Math.max(60, target - 100) + 1)) + Math.max(60, target - 100);
        t2Runs = Math.max(0, t2Runs); // Ensure non-negative
        // Simulate overs: often 20, sometimes bowled out earlier
        const oversRand = Math.random();
         if (oversRand < 0.6) { // 60% chance: 20 overs
             t2OversDecimal = 20.0;
         } else { // 40% chance: 16.0 - 19.5 overs
             t2OversDecimal = Math.floor(Math.random() * (19 - 16 + 1) + 16) + (Math.floor(Math.random() * 6) / 6);
             t2OversDecimal = Math.min(19.5, Math.max(16.0, parseFloat(t2OversDecimal.toFixed(1)))); // Clamp & format
         }
    }

    const t2OversString = decimalOversToString(t2OversDecimal);

    const winner = (t2Runs > t1Runs) ? team2Name : team1Name;

    return {
        winner,
        scores: {
            team1: { r: t1Runs, oStr: t1OversString, oDec: t1OversDecimal },
            team2: { r: t2Runs, oStr: t2OversString, oDec: t2OversDecimal }
        }
    };
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
    const randomizeBtn = document.getElementById('randomizeBtn');
    if (randomizeBtn) randomizeBtn.addEventListener('click', handleRandomizeClick);

    // Load data and render
    loadSelections(); // Load selections from localStorage first
    console.log("Loading remaining matches...");
    await loadRemainingMatches(); // Load match data from JSON
    console.log(`Remaining matches data length: ${remainingMatchesData.length}`);
    await loadHiddenMatches(); // Load hidden matches data from JSON
    console.log(`Hidden matches data length: ${hiddenMatchNumbers.length}`);

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

// --- Team Support Simulation ---
const teamSelect = document.getElementById('teamSelect');
const runSimBtn = document.getElementById('runSimBtn');
const qualifySimBtn = document.getElementById('qualifySimBtn');
const simResultDiv = document.getElementById('simResult');

if (teamSelect && runSimBtn && simResultDiv && qualifySimBtn) {
    runSimBtn.addEventListener('click', () => {
        const selectedTeam = teamSelect.value;
        if (!selectedTeam) {
            simResultDiv.textContent = 'Please select a team.';
            return;
        }
        runSimBtn.disabled = true;
        simResultDiv.textContent = 'Running 10,000 simulations...';
        setTimeout(() => {
            const countFirst = simulateTeamFirstPercentage(selectedTeam, 10000);
            simResultDiv.innerHTML = `${selectedTeam} chance: ${countFirst}%`;
            runSimBtn.disabled = false;
        }, 50);
    });

    qualifySimBtn.addEventListener('click', () => {
        const selectedTeam = teamSelect.value;
        if (!selectedTeam) {
            simResultDiv.textContent = 'Please select a team.';
            return;
        }
        qualifySimBtn.disabled = true;
        const originalText = qualifySimBtn.innerHTML;
        qualifySimBtn.innerHTML = 'Simulating...';
        simResultDiv.textContent = 'Running 20,000 simulations...';

        setTimeout(() => {
            console.time('Qualification Simulation (Button)');
            // Run the Monte Carlo using the *new* function, respecting selections
            const qualProbs = simulateQualification(initialPointsData, matchSelections, 20000);
            console.timeEnd('Qualification Simulation (Button)');

            // Update the main table data with the new probabilities
            initialPointsData.forEach(team => {
                team.qualProbability = qualProbs[team.team] || 0;
            });
            // Also update the currently displayed table data immediately
            let currentTableData = JSON.parse(JSON.stringify(initialPointsData)); // Need a way to get current calculated state
            // *** This is tricky: We need to re-run the *deterministic* part of updateTableFromSelections
            //     to get the correct points/NRR *before* merging the new probabilities.
            // Let's just re-call updateTableFromSelections which will re-run the *fast* simulation anyway.
            // This isn't ideal as it runs the 5000 simulation again, but simplifies logic.
            // A better approach would be to have a function that just does the deterministic update.

            updateTableFromSelections(); // Re-run the whole update process

            // Update the specific team result display
            const teamObj = initialPointsData.find(t => t.team === selectedTeam);
            // Use the latest simulation result for this team from qualProbs
            let percent = '0.00';
            if (qualProbs && qualProbs[selectedTeam] && typeof qualProbs[selectedTeam].qualify === 'number') {
                percent = (qualProbs[selectedTeam].qualify * 100).toFixed(2);
            }
            qualifySimBtn.innerHTML = 'Playoffs Chances'; // Restore button text
            simResultDiv.innerHTML = `${selectedTeam} playoffs chance: ${percent}%`;
            qualifySimBtn.disabled = false;
        }, 50); // setTimeout allows UI to update
    });
    // Do not set initial text for qualifySimBtn, let HTML control the label.
}

function simulateTeamFirstPercentage(teamName, trials) {
    let firstCount = 0;
    let counts = {};
    initialPointsData.forEach(team => { counts[team.team] = 0; });
    for (let i = 0; i < trials; i++) {
        // Deep copy initial state
        const simData = JSON.parse(JSON.stringify(initialPointsData));
        // Simulate each remaining match randomly
        (remainingMatchesData || staticRemainingMatchesData).forEach(match => {
            const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
            const t1 = simData.find(t => t.team === t1Name);
            const t2 = simData.find(t => t.team === t2Name);
            if (!t1 || !t2) return;
            if (t1.played < 14) {
                t1.played++;
            }
            if (t2.played < 14) {
                t2.played++;
            }
            const rand = Math.random();
            if (rand < 0.05) { // 5% chance of No Result
                t1.no_result++; t1.points++;
                t2.no_result++; t2.points++;
            } else if (rand < 0.525) { // ~47.5% chance for team 1
                t1.won++; t1.points += 2;
                t2.lost++;
            } else { // ~47.5% chance for team 2
                t2.won++; t2.points += 2;
                t1.lost++;
            }
        });
        // Sort by points, NRR, wins, then name
        simData.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.net_run_rate !== a.net_run_rate) return b.net_run_rate - a.net_run_rate;
          return 0;
        });

        // Count first place
        if (simData[0].team === teamName) firstCount++;
        // Count top 4 for possible future use
        simData.slice(0, 4).forEach(t => counts[t.team]++);
    }
    // Return percentage for first place
    return ((firstCount / trials) * 100).toFixed(2);
}

function handleRandomizeClick() {
    // Provide immediate visual feedback
    const randomizeBtn = document.getElementById('randomizeBtn');
    if (randomizeBtn) {
      randomizeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      setTimeout(() => randomizeBtn.style.backgroundColor = "", 100);
    }
    
    if (!Array.isArray(remainingMatchesData)) return;
    
    // Check if a user has selected a favorite team
    const teamSelect = document.getElementById('teamSelect');
    const favoriteTeam = teamSelect ? teamSelect.value : null;
    const simResultDiv = document.getElementById('simResult');
    
    // Clear matchSelections first for immediate UI reset
    matchSelections = {};
    renderMatches();
    
    // Generate random results in the background
    setTimeout(() => {
      if (favoriteTeam) {
        // Create a copy of initial data to work with
        const tempData = JSON.parse(JSON.stringify(initialPointsData));
        
        remainingMatchesData.forEach(match => {
          if (hiddenMatchNumbers.includes(Number(match.match_number))) return;
          
          const matchNumber = match.match_number;
          const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
          
          // If match involves favorite team, make them win
          if (t1Name === favoriteTeam || t2Name === favoriteTeam) {
            // Team selection (favorite team wins)
            const winner = (t1Name === favoriteTeam) ? t1Name : t2Name;
            
            // Generate results with favorable outcome
            let result;
            if (t1Name === favoriteTeam) {
              result = {
                winner: t1Name,
                scores: {
                  team1: { r: 180, oStr: "20", oDec: 20 },
                  team2: { r: 160, oStr: "20", oDec: 20 }
                }
              };
            } else {
              result = {
                winner: t2Name,
                scores: {
                  team1: { r: 160, oStr: "20", oDec: 20 },
                  team2: { r: 180, oStr: "20", oDec: 20 }
                }
              };
            }
            
            matchSelections[matchNumber] = { 
              winner: result.winner, 
              scores: result.scores 
            };
            
            // Update temp data to track standings
            const team1 = tempData.find(t => t.team === t1Name);
            const team2 = tempData.find(t => t.team === t2Name);
            
            if (team1 && team2) {
              team1.played++;
              team2.played++;
              
              if (result.winner === t1Name) {
                team1.won++;
                team2.lost++;
                team1.points += 2;
              } else {
                team2.won++;
                team1.lost++;
                team2.points += 2;
              }
            }
          } else {
            // For matches not involving favorite team
            // Check if either team is ahead of favorite team
            const favoriteTeamData = tempData.find(t => t.team === favoriteTeam);
            const team1Data = tempData.find(t => t.team === t1Name);
            const team2Data = tempData.find(t => t.team === t2Name);
            
            if (favoriteTeamData && team1Data && team2Data) {
              // If both teams have more points than favorite team, make one lose
              if (team1Data.points > favoriteTeamData.points && 
                  team2Data.points > favoriteTeamData.points) {
                // Choose the team with more points to lose
                const winner = team1Data.points > team2Data.points ? t2Name : t1Name;
                
                const result = {
                  winner: winner,
                  scores: winner === t1Name ? 
                    { team1: { r: 180, oStr: "20", oDec: 20 }, team2: { r: 160, oStr: "20", oDec: 20 } } :
                    { team1: { r: 160, oStr: "20", oDec: 20 }, team2: { r: 180, oStr: "20", oDec: 20 } }
                };
                
                matchSelections[matchNumber] = { 
                  winner: result.winner, 
                  scores: result.scores 
                };
                
                // Update data
                team1Data.played++;
                team2Data.played++;
                
                if (result.winner === t1Name) {
                  team1Data.won++;
                  team2Data.lost++;
                  team1Data.points += 2;
                } else {
                  team2Data.won++;
                  team1Data.lost++;
                  team2Data.points += 2;
                }
              } else {
                // Normal randomization for other matches
                const result = generateRandomMatchResult(t1Name, t2Name);
                matchSelections[matchNumber] = { 
                  winner: result.winner, 
                  scores: result.scores 
                };
                
                // Update data
                team1Data.played++;
                team2Data.played++;
                
                if (result.winner === t1Name) {
                  team1Data.won++;
                  team2Data.lost++;
                  team1Data.points += 2;
                } else if (result.winner === t2Name) {
                  team2Data.won++;
                  team1Data.lost++;
                  team2Data.points += 2;
                } else if (result.winner === 'NO_RESULT') {
                  team1Data.no_result++;
                  team2Data.no_result++;
                  team1Data.points++;
                  team2Data.points++;
                }
              }
            } else {
              // Fallback to normal randomization
              const result = generateRandomMatchResult(t1Name, t2Name);
              matchSelections[matchNumber] = { 
                winner: result.winner, 
                scores: result.scores 
              };
            }
          }
        });
        
        // Check if the favorite team is in top 4
        tempData.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.net_run_rate !== a.net_run_rate) return b.net_run_rate - a.net_run_rate;
          return 0;
        });
        
        const favoriteRank = tempData.findIndex(t => t.team === favoriteTeam) + 1;
        
        if (favoriteRank <= 4) {
          if (simResultDiv) {
            simResultDiv.innerHTML = `<span style="color: #4db6ac;">Successfully placed ${favoriteTeam} in the top 4 (position #${favoriteRank})!</span>`;
          }
        } else {
          if (simResultDiv) {
            simResultDiv.innerHTML = `<span style="color: #ff6b6b;">Sorry, couldn't get ${favoriteTeam} into top 4. Best position: #${favoriteRank}</span>`;
          }
        }
      } else {
        // No favorite team, just randomize normally
        remainingMatchesData.forEach(match => {
          if (hiddenMatchNumbers.includes(Number(match.match_number))) return;
          
          const matchNumber = match.match_number;
          const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
          
          const result = generateRandomMatchResult(t1Name, t2Name);
          matchSelections[matchNumber] = { 
            winner: result.winner, 
            scores: result.scores 
          };
        });
      }
      
      saveSelections();
      renderMatches();
      updateTableFromSelections();
      applyMatchFilter();
    }, 0);
}
