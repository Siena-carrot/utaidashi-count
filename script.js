const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzCRdJTYM_3C0CyVpoZaELHqDaalWeQPA38NiWAJJgfs44lbquew55Q1zo6KXWyPIMp/exec';

const validKana = [
  'あ','い','う','え','お',
  'か','き','く','け','こ',
  'さ','し','す','せ','そ',
  'た','ち','つ','て','と',
  'な','に','ぬ','ね','の',
  'は','ひ','ふ','へ','ほ',
  'ま','み','む','め','も',
  'や','ゆ','よ',
  'ら','り','る','れ','ろ',
  'わ','を','ん'
];

let currentData = [];

async function fetchAndRender() {
  try {
    const res = await fetch(SCRIPT_URL);
    if (!res.ok) throw new Error('データ取得に失敗しました');
    const rawData = await res.json(); // [{ name: 'か', count: 3 }, ...]

    // 五十音に含まれるものだけを抽出
    const filtered = rawData.filter(item => validKana.includes(item.name));

    // 少ない順にソートして表示
    const sorted = [...filtered].sort((a, b) => a.count - b.count);

    currentData = sorted;
    renderTable(sorted);
  } catch (error) {
    console.error('エラー:', error);
    const tbody = document.querySelector('#data-table tbody');
    tbody.innerHTML = '<tr><td colspan="2">データの取得に失敗しました</td></tr>';
  }
}


function renderTable(data) {
  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.name}</td><td>${row.count}</td>`;
    tbody.appendChild(tr);
  });
}

function sortTable(order) {
  let sorted;

  if (order === 'kana') {
    const gojuonOrder = validKana;
    sorted = [...currentData].sort((a, b) => {
      const ai = gojuonOrder.indexOf(a.name);
      const bi = gojuonOrder.indexOf(b.name);
      return ai - bi;
    });
  } else {
    sorted = [...currentData].sort((a, b) =>
      order === 'asc' ? a.count - b.count : b.count - a.count
    );
  }

  renderTable(sorted);
}

fetchAndRender();