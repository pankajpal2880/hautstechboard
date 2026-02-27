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
