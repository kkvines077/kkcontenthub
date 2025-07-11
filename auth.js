document.addEventListener('DOMContentLoaded', function() {
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const authMessage = document.getElementById('auth-message');

    // Switch between signin and signup forms
    signinTab.addEventListener('click', function(e) {
        e.preventDefault();
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        authMessage.style.display = 'none';
    });

    signupTab.addEventListener('click', function(e) {
        e.preventDefault();
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
        signupForm.classList.remove('hidden');
        signinForm.classList.add('hidden');
        authMessage.style.display = 'none';
    });

    // Handle sign in
    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store tokens and user data
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            showMessage('An error occurred. Please try again.', 'error');
        }
    });

    // Handle sign up
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Registration successful! Please sign in.', 'success');
                // Switch to sign in form
                signinTab.click();
            } else {
                showMessage(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            showMessage('An error occurred. Please try again.', 'error');
        }
    });

    function showMessage(message, type) {
        authMessage.textContent = message;
        authMessage.className = 'auth-message ' + type;
    }
});