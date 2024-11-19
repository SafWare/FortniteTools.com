function setErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.className = 'error-message';
    } else {
        console.error('Error message element not found');
    }
}

function setSuccessMessage(message) {
    const successMessageElement = document.getElementById('success-message'); // Use a different ID for success messages
    if (successMessageElement) {
        successMessageElement.textContent = message;
        successMessageElement.className = 'success-message';
    } else {
        console.error('Success message element not found');
    }
}

function displayResult(username, accountId, platform) {
    console.log('Displaying result:', { username, accountId, platform }); // Debug log
    
    // Get the result display element
    const resultDisplay = document.getElementById('result-display');
    if (!resultDisplay) {
        console.error('Result display element not found');
        return;
    }
    
    // Clear previous results
    resultDisplay.innerHTML = '';
    
    // Create table structure
    const table = document.createElement('table');
    table.className = 'result-table';
    
    // Add table content
    table.innerHTML = `
        <thead>
            <tr>
                <th>Username</th>
                <th>Account ID</th>
                <th>Platform</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${username}</td>
                <td>${accountId}</td>
                <td>${platform}</td>
            </tr>
        </tbody>
    `;
    
    // Add table to display
    resultDisplay.appendChild(table);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lookupForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const usernameInput = document.getElementById('username');
            const platformSelect = document.getElementById('platform');
            
            // Check if elements exist before accessing their values
            if (!usernameInput) {
                console.error('Username input not found');
                return;
            }

            const username = usernameInput.value.trim();
            // Only access platform if the select exists
            const platform = platformSelect ? platformSelect.value : 'epic';

            if (!username) {
                setErrorMessage('Please enter a username.');
                return;
            }

            fetch(`https://fortniteapi.io/v1/lookup?username=${username}&platform=${platform}`, {
                headers: {
                    'Authorization': '5f219c60-7b855efc-a0a28665-46ee1c3f'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response data:', data);
                if (data.result && data.account_id) {
                    displayResult(username, data.account_id, platform);
                } else {
                    setErrorMessage('No account found.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessage('An error occurred while fetching data.');
            });
        });
    }
});
