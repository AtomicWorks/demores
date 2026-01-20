// ==================== State Management ====================

let currentProfile = null;

// ==================== Tab Navigation ====================

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(b => {
            b.classList.remove('active');
        });

        // Add active class to clicked button and corresponding tab
        btn.classList.add('active');
        const tabId = btn.dataset.tab + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// ==================== Helper Functions ====================

function showLoading() {
    document.getElementById('loadingSpinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(endpoint, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function getProfileData() {
    return {
        weight_kg: parseFloat(document.getElementById('weight').value),
        height_cm: parseFloat(document.getElementById('height').value),
        age: parseInt(document.getElementById('age').value),
        goal: document.getElementById('goal').value,
        experience_level: document.getElementById('experience').value,
        dietary_restrictions: document.getElementById('diet').value
            .split(',')
            .map(d => d.trim())
            .filter(d => d)
    };
}

function formatResult(data, title = '') {
    let html = title ? `<h3>${title}</h3>` : '';
    
    if (typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
            const formattedKey = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            if (typeof value === 'object' && value !== null) {
                html += `<h4>${formattedKey}</h4>`;
                html += formatResult(value);
            } else if (typeof value === 'string' && value.length > 100) {
                html += `<div><strong>${formattedKey}:</strong></div><p>${value.replace(/\n/g, '<br>')}</p>`;
            } else if (Array.isArray(value)) {
                html += `<div><strong>${formattedKey}:</strong><ul>${value.map(v => `<li>${v}</li>`).join('')}</ul></div>`;
            } else {
                html += `<div class="metric"><span class="metric-label">${formattedKey}</span><span class="metric-value">${value}</span></div>`;
            }
        });
    } else {
        html += `<p>${data}</p>`;
    }

    return html;
}

// ==================== Profile Form ====================

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    try {
        const profileData = getProfileData();
        const result = await apiCall('/api/fitness/profile', 'POST', profileData);
        
        currentProfile = profileData;
        
        // Enable routine and meal prep buttons
        document.getElementById('generateRoutineBtn').disabled = false;
        document.getElementById('generateMealPrepBtn').disabled = false;

        const resultBox = document.getElementById('profileResult');
        resultBox.innerHTML = formatResult(result, 'Your Profile');
        
        // Show success message
        resultBox.innerHTML += '<p style="color: green; margin-top: 20px; font-weight: bold;">✓ Profile created successfully!</p>';
    } catch (error) {
        document.getElementById('profileResult').innerHTML = 
            `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        hideLoading();
    }
});

// ==================== Weekly Routine ====================

document.getElementById('generateRoutineBtn').addEventListener('click', async () => {
    if (!currentProfile) {
        alert('Please create a profile first!');
        return;
    }

    showLoading();

    try {
        const result = await apiCall('/api/fitness/routine', 'POST', currentProfile);
        const resultBox = document.getElementById('routineResult');
        
        let html = '<h3>📋 Your Personalized Weekly Routine</h3>';
        
        if (result.routine && result.routine.exercise_routine) {
            html += '<h4>💪 Exercise Routine</h4>';
            result.routine.exercise_routine.forEach((day, index) => {
                html += `<p><strong>Day ${index + 1}:</strong> ${JSON.stringify(day)}</p>`;
            });
        }

        if (result.routine && result.routine.meal_plan) {
            html += '<h4>🍽️ Meal Plan</h4>';
            result.routine.meal_plan.forEach((day, index) => {
                html += `<p><strong>Day ${index + 1}:</strong> ${JSON.stringify(day)}</p>`;
            });
        }

        if (result.routine && result.routine.macro_breakdown) {
            html += '<h4>📊 Macro Breakdown</h4>';
            html += formatResult(result.routine.macro_breakdown);
        }

        if (result.routine && result.routine.raw_response) {
            html += `<div style="background: white; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${result.routine.raw_response}</div>`;
        }

        resultBox.innerHTML = html;
    } catch (error) {
        document.getElementById('routineResult').innerHTML = 
            `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        hideLoading();
    }
});

// ==================== Meal Prep Guide ====================

document.getElementById('generateMealPrepBtn').addEventListener('click', async () => {
    if (!currentProfile) {
        alert('Please create a profile first!');
        return;
    }

    showLoading();

    try {
        const result = await apiCall('/api/fitness/meal-prep', 'POST', currentProfile);
        const resultBox = document.getElementById('mealPrepResult');
        
        const html = `
            <h3>🥗 Your Meal Prep Guide</h3>
            <p><strong>Daily Calories:</strong> ${result.profile.daily_calories} kcal</p>
            <div style="background: white; padding: 15px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6;">
                ${result.meal_prep_guide.replace(/\n/g, '<br>')}
            </div>
        `;
        
        resultBox.innerHTML = html;
    } catch (error) {
        document.getElementById('mealPrepResult').innerHTML = 
            `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        hideLoading();
    }
});

// ==================== Fitness Advice ====================

document.getElementById('adviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const concern = document.getElementById('concern').value;
    if (!concern) {
        alert('Please enter your fitness concern');
        return;
    }

    showLoading();

    try {
        if (!currentProfile) {
            alert('Please create a profile first!');
            hideLoading();
            return;
        }

        const data = { ...currentProfile, concern };
        const result = await apiCall('/api/fitness/advice', 'POST', data);
        
        const resultBox = document.getElementById('adviceResult');
        const html = `
            <h3>💡 Personalized Advice</h3>
            <p><strong>Your Question:</strong> ${result.concern}</p>
            <div style="background: white; padding: 15px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6;">
                ${result.advice.replace(/\n/g, '<br>')}
            </div>
        `;
        
        resultBox.innerHTML = html;
        
        // Clear form
        document.getElementById('concern').value = '';
    } catch (error) {
        document.getElementById('adviceResult').innerHTML = 
            `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        hideLoading();
    }
});

// ==================== BMI Calculator ====================

document.getElementById('bmiForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    showLoading();

    try {
        const data = {
            weight_kg: parseFloat(document.getElementById('calcWeight').value),
            height_cm: parseFloat(document.getElementById('calcHeight').value)
        };

        const result = await apiCall('/api/fitness/bmi-calculator', 'POST', data);
        
        const resultBox = document.getElementById('bmiResult');
        const categoryColor = {
            'Underweight': '#3498db',
            'Normal weight': '#27ae60',
            'Overweight': '#f39c12',
            'Obese': '#e74c3c'
        };

        const html = `
            <h3>BMI Results</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div class="metric">
                    <span class="metric-label">BMI</span>
                    <span class="metric-value">${result.bmi}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Category</span>
                    <span class="metric-value" style="color: ${categoryColor[result.category]}">${result.category}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Weight (kg)</span>
                    <span class="metric-value">${result.weight_kg}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Height (cm)</span>
                    <span class="metric-value">${result.height_cm}</span>
                </div>
            </div>
        `;
        
        resultBox.innerHTML = html;
    } catch (error) {
        document.getElementById('bmiResult').innerHTML = 
            `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        hideLoading();
    }
});

// ==================== Initialize ====================

console.log('FitBot loaded! Fill in your profile to get started.');
