class SettingsManager {
    constructor() {
        this.defaultSettings = {
            theme: {
                darkMode: true,
                accentColor: 'blue'
            },
            preferences: {
                autoRefresh: false,
                showNotifications: true
            }
        };
        
        this.settings = this.defaultSettings;
        this.loadSettings();
        this.initializeEventListeners();
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('fortniteToolsSettings');
            if (savedSettings) {
                this.settings = { ...this.defaultSettings, ...JSON.parse(savedSettings) };
            }
            this.applySettings();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('fortniteToolsSettings', JSON.stringify(this.settings));
            this.applySettings();
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    applySettings() {
        // Apply dark mode
        document.body.classList.toggle('dark-theme', this.settings.theme.darkMode);
        
        // Update checkboxes to match current settings
        document.querySelectorAll('input[type="checkbox"][data-setting]').forEach(checkbox => {
            const [category, setting] = checkbox.dataset.setting.split('.');
            if (this.settings[category] && setting in this.settings[category]) {
                checkbox.checked = this.settings[category][setting];
            }
        });

        // Update radio buttons
        document.querySelectorAll('input[type="radio"][data-setting]').forEach(radio => {
            const [category, setting] = radio.dataset.setting.split('.');
            if (this.settings[category] && this.settings[category][setting] === radio.value) {
                radio.checked = true;
            }
        });
    }

    initializeEventListeners() {
        // Listen for settings changes
        document.querySelectorAll('input[data-setting]').forEach(input => {
            input.addEventListener('change', (e) => {
                const [category, setting] = e.target.dataset.setting.split('.');
                if (input.type === 'checkbox') {
                    this.settings[category][setting] = input.checked;
                } else if (input.type === 'radio') {
                    this.settings[category][setting] = input.value;
                }
                this.saveSettings();
            });
        });

        // Save button functionality
        const saveButton = document.querySelector('.settings-button.save');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});
