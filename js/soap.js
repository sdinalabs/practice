// === js/soap.js ===
const SOAP = {
    async sendMessage(senderId, receiverId, content) {
        const fields = { senderId, receiverId, content, token: DB.getToken() };
        const inner = Object.entries(fields).map(([k, v]) => `<${k}>${v}</${k}>`).join('');
        const body = `<?xml version='1.0'?>
      <soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/'
                        xmlns:tns='http://localhost:3000/soap'>
        <soapenv:Body><tns:sendMessageRequest>${inner}</tns:sendMessageRequest></soapenv:Body>
      </soapenv:Envelope>`;
        const r = await fetch('http://localhost:3000/soap', {
            method: 'POST', headers: { 'Content-Type': 'text/xml', 'SOAPAction': 'sendMessage' }, body
        });
        const xml = new DOMParser().parseFromString(await r.text(), 'text/xml');
        return xml.querySelector('messageId')?.textContent;
    }
};