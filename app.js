const API_URL = 'https://api.nitestats.com/v1/epic/staging/fortnite';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const ENVIRONMENTS = {
    'live': {
        title: 'Live',
        envs: ['FortniteLive', 'LiveBroadcasting', 'FortniteDevPlaytest', 'BlueExtQADevTesting']
    },
    'testing': {
        title: 'Testing',
        envs: ['BlueExtQADevTesting', 'RedExtQADevTesting', 'BlueDailyMainTesting', 'RedDailyMainTesting']
    },
    'playtest': {
        title: 'Playtest',
        envs: [
            'FortniteDevPlaytest', 'FortniteDevPlaytestB', 'FortniteDevPlaytestC', 
            'FortniteDevPlaytestD', 'FortniteDevPlaytestE', 'FortniteDevPlaytestF',
            'FortniteDevPlaytestG', 'FortniteDevPlaytestH', 'FortniteDevPlaytestI',
            'FortniteDevPlaytestK', 'FortniteDevPlaytestL',
            'FortniteDevPlaytestM', 'FortniteDevPlaytestO', 'FortniteDevPlaytestP',
            'FortniteDevPlaytestQ', 'FortniteDevPlaytestR', 'FortniteDevPlaytestS',
            'FortniteDevPlaytestT', 'FortniteDevPlaytestU', 'FortniteDevPlaytestV',
            'FortniteDevPlaytestX', 'FortniteReleasePlaytest',
            'ReleasePlaytestB'
        ]
    },
    'events': {
        title: 'Events',
        envs: ['FortniteEvents']
    },
    'live-builds': {
        title: 'Live Builds',
        envs: ['FortniteLive', 'FortniteLiveTesting', 'LiveBroadcasting', 'FortniteProdLive']
    },
    'staging': {
        title: 'Staging',
        envs: [
            'FortniteStageLive', 'FortniteStageRelease',
            'FortniteStageDev', 'FortniteStageMain'
        ]
    }
};

const environments = {
    // Playtest environments
    "FortniteDevPlaytest": "devplaytest-prod12",
    "FortniteDevPlaytestB": "devplaytestb-prod",
    "FortniteDevPlaytestC": "devplaytestc-prod",
    "FortniteDevPlaytestD": "devplaytestd-prod",
    "FortniteDevPlaytestE": "devplayteste-prod",
    "FortniteDevPlaytestF": "devplaytestf-prod",
    "FortniteDevPlaytestG": "devplaytestg-prod",
    "FortniteDevPlaytestH": "devplaytesth-prod",
    "FortniteDevPlaytestI": "devplaytesti-prod",
    "FortniteDevPlaytestJ": "devplaytestj-prod",
    "FortniteDevPlaytestK": "devplaytestk-prod",
    "FortniteDevPlaytestL": "devplaytestl-prod",
    "FortniteDevPlaytestM": "devplaytestm-prod",
    "FortniteDevPlaytestO": "devplaytesto-prod",
    "FortniteDevPlaytestP": "devplaytestp-prod",
    "FortniteDevPlaytestQ": "devplaytestq-prod",
    "FortniteDevPlaytestR": "devplaytestr-prod",
    "FortniteDevPlaytestS": "devplaytests-prod",
    "FortniteDevPlaytestT": "devplaytestt-prod",
    "FortniteDevPlaytestU": "devplaytestu-prod",
    "FortniteDevPlaytestV": "devplaytestv-prod",
    "FortniteDevPlaytestW": "devplaytestw-prod",
    "FortniteDevPlaytestX": "devplaytestx-prod",
    "FortniteDevPlaytestY": "devplaytesty-prod",
    "FortniteReleasePlaytest": "releaseplaytest-prod",
    "ReleasePlaytestB": "releaseplaytestb-prod",

    // Live environments
    "FortniteLive": "prod11",
    "FortniteLiveTesting": "livetesting-prod",
    "LiveBroadcasting": "livebroadcasting-prod",
    "FortniteProdLive": "live-prod",

    // Staging environments
    "FortniteStageNSCert": "nscert-stage",
    "FortniteStageLive": "live-stage",
    "FortniteStageRelease": "release-stage",
    "FortniteStageDev": "dev-stage",
    "FortniteStageMain": "stage",
    "CertStagingB": "certstageb-stage",
    "CertStagingC": "certstagec-stage",

    // Events environment
    "FortniteEvents": "events-prod"
};

