document.addEventListener('DOMContentLoaded', () => {
  // Navigation handling
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.dashboard-section');
  const pageTitle = document.getElementById('page-title');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').replace('#', '');

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(s => s.classList.add('hidden'));
      const targetSection = document.getElementById(`section-${targetId}`);
      if (targetSection) targetSection.classList.remove('hidden');

      // Update page title
      switch (targetId) {
        case 'overview': pageTitle.innerText = 'Executive Control Telemetry'; break;
        case 'agents': pageTitle.innerText = 'Multi-Agent Thought Stream & Logs'; break;
        case 'arbitrage': pageTitle.innerText = 'Prediction Market Arbitrage Radar'; break;
        case 'risk': pageTitle.innerText = 'Risk Management & Circuit Breaker Engine'; break;
        case 'forum': pageTitle.innerText = 'Machine-to-Machine Agent Forum'; break;
      }
    });
  });

  // Chart initialization
  const ctx = document.getElementById('portfolioChart').getContext('2d');
  const portfolioChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
      datasets: [{
        label: 'Portfolio Equity ($)',
        data: [12000, 12110, 12080, 12250, 12380, 12410, 12450.75],
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8c9ba5' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8c9ba5' } }
      }
    }
  });

  // WebSocket Setup
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${window.location.host}`;
  const ws = new WebSocket(wsUrl);

  const terminalLogs = document.getElementById('terminal-logs');

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'TELEMETRY_UPDATE') {
        updateTelemetryUI(msg.data);
      }
    } catch (e) {
      console.error('WebSocket parse error', e);
    }
  };

  function updateTelemetryUI(data) {
    if (data.portfolio) {
      document.getElementById('stat-portfolio').innerText = `$${data.portfolio.totalBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      document.getElementById('stat-pnl').innerText = `+$${data.portfolio.dailyPnlUsd.toFixed(2)}`;
      document.getElementById('stat-winrate').innerText = `${data.portfolio.winRatePct}%`;
      document.getElementById('stat-positions').innerText = `${data.portfolio.activePositionsCount} Active`;
    }

    if (data.microChallengeState) {
      const state = data.microChallengeState;
      document.getElementById('stat-challenge-bal').innerText = `$${state.currentBalanceUsd.toFixed(2)}`;
      document.getElementById('challenge-level').innerText = state.currentLevel;
      document.getElementById('stat-challenge-target').innerText = `$${state.nextMilestoneUsd.toFixed(2)}`;

      const progressPct = Math.min(100, Math.max(5, (state.currentBalanceUsd / state.nextMilestoneUsd) * 100));
      document.getElementById('challenge-progress-fill').style.width = `${progressPct}%`;
    }

    if (data.logs && Array.isArray(data.logs)) {
      terminalLogs.innerHTML = '';
      data.logs.forEach(log => {
        const timeStr = new Date(log.timestamp).toLocaleTimeString();
        const div = document.createElement('div');
        div.className = `log-entry ${log.level}`;
        div.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="log-agent">[${log.agent}]</span> ${log.message}`;
        terminalLogs.appendChild(div);
      });
      terminalLogs.scrollTop = terminalLogs.scrollHeight;
    }
  }

  // LLM Provider Switcher
  const providerSelect = document.getElementById('llm-provider-selector');
  providerSelect.addEventListener('change', () => {
    const provider = providerSelect.value;
    document.getElementById('active-provider-badge').innerText = `Provider: ${provider.toUpperCase()}`;
  });

  // Trigger Manual AI Scan
  document.getElementById('btn-trigger-analysis').addEventListener('click', async () => {
    const provider = providerSelect.value;
    try {
      const res = await fetch('/api/agent/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Execute rapid orderbook scan across Polymarket and Kalshi for arbitrage opportunities',
          provider
        })
      });
      const data = await res.json();
      alert(`AI Scan Initiated!\nOrchestrator Decision: ${data.result}`);
    } catch (err) {
      alert(`Failed to trigger scan: ${err.message}`);
    }
  });

  // Submit Prompt
  document.getElementById('btn-submit-prompt').addEventListener('click', async () => {
    const promptText = document.getElementById('prompt-input').value;
    if (!promptText.trim()) return;

    const resBox = document.getElementById('prompt-response-box');
    const resText = document.getElementById('prompt-response-text');
    resBox.classList.remove('hidden');
    resText.innerText = 'Analyzing market telemetry via selected LLM model...';

    try {
      const res = await fetch('/api/agent/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, provider: providerSelect.value })
      });
      const data = await res.json();
      resText.innerText = data.result;
    } catch (err) {
      resText.innerText = `Error: ${err.message}`;
    }
  });

  // Reset $2 Challenge
  const btnStartChallenge = document.getElementById('btn-start-challenge');
  if (btnStartChallenge) {
    btnStartChallenge.addEventListener('click', async () => {
      const res = await fetch('/api/challenge/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capital: 2.0 })
      });
      const data = await res.json();
      alert(`🚀 $2 Micro Prediction Market Challenge Started!\nStarting Capital: $2.00\nTarget Level 1: $5.00`);
    });
  }

  // Reset Circuit Breaker
  document.getElementById('btn-reset-circuit').addEventListener('click', async () => {
    const res = await fetch('/api/risk/circuit-breaker/reset', { method: 'POST' });
    const data = await res.json();
    alert(data.status);
  });

  // Load Forum Threads
  async function loadForumThreads() {
    try {
      const res = await fetch('/api/forum/threads');
      const data = await res.json();
      const container = document.getElementById('forum-threads-container');
      if (container && data.threads) {
        container.innerHTML = '';
        data.threads.forEach(t => {
          const div = document.createElement('div');
          div.className = 'forum-card';
          div.innerHTML = `
            <h4>${t.title}</h4>
            <p>${t.body}</p>
            <div class="forum-meta">
              <span>Author: ${t.authorAgent}</span>
              <span>Upvotes: 👍 ${t.upvotes}</span>
            </div>
          `;
          container.appendChild(div);
        });
      }
    } catch (e) {
      console.warn('Could not load forum threads', e);
    }
  }

  loadForumThreads();
});
