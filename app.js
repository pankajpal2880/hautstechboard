const currency = (value) => `$${Math.round(value).toLocaleString()}`;

const departmentReports = {
  sales: {
    source: 'Sales department page / submitted sales report',
    updatedAt: '2026-02-27 09:15',
    matrix: {
      today: { openRfqNum: 8, openRfqVal: 42000, convPoNum: 3, convPoVal: 18000, poRecNum: 2, poRecVal: 12500 },
      month: { openRfqNum: 96, openRfqVal: 510000, convPoNum: 38, convPoVal: 234000, poRecNum: 52, poRecVal: 355000 },
      year: { openRfqNum: 1080, openRfqVal: 5780000, convPoNum: 446, convPoVal: 2690000, poRecNum: 615, poRecVal: 4180000 },
    },
  },
  purchase: {
    source: 'Purchase department page / submitted purchase report',
    updatedAt: '2026-02-27 09:10',
  },
  operations: {
    source: 'Operations department page / submitted operations report',
    updatedAt: '2026-02-27 08:45',
  },
  marketing: {
    source: 'Marketing department page / submitted marketing report',
    updatedAt: '2026-02-27 08:30',
  },
};

const timelineData = {
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rfqOpenNum: [2, 3, 4, 3, 5, 4, 6],
    rfqConvNum: [1, 1, 2, 1, 2, 2, 3],
    poRecNum: [0, 1, 1, 1, 2, 1, 2],
    poRecVal: [0, 3000, 5200, 4100, 8800, 6700, 12000],
  },
  monthly: {
    labels: ['W1', 'W2', 'W3', 'W4'],
    rfqOpenNum: [18, 22, 27, 29],
    rfqConvNum: [7, 8, 11, 12],
    poRecNum: [10, 13, 14, 15],
    poRecVal: [76000, 86000, 92000, 101000],
  },
  yearly: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    rfqOpenNum: [240, 260, 275, 305],
    rfqConvNum: [94, 108, 116, 128],
    poRecNum: [130, 146, 160, 179],
    poRecVal: [960000, 1010000, 1070000, 1140000],
  },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#334155', font: { family: 'Inter' } } } },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,.18)' } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148,163,184,.18)' } },
  },
};

const rfqChart = new Chart(document.getElementById('rfqChart'), {
  type: 'line',
  data: {
    labels: timelineData.monthly.labels,
    datasets: [
      { label: 'Open RFQ (Numbers)', data: timelineData.monthly.rfqOpenNum, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.2)', fill: true, tension: .35 },
      { label: 'RFQ converted to PO (Numbers)', data: timelineData.monthly.rfqConvNum, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,.2)', fill: true, tension: .35 },
    ],
  },
  options: chartOptions,
});

const poChart = new Chart(document.getElementById('poChart'), {
  type: 'bar',
  data: {
    labels: timelineData.monthly.labels,
    datasets: [
      { label: 'PO received (Numbers)', data: timelineData.monthly.poRecNum, backgroundColor: '#f97316', borderRadius: 7 },
      { label: 'PO received (Value/1000)', data: timelineData.monthly.poRecVal.map((value) => Math.round(value / 1000)), backgroundColor: '#8b5cf6', borderRadius: 7 },
    ],
  },
  options: chartOptions,
});

const setText = (id, value) => {
  document.getElementById(id).textContent = value;
};

const renderOverview = () => {
  const sales = departmentReports.sales.matrix;

  setText('m-open-rfq-num-today', sales.today.openRfqNum);
  setText('m-open-rfq-val-today', currency(sales.today.openRfqVal));
  setText('m-conv-po-num-today', sales.today.convPoNum);
  setText('m-conv-po-val-today', currency(sales.today.convPoVal));
  setText('m-po-rec-num-today', sales.today.poRecNum);
  setText('m-po-rec-val-today', currency(sales.today.poRecVal));

  setText('m-open-rfq-num-month', sales.month.openRfqNum);
  setText('m-open-rfq-val-month', currency(sales.month.openRfqVal));
  setText('m-conv-po-num-month', sales.month.convPoNum);
  setText('m-conv-po-val-month', currency(sales.month.convPoVal));
  setText('m-po-rec-num-month', sales.month.poRecNum);
  setText('m-po-rec-val-month', currency(sales.month.poRecVal));

  setText('m-open-rfq-num-year', sales.year.openRfqNum);
  setText('m-open-rfq-val-year', currency(sales.year.openRfqVal));
  setText('m-conv-po-num-year', sales.year.convPoNum);
  setText('m-conv-po-val-year', currency(sales.year.convPoVal));
  setText('m-po-rec-num-year', sales.year.poRecNum);
  setText('m-po-rec-val-year', currency(sales.year.poRecVal));

  const totalOpenCount = sales.today.openRfqNum + sales.month.openRfqNum + sales.year.openRfqNum;
  const totalOpenValue = sales.today.openRfqVal + sales.month.openRfqVal + sales.year.openRfqVal;
  const totalConvCount = sales.today.convPoNum + sales.month.convPoNum + sales.year.convPoNum;
  const totalPoValue = sales.today.poRecVal + sales.month.poRecVal + sales.year.poRecVal;

  setText('kpi-rfq-open-count', totalOpenCount.toLocaleString());
  setText('kpi-rfq-open-value', currency(totalOpenValue));
  setText('kpi-conv-count', totalConvCount.toLocaleString());
  setText('kpi-po-value', currency(totalPoValue));

  setText('sales-source-note', `${departmentReports.sales.source}. Updated: ${departmentReports.sales.updatedAt}`);
  setText('purchase-source-note', `${departmentReports.purchase.source}. Updated: ${departmentReports.purchase.updatedAt}`);
  setText('ops-source-note', `${departmentReports.operations.source}. Updated: ${departmentReports.operations.updatedAt}`);
  setText('marketing-source-note', `${departmentReports.marketing.source}. Updated: ${departmentReports.marketing.updatedAt}`);

  setText('last-sync', `Last sync: ${departmentReports.sales.updatedAt}`);
};

const updateRfqChart = () => {
  const period = document.getElementById('rfq-period').value;
  const data = timelineData[period];
  rfqChart.data.labels = data.labels;
  rfqChart.data.datasets[0].data = data.rfqOpenNum;
  rfqChart.data.datasets[1].data = data.rfqConvNum;
  rfqChart.update();
};

const updatePoChart = () => {
  const period = document.getElementById('po-period').value;
  const data = timelineData[period];
  poChart.data.labels = data.labels;
  poChart.data.datasets[0].data = data.poRecNum;
  poChart.data.datasets[1].data = data.poRecVal.map((value) => Math.round(value / 1000));
  poChart.update();
};

document.getElementById('rfq-period').addEventListener('change', updateRfqChart);
document.getElementById('po-period').addEventListener('change', updatePoChart);

renderOverview();
