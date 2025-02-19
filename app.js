const API_URL = 'https://api.nitestats.com/v1/epic/staging/fortnite';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const ENVIRONMENTS = {
    'home': {
        title: 'Home',
        envs: []
    },
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
    },
    'privacy': {
        title: 'Privacy Notice',
        envs: []
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
let globalSecondsLeft = parseInt(localStorage.getItem('timerSeconds')) || 60;
let serverStatus = null;
let isTimerPaused = localStorage.getItem('timerPaused') === 'true';

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
        // Use the same container structure for home page loading
        envContent.innerHTML = `
            <div class="container-fluid px-4 py-4">
                <div class="row">
                    <div class="col-12">
                        <div class="loader-container">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <div class="loading-text">Loading environment data...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // After a brief delay, show the home content
        setTimeout(() => {
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
        }, 500); // Small delay to show loading
        return;
    }

    if (tabName === 'privacy') {
        envContent.innerHTML = `
            <div class="container-fluid px-4 py-4">
                <div class="privacy-content">
                    <h1>Privacy Notice</h1>
                    <p>FortniteTools.com is committed to user privacy and transparency. Here's what you should know about how this website operates:</p>
                    
                    <h2>Data Collection</h2>
                    <ul>
                        <li>This website does not collect any personal information.</li>
                        <li>We do not use cookies for tracking purposes.</li>
                        <li>We only store your timer preference locally in your browser.</li>
                    </ul>

                    <h2>Local Storage</h2>
                    <ul>
                        <li>We use your browser's local storage to remember your auto-refresh timer preference.</li>
                        <li>This data never leaves your device and is only used to maintain your preferred refresh settings.</li>
                        <li>You can clear this data at any time by clearing your browser data.</li>
                    </ul>

                    <h2>API Caching</h2>
                    <ul>
                        <li>To improve performance and reduce server load, we temporarily cache API responses in your browser's memory.</li>
                        <li>This cache is cleared when you close your browser or refresh the page.</li>
                        <li>No cached data is permanently stored or transmitted elsewhere.</li>
                    </ul>

                    <h2>Third-Party Services</h2>
                    <ul>
                        <li>We use the NiteStats API to fetch Fortnite server status and build information.</li>
                        <li>We use a CORS proxy to facilitate API requests.</li>
                        <li>All data displayed is public information from Epic Games' services.</li>
                    </ul>

                    <h2>Contact</h2>
                    <p>If you have any questions about this privacy notice, you can contact us via <a href="https://x.com/BLACKsafy" target="_blank" rel="noopener noreferrer">X/Twitter</a>.</p>
                </div>
            </div>
        `;
        return;
    }

    // Show loader while fetching data
    envContent.innerHTML = `
        <div class="container-fluid px-4 py-4">
            <div class="row">
                <div class="col-12">
                    <div class="loader-container">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <div class="loading-text">Loading environment data...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    try {
        // Always fetch fresh data when showing a tab
        const data = await fetchData();
        if (data) {
            displayEnvironments(data, tabName);
        }
    } catch (error) {
        console.error('Error loading tab:', error);
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

// Function to handle initial load and refresh
async function initializePage() {
    const envContent = document.getElementById('envContent');
    
    // Show the centered loader while initializing
    envContent.innerHTML = `
        <div class="container-fluid px-4 py-4">
            <div class="row">
                <div class="col-12">
                    <div class="loader-container">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <div class="loading-text">Loading environment data...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

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

    let timeClass = 'normal';
    if (globalSecondsLeft <= 10) {
        timeClass = 'low';
    } else if (globalSecondsLeft <= 30) {
        timeClass = 'medium';
    }

    // Make the entire timer element clickable
    timerElement.innerHTML = `
        <div class="update-status ${isTimerPaused ? 'paused' : ''}" >
            <span data-time="${timeClass}">${globalSecondsLeft}s</span>
        </div>
    `;

    if (!isTimerPaused) {
        globalSecondsLeft--;
        // Store current time
        localStorage.setItem('timerSeconds', globalSecondsLeft);
        
        if (globalSecondsLeft <= 0) {
            window.location.reload();
        }
    }
}

// Function to start timer
function startTimer() {
    if (isTimerRunning) return;
    
    createGlobalTimer();
    
    // Add click event to the entire timer element
    const timerElement = document.querySelector('.global-timer');
    if (timerElement) {
        timerElement.addEventListener('click', toggleTimer);
    }
    
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
    isTimerRunning = true;
}

// Function to fetch and update data
async function updateData() {
    await Promise.all([
        fetchServerStatus(),
        fetchData()
    ]);
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
    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(API_URL));
        if (!response.ok) {
            throw new Error('API request failed');
        }
        cachedData = await response.json();
        return cachedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function retryFetch() {
    cachedData = null; // Clear cache to force new fetch
    const currentTab = document.querySelector('.nav-link.active').getAttribute('onclick').match(/'(.*?)'/)[1];
    showTab(currentTab);
}

// Clean up intervals when page is unloaded
window.addEventListener('beforeunload', () => {
    localStorage.setItem('timerSeconds', globalSecondsLeft);
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

// Add this new function to fetch server status
async function fetchServerStatus() {
    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent('https://api.nitestats.com/v1/epic/lightswitch'));
        if (!response.ok) throw new Error('Failed to fetch server status');
        const data = await response.json();
        const fortniteStatus = data[0];
        serverStatus = {
            status: fortniteStatus.status,
            message: fortniteStatus.message
        };
        updateServerStatusDisplay();
    } catch (error) {
        console.error('Error fetching server status:', error);
        serverStatus = null;
        updateServerStatusDisplay();
    }
}

// Add this function to update the status display
function updateServerStatusDisplay() {
    const statusElement = document.getElementById('serverStatus');
    if (!statusElement) return;

    if (!serverStatus) {
        statusElement.innerHTML = `<span class="status-unknown">Status Unknown</span>`;
        return;
    }

    const isUp = serverStatus.status === 'UP';
    statusElement.innerHTML = `
        <span class="status-indicator ${isUp ? 'status-up' : 'status-down'}">
            ${isUp ? 'Fortnite Servers Online' : 'Fortnite Servers Offline'}
        </span>
    `;
}

// Add toggle timer function
function toggleTimer(event) {
    event.stopPropagation();
    isTimerPaused = !isTimerPaused;
    localStorage.setItem('timerPaused', isTimerPaused);
    updateTimerDisplay();
}

// Reset timer when it reaches 0
function resetTimer() {
    globalSecondsLeft = 60;
    localStorage.setItem('timerSeconds', globalSecondsLeft);
    updateTimerDisplay();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    startTimer();
    await fetchServerStatus();
    
    // Get the current hash or default to 'home'
    const hash = window.location.hash.slice(1) || 'home';
    
    // Show the appropriate tab
    await showTab(hash);
});

// Handle browser back/forward buttons and refresh
window.addEventListener('hashchange', async () => {
    const hash = window.location.hash.slice(1) || 'home';
    await showTab(hash);
});