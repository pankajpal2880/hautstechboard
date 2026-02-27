let salesEntries = [12000, 18500, 9700];
let purchaseEntries = [8000, 6200, 9100];
let leadEntries = [44, 58, 63];

const currency = (value) => `$${Math.round(value).toLocaleString()}`;
const statusNode = document.getElementById('status-msg');

const showStatus = (text, color = '#64748b') => {
  statusNode.textContent = text;
  statusNode.style.color = color;
};

const renderChips = (nodeId, prefix, values) => {
  const node = document.getElementById(nodeId);
  node.innerHTML = values
    .map((value, index) => `<span class="chip">${prefix} ${index + 1}: ${value}</span>`)
    .join('');
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#334155', font: { family: 'Inter' } } } },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,.2)' } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,.2)' } },
  },
};

const salesChart = new Chart(document.getElementById('salesChart'), {
  type: 'line',
  data: {
    labels: salesEntries.map((_, i) => `Sale ${i + 1}`),
    datasets: [{
      label: 'Sales',
      data: salesEntries,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,.2)',
      fill: true,
      tension: .35,
    }],
  },
  options: chartOptions,
});

const purchaseChart = new Chart(document.getElementById('purchaseChart'), {
  type: 'bar',
  data: {
    labels: purchaseEntries.map((_, i) => `Purchase ${i + 1}`),
    datasets: [{
      label: 'Purchases',
      data: purchaseEntries,
      backgroundColor: '#f97316',
      borderRadius: 7,
    }],
  },
  options: { ...chartOptions, plugins: { legend: { display: false } } },
});

const leadChart = new Chart(document.getElementById('leadChart'), {
  type: 'line',
  data: {
    labels: leadEntries.map((_, i) => `Lead KPI ${i + 1}`),
    datasets: [{
      label: 'Leads',
      data: leadEntries,
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22,163,74,.18)',
      fill: true,
      tension: .35,
    }],
  },
  options: chartOptions,
});

const refreshKpis = () => {
  const salesTotal = salesEntries.reduce((sum, v) => sum + v, 0);
  const purchaseTotal = purchaseEntries.reduce((sum, v) => sum + v, 0);
  const leadTotal = leadEntries.reduce((sum, v) => sum + v, 0);
  const balance = salesTotal - purchaseTotal;

  document.getElementById('kpi-sales').textContent = currency(salesTotal);
  document.getElementById('kpi-purchase').textContent = currency(purchaseTotal);
  document.getElementById('kpi-lead').textContent = leadTotal.toLocaleString();
  document.getElementById('kpi-balance').textContent = currency(balance);

  document.getElementById('kpi-sales-count').textContent = `${salesEntries.length} entries`;
  document.getElementById('kpi-purchase-count').textContent = `${purchaseEntries.length} entries`;
  document.getElementById('kpi-lead-count').textContent = `${leadEntries.length} entries`;

  const balanceNode = document.getElementById('kpi-balance-status');
  balanceNode.textContent = balance >= 0 ? 'Healthy positive balance' : 'Negative balance';
  balanceNode.style.color = balance >= 0 ? '#16a34a' : '#dc2626';
};

const refreshCharts = () => {
  salesChart.data.labels = salesEntries.map((_, i) => `Sale ${i + 1}`);
  salesChart.data.datasets[0].data = salesEntries;
  salesChart.update();

  purchaseChart.data.labels = purchaseEntries.map((_, i) => `Purchase ${i + 1}`);
  purchaseChart.data.datasets[0].data = purchaseEntries;
  purchaseChart.update();

  leadChart.data.labels = leadEntries.map((_, i) => `Lead KPI ${i + 1}`);
  leadChart.data.datasets[0].data = leadEntries;
  leadChart.update();
};

const addValue = (inputId, targetArray, label) => {
  const input = document.getElementById(inputId);
  const value = Number(input.value);
  if (!Number.isFinite(value) || value < 0) {
    showStatus(`Please enter a valid ${label} value.`, '#dc2626');
    return;
  }
  targetArray.push(value);
  input.value = '';
  renderChips('sales-list', 'Sale', salesEntries);
  renderChips('purchase-list', 'Purchase', purchaseEntries);
  renderChips('lead-list', 'Lead', leadEntries);
  refreshCharts();
  refreshKpis();
  showStatus(`${label} added successfully.`, '#16a34a');
};

const parseReport = (raw) => {
  const data = JSON.parse(raw);
  const sanitize = (arr) => Array.isArray(arr)
    ? arr.map(Number).filter((v) => Number.isFinite(v) && v >= 0)
    : null;

  const sales = sanitize(data.sales);
  const purchase = sanitize(data.purchase);
  const lead = sanitize(data.lead);

  if (!sales || !purchase || !lead) {
    throw new Error('Report must contain sales, purchase, and lead arrays.');
  }

  salesEntries = sales;
  purchaseEntries = purchase;
  leadEntries = lead;
};

document.getElementById('add-sale-btn').addEventListener('click', () => addValue('sale-input', salesEntries, 'Sale'));
document.getElementById('add-purchase-btn').addEventListener('click', () => addValue('purchase-input', purchaseEntries, 'Purchase'));
document.getElementById('add-lead-btn').addEventListener('click', () => addValue('lead-input', leadEntries, 'Lead'));

document.getElementById('apply-report-btn').addEventListener('click', () => {
  const raw = document.getElementById('report-text').value.trim();
  if (!raw) {
    showStatus('Paste report JSON or upload a JSON file.', '#dc2626');
    return;
  }
  try {
    parseReport(raw);
    renderChips('sales-list', 'Sale', salesEntries);
    renderChips('purchase-list', 'Purchase', purchaseEntries);
    renderChips('lead-list', 'Lead', leadEntries);
    refreshCharts();
    refreshKpis();
    showStatus('Report applied successfully.', '#16a34a');
  } catch (error) {
    showStatus(error.message, '#dc2626');
  }
});

document.getElementById('report-file').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const raw = String(reader.result || '');
    document.getElementById('report-text').value = raw;
    try {
      parseReport(raw);
      renderChips('sales-list', 'Sale', salesEntries);
      renderChips('purchase-list', 'Purchase', purchaseEntries);
      renderChips('lead-list', 'Lead', leadEntries);
      refreshCharts();
      refreshKpis();
      showStatus('Uploaded report applied successfully.', '#16a34a');
    } catch (error) {
      showStatus(error.message, '#dc2626');
    }
  };
  reader.readAsText(file);
});

renderChips('sales-list', 'Sale', salesEntries);
renderChips('purchase-list', 'Purchase', purchaseEntries);
renderChips('lead-list', 'Lead', leadEntries);
refreshCharts();
refreshKpis();
showStatus('Dashboard loaded.');
