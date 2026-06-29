// Подключать ПЕРВЫМ во всех HTML-страницах
const DB = {

    saveUser(user, token) {
        localStorage.setItem('cf_user', JSON.stringify(user));
        localStorage.setItem('cf_token', token);
    },

    getUser() { const r = localStorage.getItem('cf_user'); return r ? JSON.parse(r) : null; },
    getToken() { return localStorage.getItem('cf_token') || ''; },
    clearUser() {

        ['cf_user', 'cf_token', 'cf_users_cache', 'cf_messages'].forEach(k => localStorage.removeItem(k));

    },

    // Кэш пользователей (TTL 60 сек)

    saveUsersCache(users) {
        localStorage.setItem('cf_users_cache', JSON.stringify({ users, ts: Date.now() }));
    },

    getUsersCache() {
        const raw = localStorage.getItem('cf_users_cache');
        if (!raw) return null;
        const { users, ts } = JSON.parse(raw);
        return Date.now() - ts < 60000 ? users : null;
    },

    // История сообщений

    _getAll() { return JSON.parse(localStorage.getItem('cf_messages') || '{}'); },
    _saveAll(all) { localStorage.setItem('cf_messages', JSON.stringify(all)); },
    saveMessage(withId, msg) {
        const all = this._getAll();
        if (!all[withId]) all[withId] = [];
        if (!all[withId].find(m => m.id === msg.id)) {
            all[withId].push(msg);
            if (all[withId].length > 200) all[withId].shift(); // храним макс 200
        }

        this._saveAll(all);
    },

    getMessages(withId) { return this._getAll()[withId] || []; },
    deleteMessage(withId, msgId) {
        const all = this._getAll();
        if (all[withId]) { all[withId] = all[withId].filter(m => m.id !== msgId); this._saveAll(all); }
    },

    markRead(withId) {
        const all = this._getAll();
        if (all[withId]) all[withId].forEach(m => m.isRead = true);
        this._saveAll(all);
    },

    unreadCount(withId, myId) {
        return this.getMessages(withId).filter(m => !m.isRead && m.senderId !== myId).length;
    },
};