// Global variables for timing
let lastUpdateTime = null;
let nextUpdateTime = null;
let updateInterval;
let timerInterval;
let cachedData = null;
let isTimerRunning = false;
let globalSecondsLeft = 60;

// Create a small, persistent timer
function createGlobalTimer() {
    const existingTimer = document.querySelector('.global-timer');
    if (!existingTimer) {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'global-timer';
        document.body.insertBefore(timerDiv, document.body.firstChild);
    }
}

// Function to format date to local timezone
function formatDate(dateString) {
    if (!dateString || dateString === '????' || dateString === 'Invalid Date') {
        return 'Unknown';
    }
    try {
        const date = new Date(dateString);
        return date.toLocaleString();
    } catch (e) {
        console.error('Date parsing error:', e);
        return 'Invalid Date';
    }
}

// Function to show tab and update URL
async function showTab(tabName) {
    // Update URL hash without triggering scroll
    history.replaceState(null, null, `#${tabName}`);
    
    // Update active tab in navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(`'${tabName}'`)) {
            link.classList.add('active');
        }
    });

    const envContent = document.getElementById('envContent');
    
    if (tabName === 'home') {
        envContent.innerHTML = `
            <div class="home-content">
                <h1>Welcome to FortniteTools.com</h1>
                <div class="feature-section">
                    <h2>Track Fortnite Build Versions</h2>
                    <p>Stay up-to-date with the latest Fortnite builds across all environments:</p>
                    <ul>
                        <li>Live Builds - Monitor production servers and live broadcasting</li>
                        <li>Testing & Playtest - Track QA, daily testing, and playtest environments</li>
                        <li>Events & Staging - Follow special event servers and staging builds</li>
                    </ul>
                </div>
                
                <div class="feature-section">
                    <h2>Why Use FortniteTools.com?</h2>
                    <div class="features-grid">
                        <div class="feature-item">
                            <h3>Real-Time Updates</h3>
                            <p>Our data is continuously updated to show you the latest build information.</p>
                        </div>
                        <div class="feature-item">
                            <h3>Comprehensive Tracking</h3>
                            <p>Monitor builds across development, testing, and live environments.</p>
                        </div>
                        <div class="feature-item">
                            <h3>Easy to Use</h3>
                            <p>Clean, intuitive interface that shows you exactly what you need to know.</p>
                        </div>
                        <div class="feature-item">
                            <h3>Always Available</h3>
                            <p>Access build information 24/7 from any device.</p>
                        </div>
                    </div>
                </div>
                
                <div class="feature-section">
                    <h2>Getting Started</h2>
                    <p>Use the navigation menu above to explore different sections:</p>
                    <ul>
                        <li><strong>Live Builds:</strong> Current production and broadcasting versions</li>
                        <li><strong>Testing:</strong> QA and daily testing environments</li>
                        <li><strong>Playtest:</strong> Development playtest environments</li>
                        <li><strong>Events:</strong> Special event server builds</li>
                        <li><strong>Staging:</strong> Staging environment versions</li>
                    </ul>
                </div>

                <div class="update-info">
                    <p>Data updates every 60 seconds. All times shown in your local timezone.</p>
                </div>
            </div>
        `;
        return;
    }

    // Show loader while fetching data
    envContent.innerHTML = `
        <div class="spinner-border text-primary" role="status" id="loader">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="loading-text">Loading environment data...</div>
    `;

    // Use cached data if available, otherwise fetch new data
    if (cachedData) {
        displayEnvironments(cachedData, tabName);
    } else {
        await updateData();
    }
}

// Function to handle initial load and refresh
async function initializePage() {
    // Get tab from URL hash or default to 'home'
    const hash = window.location.hash.slice(1);
    
    // If no hash or invalid hash, set to home
    if (!hash || !ENVIRONMENTS[hash]) {
        history.replaceState(null, null, '#home');
        await showTab('home');
    } else {
        await showTab(hash);
    }
}

