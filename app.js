const form = document.getElementById('essayForm');
const toast = document.getElementById('toast');
let timer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('show'), 3800);
}

// Эссе нәтижесін көрсететін бөлім
const resultBox = document.createElement('section');
resultBox.style.cssText = `
  max-width: 900px;
  margin: 30px auto;
  padding: 25px;
  background: white;
  border-radius: 16px;
  white-space: pre-wrap;
  line-height: 1.8;
  display: none;
`;
form.closest('.workspace').after(resultBox);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const topic = document.getElementById('topic').value.trim();
  const count = Number(document.getElementById('count').value);
  const language = document.getElementById('language').value;
  const style = document.getElementById('style').value;

  if (!topic) {
    notify('Алдымен эссе тақырыбын енгіз.');
    return;
  }

  if (!Number.isInteger(count) || count < 50 || count > 3000) {
    notify('Сөз саны 50 мен 3000 аралығында болуы керек.');
    return;
  }

  const button = form.querySelector('.primary-btn');
  button.disabled = true;
  button.textContent = 'ЭССЕ ДАЙЫНДАЛУДА...';
  resultBox.style.display = 'block';
  resultBox.textContent = '✦ AI эссе дайындап жатыр. Күте тұр...';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        wordCount: count,
        language,
        style
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Қате пайда болды.');
    }

    resultBox.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = '✦ Сенің эссең';

    const essay = document.createElement('p');
    essay.textContent = data.essay;
    essay.style.whiteSpace = 'pre-wrap';

    const copyButton = document.createElement('button');
    copyButton.textContent = '📋 Эссені көшіру';
    copyButton.className = 'primary-btn';

    copyButton.onclick = async () => {
      await navigator.clipboard.writeText(data.essay);
      notify('Эссе көшірілді!');
    };

    resultBox.append(title, essay, copyButton);
    notify('Эссе дайын!');

  } catch (error) {
    resultBox.textContent = 'Қате: ' + error.message;
    notify('Эссе жасау кезінде қате болды.');
  } finally {
    button.disabled = false;
    button.innerHTML = '✦ ЭССЕ ЖАЗУ →';
  }
});

document.getElementById('themeBtn').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.getElementById('themeBtn').textContent =
    document.body.classList.contains('dark') ? '☀' : '☾';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
