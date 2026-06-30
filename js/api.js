// === js/api.js ===
const API = {
    _h() { return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DB.getToken()}` }; },
    async get(path) {
        const r = await fetch(`http://localhost:3000/api${path}`, { headers: this._h() });
        if (r.status === 401) { DB.clearUser(); location.replace('index.html'); return null; }
        return r.json();
    },
    post(path, b) {
        return fetch(`http://localhost:3000/api${path}`,
            { method: 'POST', headers: this._h(), body: JSON.stringify(b) }).then(r => r.json());
    },
    getUsers() { return this.get('/users'); },
    getMessages(uid) { return this.get(`/messages/${uid}`); },
    logout() { return this.post('/logout', {}); },
};