// Function to update the timer display
function updateTimerDisplay() {
    const timerElement = document.querySelector('.global-timer');
    if (!timerElement) return;

    // Add time-based classes for styling
    let timeClass = 'normal';
    if (globalSecondsLeft <= 10) {
        timeClass = 'low';
    } else if (globalSecondsLeft <= 30) {
        timeClass = 'medium';
    }

    timerElement.innerHTML = `
        <div class="update-status">
            <span data-time="${timeClass}">${globalSecondsLeft}s</span>
        </div>
    `;

    // Decrease the counter
    globalSecondsLeft--;

    // If it's time for the next update
    if (globalSecondsLeft <= 0) {
        // Refresh the page
        window.location.reload();
    }
}

// Function to start timer
function startTimer() {
    if (isTimerRunning) return; // Don't start if already running
    
    // Create global timer if it doesn't exist
    createGlobalTimer();
    
    // Start new timer update
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
    isTimerRunning = true;
}

// Function to fetch and update data
async function updateData() {
    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(API_URL));
        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        cachedData = data;
        
        // Get current tab from URL
        const currentTab = window.location.hash.slice(1) || 'home';
        
        // Update content if not on home page
        if (currentTab !== 'home') {
            displayEnvironments(data, currentTab);
        }

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        const envContent = document.getElementById('envContent');
        envContent.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <div class="alert-content">
                    <h4 class="alert-heading">Unable to load data</h4>
                    <p>There was an error loading the environment data. Please try again later.</p>
                    <hr>
                    <p class="mb-0">Error details: ${error.message}</p>
                    <button class="retry-button" onclick="retryLoad()">Retry</button>
                </div>
            </div>
        `;
    }
}

// Add retry functionality
async function retryLoad() {
    const currentTab = window.location.hash.slice(1) || 'home';
    await showTab(currentTab);
}

// Function to display environments
function displayEnvironments(data, category) {
    const envContent = document.getElementById('envContent');
    const environments = ENVIRONMENTS[category].envs;
    
    let html = `
        <h2 class="category-title">${ENVIRONMENTS[category].title}</h2>
        <div class="data-grid">`;
    
    environments.forEach(env => {
        const envData = data[env] || {};
        html += `
            <div class="data-item">
                <h3 class="data-title">${env}</h3>
                <span class="data-label">Version:</span>
                <span class="data-value">${envData.version || '????'}</span>
                <span class="data-label">Build:</span>
                <span class="data-value">${envData.build || '??'}</span>
                <span class="data-label">Branch:</span>
                <span class="data-value">${envData.branch || '????'}</span>
                <span class="data-label">Build Date:</span>
                <span class="data-value">${formatDate(envData.buildDate)}</span>
            </div>`;
    });
    
    html += '</div>';
    envContent.innerHTML = html;
}

async function fetchData() {
    if (cachedData) return cachedData;

    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(API_URL));
        if (!response.ok) {
            throw new Error('API request failed');
        }
        cachedData = await response.json();
        return cachedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Show user-friendly error in the UI
        document.getElementById('envContent').innerHTML = `
            <div class="alert alert-danger">
                <h5 class="alert-heading">Unable to load data</h5>
                <p>We're having trouble connecting to our data source. Please try again later.</p>
                <button class="btn btn-outline-danger mt-2" onclick="retryFetch()">Try Again</button>
            </div>
        `;
        return null;
    }
}

function retryFetch() {
    cachedData = null; // Clear cache to force new fetch
    const currentTab = document.querySelector('.nav-link.active').getAttribute('onclick').match(/'(.*?)'/)[1];
    showTab(currentTab);
}

// Clean up intervals when page is unloaded
window.addEventListener('beforeunload', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Start the timer once
    startTimer();
    
    // If no hash is present, add #home
    if (!window.location.hash) {
        window.location.hash = 'home';
    }
    
    initializePage();
});

// Handle browser back/forward buttons and refresh
window.addEventListener('hashchange', () => {
    initializePage();
});