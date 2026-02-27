const sharedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#374151',
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
