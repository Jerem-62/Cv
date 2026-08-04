document.addEventListener('DOMContentLoaded', () => {
    /* ========== GESTION DU THÈME ========== */
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    // Vérifier le stockage local
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon(next);
    });
    
    function updateIcon(theme) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    /* ========== FORMULAIRE ========== */
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (name.length < 2) {
            showMessage('❌ Veuillez entrer un nom valide (min. 2 caractères).', 'error');
            form.querySelector('#name').focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('❌ Veuillez entrer une adresse email valide.', 'error');
            form.querySelector('#email').focus();
            return;
        }

        if (message.length < 10) {
            showMessage('❌ Votre message doit contenir au moins 10 caractères.', 'error');
            form.querySelector('#message').focus();
            return;
        }

        const honeypot = form.querySelector('input[name="_gotcha"]').value;
        if (honeypot) return;

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        formMessage.className = 'form-message';
        formMessage.textContent = '';

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.status === 429) {
                showMessage('⏳ Trop de tentatives. Veuillez réessayer dans une minute.', 'error');
                return;
            }

            if (response.ok) {
                form.reset();
                showMessage('✅ Merci ! Votre message a bien été envoyé. Je vous répondrai rapidement.', 'success');
                setTimeout(() => {
                    window.location.href = 'merci.html';
                }, 2000);
            } else {
                let errorMsg = 'Une erreur est survenue.';
                try {
                    const data = await response.json();
                    if (data.errors) {
                        errorMsg = data.errors.map(err => err.message).join(', ');
                    }
                } catch (parseErr) {
                    errorMsg = `Erreur ${response.status} : veuillez réessayer.`;
                }
                showMessage(`❌ Erreur : ${errorMsg}`, 'error');
            }
        } catch (error) {
            showMessage('❌ Problème de connexion. Veuillez réessayer plus tard.', 'error');
            console.error('Erreur réseau formulaire :', error);
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message';
        formMessage.classList.add(type, 'show');
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 8000);
        }
    }
});