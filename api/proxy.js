const BOT_TOKEN = '8960132225:AAGAgxu3YnPxkMcsXmhiAbOHXTY_2UeMkNA';
const CHAT_ID = '-1003833094595';

function readBody(req) {
  return new Promise(function(resolve, reject) {
    var chunks = [];
    req.on('data', function(c) { chunks.push(c); });
    req.on('end', function() { resolve(Buffer.concat(chunks).toString()); });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'POST') {
    try {
      var bodyStr = await readBody(req);
      var parsed;
      try { parsed = JSON.parse(bodyStr); } catch (e) {
        return res.status(200).end(JSON.stringify({ ok: false, error: 'json parse error' }));
      }
      var msg = '\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0430 \u043F\u0440\u043E\u0431\u043D\u043E\u0435 \u0437\u0430\u043D\u044F\u0442\u0438\u0435\n\n' +
        '\u0418\u043C\u044F: ' + (parsed.name || '\u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E') + '\n' +
        '\u0422\u0435\u043B\u0435\u0444\u043E\u043D: ' + (parsed.phone || '\u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D') + '\n' +
        '\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435: ' + (parsed.direction || '\u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E');

      var tResp = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'HTML' })
      });
      var tData = await tResp.json();

      if (tData && tData.ok) {
        return res.status(200).end(JSON.stringify({ ok: true }));
      }
      return res.status(200).end(JSON.stringify({ ok: false, error: tData.description || 'unknown' }));
    } catch (e) {
      return res.status(200).end(JSON.stringify({ ok: false, error: e.message }));
    }
  }

  return res.status(405).end(JSON.stringify({ error: 'Method not allowed' }));
}
