const periods = ['today', 'month', 'year'];

const getValue = (id) => Number(document.getElementById(id).value);
const setStatus = (text, error = false) => {
  const node = document.getElementById('status-msg');
  node.textContent = text;
  node.style.color = error ? '#dc2626' : '#16a34a';
};

const salesState = {
  rfqOpenNum: [8, 96, 1080],
  rfqOpenVal: [42000, 510000, 5780000],
  rfqConvNum: [3, 38, 446],
  rfqConvVal: [18000, 234000, 2690000],
  poRecNum: [2, 52, 615],
  poRecVal: [12500, 355000, 4180000],
};

const timelineData = {
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rfqOpenNum: [2, 3, 4, 3, 5, 4, 6],
    rfqOpenVal: [9000, 13000, 17000, 14500, 21000, 16500, 24000],
    rfqConvNum: [1, 1, 2, 1, 2, 2, 3],
    rfqConvVal: [5000, 6200, 9300, 7400, 10600, 9800, 14500],
    poRecNum: [0, 1, 1, 1, 2, 1, 2],
    poRecVal: [0, 3000, 5200, 4100, 8800, 6700, 12000],
  },
  monthly: {
    labels: ['W1', 'W2', 'W3', 'W4'],
    rfqOpenNum: [18, 22, 27, 29],
    rfqOpenVal: [120000, 133000, 145000, 112000],
    rfqConvNum: [7, 8, 11, 12],
    rfqConvVal: [61000, 54000, 59000, 60000],
    poRecNum: [10, 13, 14, 15],
    poRecVal: [76000, 86000, 92000, 101000],
  },
  yearly: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    rfqOpenNum: [240, 260, 275, 305],
    rfqOpenVal: [1250000, 1390000, 1510000, 1630000],
    rfqConvNum: [94, 108, 116, 128],
    rfqConvVal: [590000, 640000, 700000, 760000],
    poRecNum: [130, 146, 160, 179],
    poRecVal: [960000, 1010000, 1070000, 1140000],
  },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#334155', font: { family: 'Inter' } } },
  },
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

const loadStateFromInputs = () => {
  const ids = [
    ['rfqOpenNum', ['open-rfq-num-today', 'open-rfq-num-month', 'open-rfq-num-year']],
    ['rfqOpenVal', ['open-rfq-val-today', 'open-rfq-val-month', 'open-rfq-val-year']],
    ['rfqConvNum', ['conv-po-num-today', 'conv-po-num-month', 'conv-po-num-year']],
    ['rfqConvVal', ['conv-po-val-today', 'conv-po-val-month', 'conv-po-val-year']],
    ['poRecNum', ['po-rec-num-today', 'po-rec-num-month', 'po-rec-num-year']],
    ['poRecVal', ['po-rec-val-today', 'po-rec-val-month', 'po-rec-val-year']],
  ];

  for (const [key, inputIds] of ids) {
    const values = inputIds.map(getValue);
    if (values.some((value) => !Number.isFinite(value) || value < 0)) {
      setStatus('Please enter valid non-negative sales values.', true);
      return false;
    }
    salesState[key] = values;
  }

  setStatus('Sales matrix updated successfully.');
  return true;
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

document.getElementById('apply-sales-btn').addEventListener('click', loadStateFromInputs);
document.getElementById('rfq-period').addEventListener('change', updateRfqChart);
document.getElementById('po-period').addEventListener('change', updatePoChart);
