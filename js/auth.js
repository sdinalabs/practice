// === js/auth.js ===
const API_URL = 'http://localhost:3000/api';

if (DB.getUser()) window.location.replace('chat.html'); // авторедирект
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const t = tab.dataset.tab;
        document.getElementById('login-form').classList.toggle('hidden', t !== 'login');
        document.getElementById('register-form').classList.toggle('hidden', t !== 'register');
    });
});

async function authReq(endpoint, body) {
    const errEl = document.getElementById('auth-error');
    errEl.classList.add('hidden');
    try {
        const r = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || 'Ошибка');
        return d;
    } catch (e) { errEl.textContent = e.message; errEl.classList.remove('hidden'); return null; }
}

document.getElementById('login-btn').addEventListener('click', async () => {
    const d = await authReq('login', {
        username: document.getElementById('l-username').value.trim(),
        password: document.getElementById('l-password').value
    });
    if (d) { DB.saveUser(d.user, d.token); window.location.replace('chat.html'); }
});

document.getElementById('register-btn').addEventListener('click', async () => {
    const d = await authReq('register', {
        username: document.getElementById('r-username').value.trim(),
        email: document.getElementById('r-email').value.trim(),
        password: document.getElementById('r-password').value
    });
    if (d) { DB.saveUser(d.user, d.token); window.location.replace('chat.html'); }
});