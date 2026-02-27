const operationsLabels = ['Logistics', 'Support', 'Infrastructure', 'Quality'];

let salesEntries = [12000, 9000, 10500, 13000];
let marketingEntries = [45, 55, 70, 62, 80];

const sharedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#374151', font: { family: 'Inter' } } } },
  scales: {
    x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(148, 163, 184, 0.18)' } },
    y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(148, 163, 184, 0.18)' } },
  },
};

const salesChart = new Chart(document.getElementById('salesLineChart'), {
  type: 'line',
  data: {
    labels: salesEntries.map((_, index) => `Sale ${index + 1}`),
    datasets: [{ label: 'Sales ($)', data: salesEntries, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.2)', fill: true, tension: 0.3 }],
  },
  options: sharedOptions,
});

const marketingChart = new Chart(document.getElementById('marketingBarChart'), {
  type: 'bar',
  data: {
    labels: marketingEntries.map((_, index) => `KPI ${index + 1}`),
    datasets: [{ label: 'Marketing KPI', data: marketingEntries, backgroundColor: '#0ea5e9', borderRadius: 8 }],
  },
  options: { ...sharedOptions, plugins: { legend: { display: false } } },
});

const operationsChart = new Chart(document.getElementById('operationsPieChart'), {
  type: 'pie',
  data: {
    labels: operationsLabels,
    datasets: [{ label: 'Operations Split', data: [35, 25, 22, 18], backgroundColor: ['#2563eb', '#16a34a', '#f97316', '#a855f7'], borderColor: '#fff', borderWidth: 2 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
});

const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;
const parseNumberList = (value, expectedLength) => {
  const values = value.split(',').map((item) => Number(item.trim()));
  return values.length === expectedLength && values.every((item) => Number.isFinite(item) && item >= 0) ? values : null;
};

const renderEntryList = (containerId, values, prefix) => {
  document.getElementById(containerId).innerHTML = values.map((value, index) => `<span class="entry-chip">${prefix} ${index + 1}: ${value}</span>`).join('');
};

const refreshCharts = () => {
  salesChart.data.labels = salesEntries.map((_, index) => `Sale ${index + 1}`);
  salesChart.data.datasets[0].data = salesEntries;
  salesChart.update();

  marketingChart.data.labels = marketingEntries.map((_, index) => `KPI ${index + 1}`);
  marketingChart.data.datasets[0].data = marketingEntries;
  marketingChart.update();
};

const refreshKpis = () => {
  const salesTotal = salesEntries.reduce((sum, value) => sum + value, 0);
  const marketingTotal = marketingEntries.reduce((sum, value) => sum + value, 0);
  const revenue = Number(document.getElementById('finance-revenue').value) || 0;
  const expense = Number(document.getElementById('finance-expense').value) || 0;
  const net = revenue - expense;

  document.getElementById('kpi-sales').textContent = formatCurrency(salesTotal);
  document.getElementById('kpi-marketing').textContent = marketingTotal.toLocaleString();
  document.getElementById('kpi-finance').textContent = formatCurrency(net);

  const trendNode = document.getElementById('kpi-finance-trend');
  trendNode.textContent = net >= 0 ? 'Positive net position' : 'Negative net position';
  trendNode.className = `kpi-trend ${net >= 0 ? 'positive' : 'negative'}`;
};

const showMessage = (text, color) => {
  const messageNode = document.getElementById('message');
  messageNode.textContent = text;
  messageNode.style.color = color;
};

document.getElementById('add-sale-btn').addEventListener('click', () => {
  const input = document.getElementById('sale-entry');
  const value = Number(input.value);
  if (!Number.isFinite(value) || value < 0) {
    showMessage('Enter a valid non-negative sale amount.', '#dc2626');
    return;
  }
  salesEntries.push(value);
  input.value = '';
  renderEntryList('sales-list', salesEntries, 'Sale');
  refreshCharts();
  refreshKpis();
  showMessage('Sale entry added.', '#16a34a');
});

document.getElementById('add-marketing-btn').addEventListener('click', () => {
  const input = document.getElementById('marketing-entry');
  const value = Number(input.value);
  if (!Number.isFinite(value) || value < 0) {
    showMessage('Enter a valid non-negative marketing KPI value.', '#dc2626');
    return;
  }
  marketingEntries.push(value);
  input.value = '';
  renderEntryList('marketing-list', marketingEntries, 'KPI');
  refreshCharts();
  refreshKpis();
  showMessage('Marketing KPI entry added.', '#16a34a');
});

document.getElementById('apply-values-btn').addEventListener('click', () => {
  const operationsValues = parseNumberList(document.getElementById('operations-values').value, operationsLabels.length);
  const revenue = Number(document.getElementById('finance-revenue').value);
  const expense = Number(document.getElementById('finance-expense').value);
  if (!operationsValues || !Number.isFinite(revenue) || !Number.isFinite(expense) || revenue < 0 || expense < 0) {
    showMessage('Please provide valid Operations and Financial values.', '#dc2626');
    return;
  }
  operationsChart.data.datasets[0].data = operationsValues;
  operationsChart.update();
  document.getElementById('kpi-operations').textContent = `${operationsValues.reduce((sum, value) => sum + value, 0)}%`;
  refreshKpis();
  showMessage('Manual module values applied.', '#16a34a');
});

const applyReportObject = (report) => {
  if (Array.isArray(report.sales) && report.sales.length > 0) {
    const validSales = report.sales.map(Number).filter((value) => Number.isFinite(value) && value >= 0);
    if (validSales.length) {
      salesEntries = validSales;
      renderEntryList('sales-list', salesEntries, 'Sale');
    }
  }

  if (Array.isArray(report.marketing) && report.marketing.length > 0) {
    const validMarketing = report.marketing.map(Number).filter((value) => Number.isFinite(value) && value >= 0);
    if (validMarketing.length) {
      marketingEntries = validMarketing;
      renderEntryList('marketing-list', marketingEntries, 'KPI');
    }
  }

  if (Array.isArray(report.operations) && report.operations.length === operationsLabels.length) {
    const validOps = report.operations.map(Number);
    if (validOps.every((value) => Number.isFinite(value) && value >= 0)) {
      document.getElementById('operations-values').value = validOps.join(',');
      operationsChart.data.datasets[0].data = validOps;
      operationsChart.update();
      document.getElementById('kpi-operations').textContent = `${validOps.reduce((sum, value) => sum + value, 0)}%`;
    }
  }

  if (report.finance && Number.isFinite(Number(report.finance.revenue)) && Number.isFinite(Number(report.finance.expense))) {
    document.getElementById('finance-revenue').value = Number(report.finance.revenue);
    document.getElementById('finance-expense').value = Number(report.finance.expense);
  }

  refreshCharts();
  refreshKpis();
  showMessage('Report data applied to dashboard.', '#16a34a');
};

document.getElementById('apply-report-btn').addEventListener('click', () => {
  const reportText = document.getElementById('report-json').value.trim();
  if (!reportText) {
    showMessage('Paste report JSON or upload a report file first.', '#dc2626');
    return;
  }
  try {
    const report = JSON.parse(reportText);
    applyReportObject(report);
  } catch (error) {
    showMessage('Invalid JSON format in report input.', '#dc2626');
  }
});

document.getElementById('report-file').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || '');
    document.getElementById('report-json').value = text;
    try {
      const report = JSON.parse(text);
      applyReportObject(report);
    } catch (error) {
      showMessage('Uploaded report is not valid JSON.', '#dc2626');
    }
  };
  reader.readAsText(file);
});

renderEntryList('sales-list', salesEntries, 'Sale');
renderEntryList('marketing-list', marketingEntries, 'KPI');
refreshCharts();
refreshKpis();
