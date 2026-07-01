// === js/websocket.js ===
let _ws = null, _timer = null;
const _handlers = [];
const WS = {
    connect() {
        if (_ws && _ws.readyState <= 1) return; // уже подключён
        _ws = new WebSocket('ws://localhost:3000');
        _ws.onopen = () => {
            clearTimeout(_timer);
            this.send({ type: 'AUTH', token: DB.getToken() }); // авторизация
        };
        _ws.onmessage = e => {
            try { const m = JSON.parse(e.data); _handlers.forEach(f => f(m)); } catch { }
        };
        _ws.onclose = () => {
            _timer = setTimeout(() => this.connect(), 4000); // реконнект через 4 с
        };
    },
    send(obj) {
        if (_ws && _ws.readyState === WebSocket.OPEN) _ws.send(JSON.stringify(obj));
    },

    on(fn) { _handlers.push(fn); },
    sendMessage(to, content) { this.send({ type: 'SEND_MESSAGE', receiverId: to, content }); },
    typing(to, isTyping) { this.send({ type: 'TYPING', receiverId: to, isTyping }); },
    readReceipt(from) { this.send({ type: 'READ_RECEIPT', senderId: from }); },
};