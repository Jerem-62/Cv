document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // 1. État "envoi en cours"
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        formMessage.className = 'form-message';
        formMessage.textContent = '';

        const formData = new FormData(form);

        try {
            // 2. Envoi AJAX vers Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // 3. Succès → message vert + reset du formulaire
                form.reset();
                showMessage('✅ Merci ! Votre message a bien été envoyé. Je vous répondrai rapidement.', 'success');
            } else {
                // 4. Erreur serveur
                const data = await response.json();
                const errorMsg = data.errors 
                    ? data.errors.map(err => err.message).join(', ')
                    : 'Une erreur est survenue.';
                showMessage(`❌ Erreur : ${errorMsg}`, 'error');
            }
        } catch (error) {
            // 5. Erreur réseau
            showMessage('❌ Problème de connexion. Veuillez réessayer plus tard.', 'error');
        } finally {
            // 6. Toujours réactiver le bouton
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    /**
     * Affiche un message de feedback avec animation
     */
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.classList.add(type, 'show');

        // Scroll doux vers le message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Disparition automatique après 8 secondes (sauf erreur)
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 8000);
        }
    }
});