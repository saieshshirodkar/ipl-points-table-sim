// Initial Data (Points Table Snapshot)
const rawPointsData = {
    "updated": "2025-05-08",
    "points_table": [
      { "position": 1, "team": "Gujarat Titans", "matches_played": 11, "wins": 8, "losses": 3, "ties": 0, "no_results": 0, "points": 16, "net_run_rate": 0.793 },
      { "position": 2, "team": "Royal Challengers Bengaluru", "matches_played": 11, "wins": 8, "losses": 3, "ties": 0, "no_results": 0, "points": 16, "net_run_rate": 0.482 },
      { "position": 3, "team": "Punjab Kings", "matches_played": 11, "wins": 7, "losses": 3, "ties": 0, "no_results": 1, "points": 15, "net_run_rate": 0.376 },
      { "position": 4, "team": "Mumbai Indians", "matches_played": 12, "wins": 7, "losses": 5, "ties": 0, "no_results": 0, "points": 14, "net_run_rate": 1.156 },
      { "position": 5, "team": "Delhi Capitals", "matches_played": 11, "wins": 6, "losses": 4, "ties": 0, "no_results": 1, "points": 13, "net_run_rate": 0.362 },
      { "position": 6, "team": "Kolkata Knight Riders", "matches_played": 12, "wins": 5, "losses": 6, "ties": 0, "no_results": 1, "points": 11, "net_run_rate": 0.193 },
      { "position": 7, "team": "Lucknow Super Giants", "matches_played": 11, "wins": 5, "losses": 6, "ties": 0, "no_results": 0, "points": 10, "net_run_rate": -0.469 },
      { "position": 8, "team": "Sunrisers Hyderabad", "matches_played": 11, "wins": 3, "losses": 7, "ties": 0, "no_results": 1, "points": 7, "net_run_rate": -1.192, "eliminated": true },
      { "position": 9, "team": "Rajasthan Royals", "matches_played": 12, "wins": 3, "losses": 9, "ties": 0, "no_results": 0, "points": 6, "net_run_rate": -0.718, "eliminated": true },
      { "position": 10, "team": "Chennai Super Kings", "matches_played": 12, "wins": 3, "losses": 9, "ties": 0, "no_results": 0, "points": 6, "net_run_rate": -0.992, "eliminated": true }
    ]
  };
  
  // Process raw data
  const initialPointsData = rawPointsData.points_table.map(item => ({
    position: item.position,
    team: item.team,
    played: item.matches_played,
    won: item.wins,
    lost: item.losses,
    no_result: item.no_results,
    points: item.points,
    net_run_rate: item.net_run_rate,
    eliminated: item.eliminated || false,
    initialRunsFor: 0, initialOversFacedDecimal: 0, initialRunsAgainst: 0, initialOversBowledDecimal: 0,
    original_nrr: item.net_run_rate,
    runsFor: 0, oversFacedDecimal: 0, runsAgainst: 0, oversBowledDecimal: 0,
    qualProbability: null
  }));
  
  // Static fallback data for remaining matches
  const staticRemainingMatchesData = [
    { match_number: 33, date: "2025-04-17", teams: "Mumbai Indians vs Sunrisers Hyderabad" },
    { match_number: 34, date: "2025-04-18", teams: "Royal Challengers Bengaluru vs Punjab Kings" },
    { match_number: 35, date: "2025-04-19", teams: "Gujarat Titans vs Delhi Capitals" },
    { match_number: 36, date: "2025-04-19", teams: "Rajasthan Royals vs Lucknow Super Giants" },
    { match_number: 37, date: "2025-04-20", teams: "Punjab Kings vs Royal Challengers Bengaluru" },
    { match_number: 38, date: "2025-04-20", teams: "Mumbai Indians vs Chennai Super Kings" },
    { match_number: 39, date: "2025-04-21", teams: "Kolkata Knight Riders vs Gujarat Titans" }
  ];
  
  // DOM Elements
  const getElem = id => document.getElementById(id);
  const tableBody = getElem('tableBody');
  const matchesContainer = getElem('matchesContainer');
  const resetButton = getElem('resetSimulationBtn');
  const mainHeading = document.querySelector('h1');
  // const teamSelect = getElem('teamSelect');
  // const qualifySimBtn = getElem('qualifySimBtn');
  // const simResultDiv = getElem('simResult');
  const randomizeBtn = getElem('randomizeBtn');
  
  // Constants and Mappings
  const LOCAL_STORAGE_KEY = 'iplMatchSelections_v2';
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
  let matchSelections = {};
  let selectedFilterTeam = null;
  let qualificationCache = {};
  let lastTableData = null;
  let lastRenderedMatchCount = -1;
  let remainingMatchesData = [];
  let hiddenMatchNumbers = [];
  window.matchWinProbs = null;
  
  // --- Debounce Utility ---
  function debounce(func, delay) {
      let timeoutId;
      return function(...args) {
          const context = this;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(context, args), delay);
      };
  }
  
  // --- Helper Functions ---
  function hexToRgba(hex, alpha) {
      if (!hex || typeof hex !== 'string' || hex.length < 4) return `rgba(200, 200, 200, ${alpha})`;
      const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      return (isNaN(r) || isNaN(g) || isNaN(b)) ? `rgba(200, 200, 200, ${alpha})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  function parseOversToDecimal(oversString) {
      if (typeof oversString !== 'string' || oversString.trim() === '') return { decimal: null, valid: false };
      const match = oversString.trim().match(/^(\d{1,2})(?:\.([0-5]))?$/);
      if (!match) return { decimal: null, valid: false };
      const overs = parseInt(match[1], 10);
      const balls = match[2] ? parseInt(match[2], 10) : 0;
      if (balls < 0 || balls > 5 || overs < 0 || overs > 20 || (overs === 20 && balls > 0)) {
          return { decimal: null, valid: false };
      }
      return { decimal: parseFloat((overs + balls / 6.0).toFixed(5)), valid: true };
  }
  
  function decimalOversToString(decimalOvers) {
      if (decimalOvers === null || isNaN(decimalOvers)) return '';
      const fullOvers = Math.floor(decimalOvers);
      const balls = Math.round((decimalOvers - fullOvers) * 6);
      if (balls === 0) return `${fullOvers}`;
      if (balls === 6) return `${fullOvers + 1}`;
      return `${fullOvers}.${balls}`;
  }
  
  function styleTeamButton(button, colors = null) {
      button.style.backgroundColor = colors?.bg || '';
      button.style.color = colors?.text || '';
      button.style.borderColor = colors?.bg || '';
  }
  
  function closeAllDropdowns(excludeDropdown = null) {
      document.querySelectorAll('.match-options-dropdown.visible, .score-inputs.visible').forEach(el => {
          const isScoreInput = el.classList.contains('score-inputs');
          const isOptionDropdown = el.classList.contains('match-options-dropdown');
  
          if (isOptionDropdown && el !== excludeDropdown) {
              el.classList.remove('visible');
          }
          if (isScoreInput && el !== excludeDropdown?.closest('.match-card')?.querySelector('.score-inputs')) {
              el.classList.remove('visible');
              el.closest('.match-card')?.querySelector('.score-toggle-icon')?.classList.remove('icon-rotated');
          }
      });
  }
  
  // --- NRR and Data Handling ---
  function estimateInitialStats(data) {
      const AVERAGE_TOTAL_RUN_RATE = 16.0;
      data.forEach(team => {
          if (team.initialPlayed === undefined) {
              team.initialPlayed = team.played;
              team.initialWon = team.won;
              team.initialLost = team.lost;
              team.initialNoResult = team.no_result;
              team.initialPoints = team.points;
              team.original_nrr = team.net_run_rate;
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
              Object.assign(team, { initialRunsFor: 0, initialOversFacedDecimal: 0, initialRunsAgainst: 0, initialOversBowledDecimal: 0 });
          }
          team.net_run_rate = team.original_nrr;
      });
  }
  
  function seededRandom(seed) {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
  }
  
  function calculateTeamStrength(team, allTeamsData, currentSelections, remainingMatches, currentMatchNumber = 999) {
      if (!team) return 1;
  
      const pointsFactor = (team.points ?? 0) / 7;
      const currentNRR = team.net_run_rate ?? team.original_nrr ?? 0;
      const nrrFactor = (currentNRR + 2) / 4;
      const matchesPlayed = team.played ?? 0;
      const overallWinRatio = matchesPlayed > 0 ? (team.won ?? 0) / matchesPlayed : 0.5;
      const formReliability = Math.min(1, matchesPlayed / 8);
      const matchesRemainingFactor = Math.max(0, 14 - matchesPlayed) / 14;
      const position = allTeamsData.findIndex(t => t.team === team.team) + 1;
      const positionFactor = position > 0 ? (allTeamsData.length + 1 - position) / allTeamsData.length : 0.5;
  
      let recentFormScore = 0;
      if (currentSelections && remainingMatches) {
          const teamRecentResults = [];
          const relevantMatchNumbers = Object.keys(currentSelections).map(Number)
              .filter(num => num < currentMatchNumber && remainingMatches.find(m => m.match_number === num)?.teams.includes(team.team) && currentSelections[num]?.winner)
              .sort((a, b) => b - a);
  
          const MAX_FORM_MATCHES = 5;
          for (const matchNum of relevantMatchNumbers) {
              if (teamRecentResults.length >= MAX_FORM_MATCHES) break;
              const result = currentSelections[matchNum];
              if (result.winner === team.team) teamRecentResults.push('W');
              else if (result.winner === 'NO_RESULT') teamRecentResults.push('N');
              else teamRecentResults.push('L');
          }
          const weights = [0.4, 0.3, 0.15, 0.1, 0.05];
          teamRecentResults.forEach((res, idx) => {
              if (idx < weights.length) {
                  if (res === 'W') recentFormScore += weights[idx];
                  else if (res === 'N') recentFormScore += weights[idx] * 0.3;
              }
          });
          recentFormScore = Math.max(0, recentFormScore);
      }
      const formFactor = recentFormScore;
  
      let avgOpponentStrengthFactor = 0.5;
      if (remainingMatches && allTeamsData) {
          let totalOpponentStrength = 0, opponentCount = 0;
          remainingMatches.forEach(match => {
              if (match.match_number >= currentMatchNumber && match.teams.includes(team.team) && !currentSelections[match.match_number]?.winner) {
                  const [t1, t2] = match.teams.split(' vs ').map(s => s.trim());
                  const opponentName = t1 === team.team ? t2 : t1;
                  const opponentTeam = allTeamsData.find(t => t.team === opponentName);
                  if (opponentTeam) {
                      const oppPointsFactor = (opponentTeam.points ?? 0) / 7;
                      const oppNrrFactor = ((opponentTeam.net_run_rate ?? opponentTeam.original_nrr ?? 0) + 2) / 4;
                      totalOpponentStrength += (oppPointsFactor * 1.5) + (oppNrrFactor * 1.0);
                      opponentCount++;
                  }
              }
          });
          if (opponentCount > 0) avgOpponentStrengthFactor = Math.max(0, Math.min(1, 1 - ((totalOpponentStrength / opponentCount) / 3.0)));
          else if (matchesPlayed >= 14) avgOpponentStrengthFactor = 0.5;
      }
  
      const finalStrength = (pointsFactor * 3.0) + (nrrFactor * 1.8) +
                            ((overallWinRatio * formReliability) * 1.0) + (formFactor * 1.5) +
                            (avgOpponentStrengthFactor * 1.2) + (matchesRemainingFactor * 0.5) +
                            (positionFactor * 0.3);
      return Math.max(0.1, finalStrength);
  }
  
  function generateCacheKey(selections) {
      if (!selections || Object.keys(selections).length === 0) return 'empty';
      return Object.entries(selections)
          .filter(([_, sel]) => sel?.winner)
          .map(([num, sel]) => `${num}:${sel.winner}`)
          .sort().join('|');
  }
  
  function simulateQualification(baseData, currentSelections, trials = 5000) {
      const cacheKey = generateCacheKey(currentSelections);
      if (qualificationCache[cacheKey]?.trials >= trials) {
          return qualificationCache[cacheKey].probabilities;
      }
  
      if (!Array.isArray(baseData) || baseData.length === 0) {
          console.error("Error in simulateQualification: baseData is invalid.");
          return {};
      }
  
      const counts = Object.fromEntries(baseData.map(team => [team.team, 0]));
      const matchesToSimulate = remainingMatchesData.filter(match => !hiddenMatchNumbers.includes(Number(match.match_number)));
  
      // Create a deep copy of baseData (initialPointsData) to apply current selections
      const tempDeterministicData = JSON.parse(JSON.stringify(baseData));
      
      // Apply currentSelections to tempDeterministicData to get an interim state
      // This updates played, won, lost, no_result, points for selected matches
      matchesToSimulate.forEach(match => {
          const selection = currentSelections[match.match_number];
          if (selection?.winner) {
              const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
              const t1 = tempDeterministicData.find(t => t.team === t1Name);
              const t2 = tempDeterministicData.find(t => t.team === t2Name);
              if (!t1 || !t2) return;

              // Mirroring logic from updateTableFromSelections for stat updates
              let t1IncrementedPlayed = false;
              if (t1.played < 14) {
                  t1.played++;
                  t1IncrementedPlayed = true;
              }
              let t2IncrementedPlayed = false;
              if (t2.played < 14) {
                  t2.played++;
                  t2IncrementedPlayed = true;
              }

              if (selection.winner === 'NO_RESULT') {
                  if (t1IncrementedPlayed) { t1.no_result++; t1.points++; }
                  if (t2IncrementedPlayed) { t2.no_result++; t2.points++; }
              } else {
                  const winnerData = (selection.winner === t1Name) ? t1 : t2;
                  const loserData = (selection.winner === t1Name) ? t2 : t1;
                  const winnerDidPlay = (selection.winner === t1Name) ? t1IncrementedPlayed : t2IncrementedPlayed;
                  const loserDidPlay = (selection.winner === t1Name) ? t2IncrementedPlayed : t1IncrementedPlayed;

                  if (winnerDidPlay) { winnerData.won++; winnerData.points += 2; }
                  if (loserDidPlay) loserData.lost++;
              }
          }
      });

      // Sort tempDeterministicData similar to the main table to find a reliable cutoff
      tempDeterministicData.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          // Use original_nrr as NRR isn't re-calculated here
          const nrrA = a.original_nrr ?? -Infinity, nrrB = b.original_nrr ?? -Infinity;
          if (nrrB !== nrrA) return nrrB - nrrA;
          if (b.won !== a.won) return b.won - a.won;
          return a.team.localeCompare(b.team);
      });
      
      let potentialCutoffPoints = 0;
      if (tempDeterministicData.length >= 4) {
          potentialCutoffPoints = tempDeterministicData[3].points;
      }

      const mathematicallyEliminatedTeams = new Set();
      tempDeterministicData.forEach(team => { // Use the updated tempDeterministicData
          // team.points and team.played are now reflective of currentSelections
          const maxPossiblePoints = team.points + ((14 - team.played) * 2);
          if (team.eliminated || (maxPossiblePoints < potentialCutoffPoints && team.played <= 14)) {
             // Also ensure team hasn't already played all games if using cutoff
             if (team.played >= 14 && team.points < potentialCutoffPoints) {
                mathematicallyEliminatedTeams.add(team.team);
             } else if (maxPossiblePoints < potentialCutoffPoints) {
                mathematicallyEliminatedTeams.add(team.team);
             }
          }
      });

      for (let i = 0; i < trials; i++) {
          const simData = JSON.parse(JSON.stringify(baseData));
          simData.forEach(t => t.net_run_rate = t.original_nrr);
          const trialSelections = JSON.parse(JSON.stringify(currentSelections));
  
          matchesToSimulate.forEach(match => {
              const matchNumber = match.match_number;
              const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
              const t1 = simData.find(t => t.team === t1Name);
              const t2 = simData.find(t => t.team === t2Name);
  
              if (!t1 || !t2 || (mathematicallyEliminatedTeams.has(t1Name) && mathematicallyEliminatedTeams.has(t2Name))) return;
  
              let winner = trialSelections[matchNumber]?.winner;
              let isNoResult = winner === 'NO_RESULT';
  
              if (!winner) {
                  const t1Strength = calculateTeamStrength(t1, simData, trialSelections, remainingMatchesData, matchNumber);
                  const t2Strength = calculateTeamStrength(t2, simData, trialSelections, remainingMatchesData, matchNumber);
                  const totalStrength = t1Strength + t2Strength;
                  const NO_RESULT_PROB = 0.05, WIN_PROB_TOTAL = 1.0 - NO_RESULT_PROB;
                  const MIN_WIN_PROB = 0.10 * WIN_PROB_TOTAL, MAX_WIN_PROB = 0.90 * WIN_PROB_TOTAL;
  
                  let t1WinProb = (totalStrength > 0) ? (t1Strength / totalStrength) * WIN_PROB_TOTAL : 0.5 * WIN_PROB_TOTAL;
                  t1WinProb = Math.max(MIN_WIN_PROB, Math.min(MAX_WIN_PROB, t1WinProb));
                  
                  const rand = seededRandom(i + matchNumber * 11 + t1Name.length * 3 + t2Name.length * 5);
                  if (rand < NO_RESULT_PROB) { winner = 'NO_RESULT'; isNoResult = true; }
                  else if (rand < NO_RESULT_PROB + t1WinProb) winner = t1Name;
                  else winner = t2Name;
                  trialSelections[matchNumber] = { winner };
              }
  
              let t1Played = t1.played < 14, t2Played = t2.played < 14;
              if (t1Played) t1.played++;
              if (t2Played) t2.played++;
  
              if (isNoResult) {
                  if (t1Played) { t1.no_result++; t1.points++; }
                  if (t2Played) { t2.no_result++; t2.points++; }
              } else if (winner === t1Name) {
                  if (t1Played) { t1.won++; t1.points += 2; }
                  if (t2Played) t2.lost++;
              } else if (winner === t2Name) {
                  if (t2Played) { t2.won++; t2.points += 2; }
                  if (t1Played) t1.lost++;
              }
          });
  
          simData.sort((a, b) => {
              if (b.points !== a.points) return b.points - a.points;
              const nrrA = a.original_nrr ?? -Infinity, nrrB = b.original_nrr ?? -Infinity;
              if (nrrB !== nrrA) return nrrB - nrrA;
              if (b.won !== a.won) return b.won - a.won;
              return a.team.localeCompare(b.team);
          });
  
          simData.slice(0, 4).forEach(t => {
              if (counts[t.team] !== undefined && !mathematicallyEliminatedTeams.has(t.team)) {
                  counts[t.team]++;
              }
          });
      }
  
      const probabilities = Object.fromEntries(baseData.map(team => [
          team.team,
          mathematicallyEliminatedTeams.has(team.team) ? 0.0 : (counts[team.team] || 0) / trials
      ]));
      qualificationCache[cacheKey] = { probabilities, trials };
      return probabilities;
  }
  
  // --- Local Storage ---
  function loadSelections() {
      try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          matchSelections = stored ? JSON.parse(stored) : {};
          if (typeof matchSelections !== 'object' || matchSelections === null) matchSelections = {};
          Object.values(matchSelections).forEach(sel => {
              if (sel && !sel.scores) sel.scores = { team1: {}, team2: {} };
              if (sel?.scores) {
                  if (!sel.scores.team1) sel.scores.team1 = {};
                  if (!sel.scores.team2) sel.scores.team2 = {};
              }
          });
      } catch (e) {
          console.error("Error parsing stored selections:", e);
          matchSelections = {};
          localStorage.removeItem(LOCAL_STORAGE_KEY);
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
  async function fetchData(url, fallbackData, typeName) {
      try {
          const response = await fetch(encodeURI(`${url}?v=${Date.now()}`));
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const jsonData = await response.json();
          if (!Array.isArray(jsonData)) throw new Error(`Fetched ${typeName} data is not an array`);
          console.log(`${typeName} loaded successfully (${jsonData.length} items).`);
          return jsonData;
      } catch (error) {
          console.warn(`Could not load ${typeName} via fetch, using embedded static data:`, error);
          return fallbackData;
      }
  }
  
  async function loadRemainingMatches() {
      remainingMatchesData = await fetchData('ipl matches.json', staticRemainingMatchesData, 'remaining matches');
  }
  
  async function loadHiddenMatches() {
      const rawHidden = await fetchData('hidden_matches.json', [], 'hidden matches');
      hiddenMatchNumbers = rawHidden.map(n => Number(n)).filter(n => !isNaN(n));
  }
  
  // --- Monte Carlo Simulation for Win Probability (Run Once) ---
  function runWinProbabilitySimulations() {
      if (window.matchWinProbs) return; // console.log("Win probabilities already calculated.");
      
      console.log("Running Monte Carlo simulations for initial match win probabilities...");
      const tempWinProbs = {};
      const simulations = 10000;
      const teamStrengths = Object.fromEntries(initialPointsData.map(team => {
          const pointsFactor = team.points / 7;
          const nrrFactor = (team.original_nrr + 2) / 4;
          const winRatio = team.played > 0 ? team.won / team.played : 0.5;
          return [team.team, (pointsFactor * 1.5) + (nrrFactor * 1.0) + (winRatio * 1.2)];
      }));
  
      remainingMatchesData.forEach(match => {
          const [team1FullName, team2FullName] = match.teams.split(' vs ').map(s => s.trim());
          const team1Strength = teamStrengths[team1FullName] || 1;
          const team2Strength = teamStrengths[team2FullName] || 1;
          const totalStrength = Math.max(0.1, team1Strength + team2Strength);
          const team1WinProb = Math.max(0.05, Math.min(0.95, team1Strength / totalStrength));
          let team1Wins = 0;
          for (let i = 0; i < simulations; i++) {
              if (Math.random() < team1WinProb) team1Wins++;
          }
          tempWinProbs[match.match_number] = {
              [team1FullName]: { count: team1Wins, prob: parseFloat(((team1Wins / simulations) * 100).toFixed(1)) },
              [team2FullName]: { count: simulations - team1Wins, prob: parseFloat((((simulations - team1Wins) / simulations) * 100).toFixed(1)) },
              total: simulations
          };
      });
      window.matchWinProbs = tempWinProbs;
      console.log("Initial win probability simulations complete.");
  }
  
  // --- Main Update Logic ---
  function updateTableFromSelections() {
      let updatedPointsData = JSON.parse(JSON.stringify(initialPointsData));
      updatedPointsData.forEach(team => {
          Object.assign(team, {
              played: team.initialPlayed ?? 0, won: team.initialWon ?? 0, lost: team.initialLost ?? 0,
              no_result: team.initialNoResult ?? 0, points: team.initialPoints ?? 0,
              runsFor: team.initialRunsFor ?? 0, oversFacedDecimal: team.initialOversFacedDecimal ?? 0,
              runsAgainst: team.initialRunsAgainst ?? 0, oversBowledDecimal: team.initialOversBowledDecimal ?? 0
          });
      });
  
      remainingMatchesData.forEach(matchInfo => {
          const selection = matchSelections[matchInfo.match_number];
          if (!selection?.winner) return;
  
          const [team1FullName, team2FullName] = matchInfo.teams.split(' vs ').map(s => s.trim());
          const team1Data = updatedPointsData.find(t => t.team === team1FullName);
          const team2Data = updatedPointsData.find(t => t.team === team2FullName);
          if (!team1Data || !team2Data) return;
  
          let t1IncrementPlayed = team1Data.played < 14, t2IncrementPlayed = team2Data.played < 14;
          if (t1IncrementPlayed) team1Data.played++;
          if (t2IncrementPlayed) team2Data.played++;
  
          if (selection.winner === 'NO_RESULT') {
              if (t1IncrementPlayed) { team1Data.no_result++; team1Data.points++; }
              if (t2IncrementPlayed) { team2Data.no_result++; team2Data.points++; }
          } else {
              const winnerData = (selection.winner === team1FullName) ? team1Data : team2Data;
              const loserData = (selection.winner === team1FullName) ? team2Data : team1Data;
              const winnerPlayed = (selection.winner === team1FullName) ? t1IncrementPlayed : t2IncrementPlayed;
              const loserPlayed = (selection.winner === team1FullName) ? t2IncrementPlayed : t1IncrementPlayed;
  
              if (winnerPlayed) { winnerData.won++; winnerData.points += 2; }
              if (loserPlayed) loserData.lost++;
  
              const scores = selection.scores;
              const scoresValid = scores?.team1 && typeof scores.team1.r === 'number' && !isNaN(scores.team1.r) && scores.team1.r >= 0 && scores.team1.oDec !== null &&
                                  scores?.team2 && typeof scores.team2.r === 'number' && !isNaN(scores.team2.r) && scores.team2.r >= 0 && scores.team2.oDec !== null;
              if (scoresValid) {
                  team1Data.runsFor += scores.team1.r; team1Data.oversFacedDecimal += scores.team1.oDec;
                  team1Data.runsAgainst += scores.team2.r; team1Data.oversBowledDecimal += scores.team2.oDec;
                  team2Data.runsFor += scores.team2.r; team2Data.oversFacedDecimal += scores.team2.oDec;
                  team2Data.runsAgainst += scores.team1.r; team2Data.oversBowledDecimal += scores.team1.oDec;
              } else if (selection.winner !== 'NO_RESULT') {
                  // console.warn(`Match ${matchInfo.match_number}: Winner selected but scores missing/invalid. NRR not updated.`);
              }
          }
      });
  
      updatedPointsData.forEach(team => {
          const totalRunsFor = Number(team.runsFor) || 0, totalOversFaced = Number(team.oversFacedDecimal) || 0;
          const totalRunsAgainst = Number(team.runsAgainst) || 0, totalOversBowled = Number(team.oversBowledDecimal) || 0;
          const runRateFor = totalOversFaced > 0 ? totalRunsFor / totalOversFaced : 0;
          const runRateAgainst = totalOversBowled > 0 ? totalRunsAgainst / totalOversBowled : 0;
          team.net_run_rate = Math.round((runRateFor - runRateAgainst) * 1000) / 1000;
          if (isNaN(team.net_run_rate)) {
              console.warn(`NRR NaN for ${team.team}. Falling back to original NRR (${team.original_nrr || 0}).`);
              team.net_run_rate = team.original_nrr ?? 0;
          }
      });
  
      updatedPointsData.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const nrrA = a.net_run_rate ?? -Infinity, nrrB = b.net_run_rate ?? -Infinity;
          if (nrrB !== nrrA) return nrrB - nrrA;
          if (b.won !== a.won) return b.won - a.won;
          return a.team.localeCompare(b.team);
      });
  
      updatedPointsData.forEach((team, index) => team.position = index + 1);
  
      const allMatchesSelectedOrComplete = updatedPointsData.every(team => team.played >= 14);
      let qualProbs = allMatchesSelectedOrComplete ?
          Object.fromEntries(updatedPointsData.map(team => [team.team, team.position <= 4 ? 1.0 : 0.0])) :
          simulateQualification(initialPointsData, matchSelections, 1000);
      
      if (allMatchesSelectedOrComplete) {
          const cacheKey = generateCacheKey(matchSelections);
          if (qualificationCache[cacheKey]) delete qualificationCache[cacheKey];
      }
  
      updatedPointsData.forEach(team => {
          const fourthPlacePoints = updatedPointsData[3]?.points ?? 0;
          const maxPossiblePoints = team.points + ((14 - team.played) * 2);
          team.qualProbability = (team.eliminated || maxPossiblePoints < fourthPlacePoints) ? 0.0 : (qualProbs[team.team] ?? null);
      });
  
      renderTable(updatedPointsData);
  }
  
  // --- Rendering Functions ---
  function formatNRR(nrr) {
      if (typeof nrr !== 'number' || isNaN(nrr)) return 'N/A';
      return (nrr > 0 ? '+' : '') + nrr.toFixed(3);
  }
  
  function renderTable(data) {
      const dataString = JSON.stringify(data.map(t => ({ p: t.position, pts: t.points, nrr: t.net_run_rate, prob: t.qualProbability })));
      if (lastTableData === dataString) return;
      lastTableData = dataString;
  
      const fragment = document.createDocumentFragment();
      data.forEach(team => {
          const row = document.createElement('tr');
          row.dataset.team = team.team;
          const colors = teamColorMap[team.team];
          const shortTeamName = teamNameMap[team.team] || team.team;
  
          let displayNRR;
          if (team.played === (team.initialPlayed ?? team.played) &&
              team.runsFor === team.initialRunsFor &&
              team.runsAgainst === team.initialRunsAgainst) {
              displayNRR = formatNRR(team.original_nrr ?? team.net_run_rate);
          } else {
              displayNRR = formatNRR(team.net_run_rate);
          }
  
          if (colors) {
              row.style.background = `linear-gradient(to right, ${hexToRgba(colors.bg, 0.25)}, ${hexToRgba(colors.bg, 0.1)})`;
              row.style.borderLeft = `4px solid ${colors.bg}`;
              if (team.position <= 4 && !team.eliminated) {
                  row.dataset.playoff = "true";
                  row.style.fontWeight = "500";
                  row.style.borderTop = `1px solid ${hexToRgba(colors.bg, 0.3)}`;
                  row.style.borderBottom = `1px solid ${hexToRgba(colors.bg, 0.3)}`;
              }
          }
          if (team.eliminated) {
              row.style.opacity = "0.6";
              row.classList.add('eliminated');
              row.title = "Eliminated from playoff contention";
          }
          if (team.team === selectedFilterTeam) row.classList.add('selected-row');
  
          row.innerHTML = `
              <td>${team.position}</td>
              <td class="team-name-cell" title="${team.team}">${team.eliminated ? `${shortTeamName} <span class="eliminated-indicator">(E)</span>` : shortTeamName}</td>
              <td>${team.played}</td> <td>${team.won}</td> <td>${team.lost}</td>
              <td>${team.no_result}</td> <td>${team.points}</td> <td>${displayNRR}</td>
              <td class="qual-prob-cell"></td>`;
  
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
              if (team.qualProbability === 1.0 && team.position <= 4) {
                  qualCell.classList.add('prob-qualified');
                  qualCell.title = 'Qualified';
              }
          } else {
              qualCell.textContent = '—';
          }
          fragment.appendChild(row);
      });
      tableBody.innerHTML = '';
      tableBody.appendChild(fragment);
  }
  
  function updateMatchSelectionStates() {
      matchesContainer.querySelectorAll('.match-card').forEach(matchCard => {
          const matchNumber = parseInt(matchCard.dataset.matchNumber, 10);
          if (isNaN(matchNumber)) return;
  
          const savedSelection = matchSelections[matchNumber];
          const [team1Button, team2Button] = matchCard.querySelectorAll('.team-button');
          const scoreInputsDiv = matchCard.querySelector('.score-inputs');
  
          matchCard.classList.remove('no-result-selected');
          team1Button.classList.remove('selected'); styleTeamButton(team1Button);
          team2Button.classList.remove('selected'); styleTeamButton(team2Button);
          scoreInputsDiv.classList.remove('disabled');
          scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = false);
  
          if (savedSelection) {
              if (savedSelection.winner === 'NO_RESULT') {
                  matchCard.classList.add('no-result-selected');
                  scoreInputsDiv.classList.add('disabled');
                  scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = true);
              } else if (savedSelection.winner) {
                  const winningButton = savedSelection.winner === team1Button.dataset.teamName ? team1Button : team2Button;
                  if (winningButton) {
                      winningButton.classList.add('selected');
                      styleTeamButton(winningButton, teamColorMap[savedSelection.winner]);
                  }
              }
          }
      });
  }
  
  function renderMatches() {
      if (!window.matchWinProbs) runWinProbabilitySimulations();
  
      const visibleMatches = remainingMatchesData.filter(m => !hiddenMatchNumbers.includes(Number(m.match_number)));
      const needsFullRender = matchesContainer.children.length !== visibleMatches.length || lastRenderedMatchCount === -1;
      lastRenderedMatchCount = visibleMatches.length;
  
      if (!needsFullRender) {
          updateMatchSelectionStates();
          return;
      }
  
      console.log("Performing full render of match cards.");
      matchesContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();
  
      visibleMatches.forEach(match => {
          const [team1FullName, team2FullName] = match.teams.split(' vs ').map(s => s.trim());
          const team1ShortName = teamNameMap[team1FullName] || team1FullName;
          const team2ShortName = teamNameMap[team2FullName] || team2FullName;
          const simResult = window.matchWinProbs?.[match.match_number];
          const team1Prob = simResult?.[team1FullName]?.prob ?? 50;
          const team2Prob = simResult?.[team2FullName]?.prob ?? 50;
          const team1ColorObj = teamColorMap[team1FullName] || { bg: '#808080', text: '#fff' };
          const team2ColorObj = teamColorMap[team2FullName] || { bg: '#A9A9A9', text: '#fff' };
  
          const matchCard = document.createElement('div');
          matchCard.className = 'match-card';
          matchCard.dataset.matchNumber = match.match_number;
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
                  <div class="score-input-group"><label>${team1ShortName}:</label><input type="number" name="team1Runs" placeholder="Runs" min="0" step="1"><input type="text" name="team1Overs" placeholder="Overs" title="Format: O or O.B (0-5 balls)" pattern="^\\d{1,2}(\\.[0-5])?$"></div>
                  <div class="score-input-group"><label>${team2ShortName}:</label><input type="number" name="team2Runs" placeholder="Runs" min="0" step="1"><input type="text" name="team2Overs" placeholder="Overs" title="Format: O or O.B (0-5 balls)" pattern="^\\d{1,2}(\\.[0-5])?$"></div>
              </div>
              <div class="probability-bar-container" title="Initial Win Probability: ${team1FullName} ${team1Prob}% vs ${team2FullName} ${team2Prob}%">
                  <div class="prob-segment prob-team1" style="width: ${team1Prob}%; background-color: ${team1ColorObj.bg}; color: ${team1ColorObj.text};">${team1Prob}%</div>
                  <div class="prob-segment prob-team2" style="width: ${team2Prob}%; background-color: ${team2ColorObj.bg}; color: ${team2ColorObj.text};">${team2Prob}%</div>
              </div>`;
  
          const scoreToggleIcon = matchCard.querySelector('.score-toggle-icon');
          const dropdownIcon = matchCard.querySelector('.match-options-icon');
          const dropdownMenu = matchCard.querySelector('.match-options-dropdown');
          const scoreInputsDiv = matchCard.querySelector('.score-inputs');
          const [team1Button, team2Button] = matchCard.querySelectorAll('.team-button');
          const noResultButton = matchCard.querySelector('.no-result-button');
          const t1RunsInput = matchCard.querySelector('input[name="team1Runs"]');
          const t1OversInput = matchCard.querySelector('input[name="team1Overs"]');
          const t2RunsInput = matchCard.querySelector('input[name="team2Runs"]');
          const t2OversInput = matchCard.querySelector('input[name="team2Overs"]');
  
          const debouncedUpdateTable = debounce(updateTableFromSelections, 500);

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
                      styleTeamButton(winningButton, teamColorMap[savedSelection.winner]);
                  }
              }
              if (savedSelection.scores) {
                  t1RunsInput.value = savedSelection.scores.team1?.r ?? '';
                  t1OversInput.value = savedSelection.scores.team1?.oStr ?? '';
                  t2RunsInput.value = savedSelection.scores.team2?.r ?? '';
                  t2OversInput.value = savedSelection.scores.team2?.oStr ?? '';
              }
          }
  
          [t1RunsInput, t1OversInput, t2RunsInput, t2OversInput].forEach(input => {
              input.addEventListener('input', () => {
                  const currentMatchNumber = match.match_number;
                  if (!matchSelections[currentMatchNumber]) matchSelections[currentMatchNumber] = { winner: null, scores: { team1: {}, team2: {} } };
                  const scores = matchSelections[currentMatchNumber].scores;
                  scores.team1.r = t1RunsInput.value.trim() === '' ? null : parseInt(t1RunsInput.value, 10);
                  scores.team1.oStr = t1OversInput.value;
                  scores.team2.r = t2RunsInput.value.trim() === '' ? null : parseInt(t2RunsInput.value, 10);
                  scores.team2.oStr = t2OversInput.value;
  
                  const { decimal: o1Dec, valid: o1Valid } = parseOversToDecimal(t1OversInput.value);
                  const { decimal: o2Dec, valid: o2Valid } = parseOversToDecimal(t2OversInput.value);
                  scores.team1.oDec = o1Valid ? o1Dec : null;
                  scores.team2.oDec = o2Valid ? o2Dec : null;
  
                  [t1OversInput, t2OversInput].forEach(ovIn => ovIn.setCustomValidity((parseOversToDecimal(ovIn.value).valid || ovIn.value.trim() === '') ? '' : 'Invalid format (e.g., 20 or 19.5)'));
                  [t1OversInput, t2OversInput].forEach(ovIn => ovIn.reportValidity());
                  
                  saveSelections(); // Save immediately
                  debouncedUpdateTable(); // Update table debounced
              });
          });
  
          [team1Button, team2Button, noResultButton].forEach(button => {
              button.addEventListener('click', (event) => {
                  event.stopPropagation();
                  const currentMatchNumber = match.match_number;
                  const selectedResult = button.dataset.resultType === 'WIN' ? button.dataset.teamName : 'NO_RESULT';
                  const isCurrentlySelected = matchSelections[currentMatchNumber]?.winner === selectedResult;
  
                  matchCard.classList.remove('no-result-selected');
                  [team1Button, team2Button].forEach(btn => { btn.classList.remove('selected'); styleTeamButton(btn); });
                  scoreInputsDiv.classList.remove('disabled');
                  scoreInputsDiv.querySelectorAll('input').forEach(input => input.disabled = false);
  
                  if (isCurrentlySelected) {
                      if (matchSelections[currentMatchNumber]) matchSelections[currentMatchNumber].winner = null;
                  } else {
                      if (!matchSelections[currentMatchNumber]) matchSelections[currentMatchNumber] = { winner: null, scores: { team1: {}, team2: {} } };
                      matchSelections[currentMatchNumber].winner = selectedResult;
                      if (selectedResult === 'NO_RESULT') {
                          matchCard.classList.add('no-result-selected');
                          scoreInputsDiv.classList.add('disabled');
                          scoreInputsDiv.querySelectorAll('input').forEach(input => { input.disabled = true; input.value = ''; });
                          if (matchSelections[currentMatchNumber].scores) matchSelections[currentMatchNumber].scores = { team1: {}, team2: {} };
                      } else {
                          button.classList.add('selected');
                          styleTeamButton(button, teamColorMap[selectedResult]);
                      }
                  }
                  closeAllDropdowns();
                  saveSelections();
                  updateTableFromSelections();
              });
          });
  
          dropdownIcon.addEventListener('click', (event) => {
              event.stopPropagation();
              closeAllDropdowns(dropdownMenu);
              dropdownMenu.classList.toggle('visible');
          });
  
          scoreToggleIcon.addEventListener('click', () => {
              closeAllDropdowns();
              const isOpening = !scoreInputsDiv.classList.contains('visible');
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
      });
      matchesContainer.appendChild(fragment);
  }
  
  // --- Filtering Logic ---
  function applyMatchFilter() {
      tableBody.querySelectorAll('tr').forEach(row => row.classList.toggle('selected-row', row.dataset.team === selectedFilterTeam));
      let visibleCount = 0;
      matchesContainer.querySelectorAll('.match-card').forEach(card => {
          const [btn1, btn2] = card.querySelectorAll('.team-button[data-team-name]');
          const isVisible = !selectedFilterTeam || btn1?.dataset.teamName === selectedFilterTeam || btn2?.dataset.teamName === selectedFilterTeam;
          card.classList.toggle('hidden', !isVisible);
          if (isVisible) visibleCount++;
      });
      document.body.classList.toggle('filter-active', !!selectedFilterTeam);
      if (visibleCount !== lastRenderedMatchCount) lastRenderedMatchCount = -1;
  }
  
  // --- Event Listeners Setup ---
  function setupEventListeners() {
      if (resetButton) resetButton.addEventListener('click', handleResetClick);
      else console.error("Reset button not found!");
  
      tableBody.addEventListener('click', (event) => {
          const clickedRow = event.target.closest('tr');
          if (!clickedRow?.dataset.team) return;
          selectedFilterTeam = (selectedFilterTeam === clickedRow.dataset.team) ? null : clickedRow.dataset.team;
          applyMatchFilter();
      });
  
      if (randomizeBtn) randomizeBtn.addEventListener('click', handleRandomizeClick);
      else console.warn("Randomize button not found!");
  
      if (mainHeading) {
          mainHeading.style.cursor = 'pointer';
          mainHeading.title = 'Click to Refresh Page';
          mainHeading.addEventListener('click', () => location.reload());
      } else console.error("Main heading (h1) not found!");
  
      document.body.addEventListener('click', (event) => {
          if (!event.target.closest('.match-options-icon, .match-options-dropdown, .score-toggle-icon, .score-inputs, .team-button, button')) {
              closeAllDropdowns();
          }
      });
  
      // if (teamSelect && qualifySimBtn && simResultDiv) {
      //     qualifySimBtn.addEventListener('click', handleQualifySimulationClick);
      // } else console.warn("Team simulation elements (select, button, result div) not all found.");
  }
  
  // --- Event Handler Functions ---
  function handleResetClick() {
      console.log("Resetting simulation...");
      if (resetButton) {
          resetButton.disabled = true;
          resetButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          setTimeout(() => {
              resetButton.style.backgroundColor = "";
              resetButton.disabled = false;
          }, 200);
      }
  
      matchSelections = {}; selectedFilterTeam = null; qualificationCache = {};
      lastTableData = null; lastRenderedMatchCount = -1;
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      // if (simResultDiv) simResultDiv.innerHTML = '';
      // if (teamSelect) teamSelect.value = '';
  
      setTimeout(() => {
          try {
              renderMatches();
              updateTableFromSelections();
              applyMatchFilter();
              closeAllDropdowns();
              console.log("Simulation reset complete.");
          } catch (error) {
              console.error("Error during reset process:", error);
              if (simResultDiv) simResultDiv.innerHTML = '<span style="color: red;">Error during reset.</span>';
              if (resetButton) resetButton.disabled = false;
          }
      }, 50);
  }
  
  function handleRandomizeClick() {
      console.log("Randomizing remaining match results...");
      if (randomizeBtn) {
          randomizeBtn.disabled = true; randomizeBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          setTimeout(() => { randomizeBtn.style.backgroundColor = ""; randomizeBtn.disabled = false; }, 150);
      }
      if (!Array.isArray(remainingMatchesData)) { console.error("Remaining matches data not available."); return; }
  
      // const favoriteTeam = teamSelect?.value;
      // if (simResultDiv) simResultDiv.innerHTML = 'Randomizing...';
      matchSelections = {};
      let tempPointsData = JSON.parse(JSON.stringify(initialPointsData));
      if (!tempPointsData[0].initialRunsFor) estimateInitialStats(tempPointsData);
      tempPointsData.forEach(team => Object.assign(team, {
          played: team.initialPlayed ?? team.played, won: team.initialWon ?? team.won,
          lost: team.initialLost ?? team.lost, no_result: team.initialNoResult ?? team.no_result,
          points: team.initialPoints ?? team.points
      }));
  
      remainingMatchesData.forEach(match => {
          if (hiddenMatchNumbers.includes(Number(match.match_number))) return;
          const [t1Name, t2Name] = match.teams.split(' vs ').map(s => s.trim());
          // const t1Data = tempPointsData.find(t => t.team === t1Name);
          // const t2Data = tempPointsData.find(t => t.team === t2Name);
          // const favData = favoriteTeam ? tempPointsData.find(t => t.team === favoriteTeam) : null;
          let result;
  
          // if (favoriteTeam && (t1Name === favoriteTeam || t2Name === favoriteTeam)) {
          //     const winScore = Math.floor(Math.random() * (200 - 160 + 1)) + 160;
          //     const loseScore = Math.max(0, winScore - (Math.floor(Math.random() * 40) + 10));
          //     result = {
          //         winner: favoriteTeam,
          //         scores: {
          //             team1: { r: (t1Name === favoriteTeam ? winScore : loseScore), oStr: "20", oDec: 20.0 },
          //             team2: { r: (t2Name === favoriteTeam ? winScore : loseScore), oStr: "20", oDec: 20.0 }
          //         }
          //     };
          // } else if (favoriteTeam && favData && t1Data && t2Data && t1Data.points > favData.points && t2Data.points > favData.points) {
          //     const loserToPick = (t1Data.points > t2Data.points) ? t1Name : t2Name;
          //     const winner = (loserToPick === t1Name) ? t2Name : t1Name;
          //     const winScore = Math.floor(Math.random() * (190 - 150 + 1)) + 150;
          //     const loseScore = Math.max(0, winScore - (Math.floor(Math.random() * 30) + 10));
          //     result = {
          //         winner: winner,
          //         scores: {
          //             team1: { r: (t1Name === winner ? winScore : loseScore), oStr: "20", oDec: 20.0 },
          //             team2: { r: (t2Name === winner ? winScore : loseScore), oStr: "20", oDec: 20.0 }
          //         }
          //     };
          // } else {
          result = generateRandomMatchResult(t1Name, t2Name);
          // }
          matchSelections[match.match_number] = { winner: result.winner, scores: result.scores };
  
          // This logic to update tempPointsData during randomization seems to duplicate what updateTableFromSelections does.
          // However, it might be used by the favoriteTeam logic that was just removed. For now, I'll comment out the direct updates
          // as updateTableFromSelections will be called anyway after all random selections are made.
          const t1DataForUpdate = tempPointsData.find(t => t.team === t1Name);
          const t2DataForUpdate = tempPointsData.find(t => t.team === t2Name);
          if (t1DataForUpdate && t2DataForUpdate) {
              t1DataForUpdate.played++; t2DataForUpdate.played++;
              if (result.winner === 'NO_RESULT') { t1DataForUpdate.points++; t1DataForUpdate.no_result++; t2DataForUpdate.points++; t2DataForUpdate.no_result++; }
              else if (result.winner === t1Name) { t1DataForUpdate.points += 2; t1DataForUpdate.won++; t2DataForUpdate.lost++; }
              else if (result.winner === t2Name) { t2DataForUpdate.points += 2; t2DataForUpdate.won++; t1DataForUpdate.lost++; }
          }
      });
  
      // if (favoriteTeam && simResultDiv) {
      //     tempPointsData.sort((a, b) => {
      //         if (b.points !== a.points) return b.points - a.points;
      //         const nrrA = a.original_nrr ?? -Infinity, nrrB = b.original_nrr ?? -Infinity;
      //         if (nrrB !== nrrA) return nrrB - nrrA;
      //         if (b.won !== a.won) return b.won - a.won;
      //         return a.team.localeCompare(b.team);
      //     });
      //     const favRank = tempPointsData.findIndex(t => t.team === favoriteTeam) + 1;
      //     const favPoints = tempPointsData.find(t => t.team === favoriteTeam)?.points;
      //     if (favRank > 0 && favRank <= 4) simResultDiv.innerHTML = `<span style="color: #4caf50;">Favored: ${favoriteTeam} in top 4! (#${favRank}, ${favPoints}pts)</span>`;
      //     else if (favRank > 4) simResultDiv.innerHTML = `<span style="color: #ff9800;">Favored: ${favoriteTeam} at #${favRank} (${favPoints}pts).</span>`;
      //     else simResultDiv.innerHTML = `<span style="color: #f44336;">Could not rank ${favoriteTeam} in favored sim.</span>`;
      // } else if (simResultDiv) simResultDiv.innerHTML = 'Randomization complete.';
  
      saveSelections();
      lastRenderedMatchCount = -1;
      renderMatches();
      updateTableFromSelections();
      applyMatchFilter();
      console.log("Randomization finished.");
  }
  
  function generateRandomMatchResult(team1Name, team2Name) {
      if (Math.random() < 0.03) return { winner: 'NO_RESULT', scores: { team1: {}, team2: {} } };
  
      const t1Runs = Math.floor(Math.random() * (220 - 130 + 1)) + 130;
      const t1OversDecimal = 20.0;
      let t2Runs, t2OversDecimal;
  
      if (Math.random() < 0.5) { // Chase Success
          t2Runs = t1Runs + 1 + Math.floor(Math.random() * 15);
          const oversRand = Math.random();
          if (oversRand < 0.1) t2OversDecimal = Math.min(19.5, 16.0 + Math.random() * 2);
          else if (oversRand < 0.7) t2OversDecimal = Math.min(19.5, 18.0 + Math.random() * 1.8);
          else t2OversDecimal = 20.0;
      } else { // Chase Failure
          t2Runs = Math.max(0, t1Runs - (Math.floor(Math.random() * (60 - 5 + 1)) + 5));
          t2OversDecimal = Math.random() < 0.75 ? 20.0 : Math.min(19.5, 15.0 + Math.random() * 4.8);
      }
      if (t2Runs > 0 && t2OversDecimal <= 0) t2OversDecimal = 1 + Math.random();
      t2OversDecimal = parseFloat(t2OversDecimal.toFixed(1));
  
      return {
          winner: (t2Runs > t1Runs) ? team2Name : team1Name,
          scores: {
              team1: { r: t1Runs, oStr: decimalOversToString(t1OversDecimal), oDec: t1OversDecimal },
              team2: { r: t2Runs, oStr: decimalOversToString(t2OversDecimal), oDec: t2OversDecimal }
          }
      };
  }
  
  // --- Initial Setup ---
  async function initializeApp() {
      console.log("Initializing IPL Points Table Simulator...");
      const essentialElements = { tableBody, matchesContainer, resetButton, mainHeading };
      if (Object.values(essentialElements).some(el => !el)) {
          const missing = Object.entries(essentialElements).filter(([_, el]) => !el).map(([name]) => name).join(', ');
          console.error(`Initialization Error: Essential DOM elements not found: ${missing}`);
          if(matchesContainer) matchesContainer.innerHTML = '<p style="color: red; text-align: center;">Error: Page elements missing. Cannot load simulator.</p>';
          return;
      }
      console.log("Essential DOM elements found.");
  
      tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Loading data...</td></tr>';
      matchesContainer.innerHTML = '<p style="text-align: center;">Loading matches...</p>';
  
      loadSelections();
      await loadRemainingMatches();
      await loadHiddenMatches();
  
      if (remainingMatchesData.length === 0 && staticRemainingMatchesData.length === 0) {
          console.error("Initialization Error: No match data available.");
          tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: red;">Error: Could not load match data.</td></tr>';
          matchesContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading match data.</p>';
          return;
      }
      console.log(`Using ${remainingMatchesData.length} matches for simulation.`);
  
      estimateInitialStats(initialPointsData);
      runWinProbabilitySimulations();
      setupEventListeners();
      renderMatches();
      updateTableFromSelections();
      applyMatchFilter();
      console.log("IPL Points Table Simulator Initialized Successfully.");
  }
  
  document.addEventListener('DOMContentLoaded', initializeApp);