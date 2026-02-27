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
const salesLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const marketingLabels = ['SEO', 'Email', 'Social', 'Paid Ads', 'Referral'];
const operationsLabels = ['Logistics', 'Support', 'Infrastructure', 'Quality'];

const sharedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#374151',
        font: { family: 'Inter' },
        font: {
          family: 'Inter',
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#6b7280' },
      grid: { color: 'rgba(148, 163, 184, 0.18)' },
    },
    y: {
      ticks: { color: '#6b7280' },
      grid: { color: 'rgba(148, 163, 184, 0.18)' },
    },
  },
};

const salesChart = new Chart(document.getElementById('salesLineChart'), {
  type: 'line',
  data: {
    labels: salesEntries.map((_, index) => `Sale ${index + 1}`),
    datasets: [{ label: 'Sales ($)', data: salesEntries, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.2)', fill: true, tension: 0.3 }],
    labels: salesLabels,
new Chart(document.getElementById('salesLineChart'), {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales ($k)',
        data: [42, 50, 48, 64, 72, 69, 81],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
      },
    ],
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
    labels: marketingLabels,
new Chart(document.getElementById('marketingBarChart'), {
  type: 'bar',
  data: {
    labels: ['SEO', 'Email', 'Social', 'Paid Ads', 'Referral'],
    datasets: [
      {
        label: 'Leads',
        data: [160, 120, 210, 180, 95],
        backgroundColor: ['#2563eb', '#0ea5e9', '#22c55e', '#f59e0b', '#a855f7'],
        borderRadius: 8,
      },
    ],
  },
  options: {
    ...sharedOptions,
    plugins: { legend: { display: false } },
  },
});

const operationsChart = new Chart(document.getElementById('operationsPieChart'), {
  type: 'pie',
  data: {
    labels: operationsLabels,

    < codex/upgrade-repository-to-modern-admin-dashboard-aqygx2
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

renderChips('sales-list', 'Sale', salesEntries);
renderChips('purchase-list', 'Purchase', purchaseEntries);
renderChips('lead-list', 'Lead', leadEntries);
refreshCharts();
refreshKpis();
showStatus('Dashboard loaded.');
renderEntryList('sales-list', salesEntries, 'Sale');
renderEntryList('marketing-list', marketingEntries, 'KPI');
refreshCharts();
refreshKpis();
new Chart(document.getElementById('operationsPieChart'), {
  type: 'pie',
  data: {
    labels: ['Logistics', 'Support', 'Infrastructure', 'Quality'],
    datasets: [
      {
        label: 'Operations Split',
        data: [35, 25, 22, 18],
        backgroundColor: ['#2563eb', '#16a34a', '#f97316', '#a855f7'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { family: 'Inter' },
        },
      },
    },
  },
});

const parseNumberList = (value, expectedLength) => {
  const values = value.split(',').map((item) => Number(item.trim()));
  const valid = values.length === expectedLength && values.every((item) => Number.isFinite(item) && item >= 0);
  return valid ? values : null;
};

const formatCurrency = (value) => `$${Math.round(value).toLocaleString()}`;

const updateDashboard = () => {
  const salesInput = document.getElementById('sales-values').value;
  const marketingInput = document.getElementById('marketing-values').value;
  const operationsInput = document.getElementById('operations-values').value;
  const revenueValue = Number(document.getElementById('finance-revenue').value);
  const expenseValue = Number(document.getElementById('finance-expense').value);

  const salesValues = parseNumberList(salesInput, salesLabels.length);
  const marketingValues = parseNumberList(marketingInput, marketingLabels.length);
  const operationsValues = parseNumberList(operationsInput, operationsLabels.length);

  const isFinanceValid = Number.isFinite(revenueValue) && Number.isFinite(expenseValue) && revenueValue >= 0 && expenseValue >= 0;

  const messageNode = document.getElementById('message');
  if (!salesValues || !marketingValues || !operationsValues || !isFinanceValid) {
    messageNode.textContent = 'Please enter valid non-negative values for all modules.';
    messageNode.style.color = '#dc2626';
    return;
  }

  salesChart.data.datasets[0].data = salesValues;
  salesChart.update();

  marketingChart.data.datasets[0].data = marketingValues;
  marketingChart.update();

  operationsChart.data.datasets[0].data = operationsValues;
  operationsChart.update();

  const totalSales = salesValues[salesValues.length - 1] * 1000;
  const totalLeads = marketingValues.reduce((sum, value) => sum + value, 0);
  const operationsTotal = operationsValues.reduce((sum, value) => sum + value, 0);
  const netPosition = revenueValue - expenseValue;

  document.getElementById('kpi-sales').textContent = formatCurrency(totalSales);
  document.getElementById('kpi-marketing').textContent = totalLeads.toLocaleString();
  document.getElementById('kpi-operations').textContent = `${operationsTotal}%`;
  document.getElementById('kpi-finance').textContent = formatCurrency(netPosition);

  const financeTrendNode = document.getElementById('kpi-finance-trend');
  financeTrendNode.textContent = netPosition >= 0 ? 'Positive net position' : 'Negative net position';
  financeTrendNode.className = `kpi-trend ${netPosition >= 0 ? 'positive' : 'negative'}`;

  messageNode.textContent = 'Dashboard updated successfully from module inputs.';
  messageNode.style.color = '#16a34a';
};

document.getElementById('apply-values-btn').addEventListener('click', updateDashboard);

