const BOT_TOKEN = '8803744873:AAEuNEgIAXvn7jqsLn8DEEs4C_NRBnHu_Rs';
const CHAT_ID = '79295774013';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, direction } = req.body || {};
  const msg = 'Заявка на пробное занятие\n\n' +
    'Имя: ' + (name || 'не указано') + '\n' +
    'Телефон: ' + (phone || 'не указан') + '\n' +
    'Направление: ' + (direction || 'не указано');

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body = { chat_id: CHAT_ID, text: msg, parse_mode: 'HTML' };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await resp.json();

    if (data.ok) {
      res.status(200).json({ ok: true });
    } else {
      res.status(500).json({ ok: false, error: data.description });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
