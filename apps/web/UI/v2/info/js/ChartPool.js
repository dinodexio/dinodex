document.addEventListener('DOMContentLoaded', function () {
  let chartPool = document.getElementById('chart-join-pool');
  if (chartPool) {
    let ctx = chartPool.getContext('2d');
    let poolChart = new PoolChart(ctx, {
      from: { value: 50, color: '#9FE4C9' },
      to: { value: 200, color: '#C5B4E3' },
    });
    chartPool.addEventListener('click', function () {
      console.log('click', poolChart.getValues());
    });

    function updateWindowSize() {
      const actualWidth = document.documentElement.clientWidth;
      if (actualWidth < 900) {
        chartPool.width = actualWidth - 40;
        let ctx = chartPool.getContext('2d');
        let poolChart = new PoolChart(ctx, {
          from: { value: 50, color: '#9FE4C9' },
          to: { value: 200, color: '#C5B4E3' },
        });
      }
    }

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
  }
});
document.addEventListener('DOMContentLoaded', function () {
  let chartAreaToken = document.getElementById('chart-area-token');
  if (chartAreaToken) {
  }
});
document.addEventListener('DOMContentLoaded', function () {
  let data = [
    { letter: '4:05 AM', value: 0.01 },
    { letter: '5:06 AM', value: 0.03 },
    { letter: '6:07 AM', value: 0.12 },
    { letter: '7:05 AM', value: 0.05 },
    { letter: '8:05 AM', value: 0.09 },
    { letter: '9:05 AM', value: 0.05 },
    { letter: '10:05 AM', value: 0.13 },
    { letter: '11:05 AM', value: 0.02 },
    { letter: '12:05 AM', value: 0.12 },
    { letter: '1:05 PM', value: 0.1 },
    { letter: '2:05 PM', value: 0.01 },
    { letter: '3:05 PM', value: 0.1 },
    { letter: '4:05 PM', value: 0.1 },
    { letter: '5:05 PM', value: 0.1 },
    { letter: '6:05 PM', value: 0.1 },
    { letter: '7:05 PM', value: 0.1 },
    { letter: '8:05 PM', value: 0.12 },
  ];
  let chartBarsPool = document.getElementById('chart-bars-pool');
  if (chartBarsPool) {
    let ctx = chartBarsPool.getContext('2d');
    let barsChart = new BarsChart(ctx, {
      data: data,
      color: '#FF8035',
      axis: { color: '#000000', size: 14 },
    });
    function updateWindowSize() {
      if (document.documentElement.clientWidth < 900) {
        chartBarsPool.width = document.documentElement.clientWidth - 40;
        let ctx = chartBarsPool.getContext('2d');
        let barsChart = new BarsChart(ctx, {
          data: data,
          color: '#FF8035',
          axis: { color: '#000000', size: 14 },
        });
      }
    }

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  let data = [
    { date: new Date('2022-04-23'), value1: 0.1, value2: 0.23 },
    { date: new Date('2022-05-25'), value1: 0.03, value2: 0.2 },
    { date: new Date('2022-07-26'), value1: 0.12, value2: 0.14 },
    { date: new Date('2022-10-23'), value1: 0.12, value2: 0.1 },
    { date: new Date('2022-12-31'), value1: 0.12, value2: 0.25 },
    { date: new Date('2023-01-01'), value1: 0.12, value2: 0.41 },
    { date: new Date('2023-05-23'), value1: 0.4, value2: 0.8 },
    { date: new Date('2023-07-15'), value1: 0.12, value2: 0.14 },
    { date: new Date('2023-10-23'), value1: 0.3, value2: 0.6 },
    { date: new Date('2023-12-05'), value1: 0.12, value2: 0.7 },
    { date: new Date('2024-01-06'), value1: 0.12, value2: 0.14 },
    { date: new Date('2024-03-07'), value1: 0.12, value2: 0.6 },
    { date: new Date('2024-04-08'), value1: 0.12, value2: 0.14 },
    { date: new Date('2024-05-09'), value1: 0.2, value2: 0.4 },
    { date: new Date('2024-06-10'), value1: 0.3, value2: 0.44 },
    { date: new Date('2024-07-23'), value1: 0.12, value2: 0.14 },
    { date: new Date('2024-08-23'), value1: 0.12, value2: 0.14 },
    { date: new Date('2024-09-23'), value1: 0.12, value2: 0.14 },
  ];
  let chartDouBarsPool = document.getElementById('chart-dou-bars-pool');
  if (chartDouBarsPool) {
    let ctx = chartDouBarsPool.getContext('2d');
    let boxInfo = document.getElementById('box-chart-dou-bars');
    let doubleBarChart = new DoubleBarChart(ctx, {
      data: data,
      colors: ['#E1D9F0', '#E4F5EE'],
      axis: { color: '#000000', size: 12 },
      hoverColors: ['#6A16FF', '#0A6'],
      onHover: (x, data) => {
        document.getElementById('dou-bars-value').innerHTML =
          `$${(Number(data.value1) + 1 + Number(data.value2) + 1).toFixed(2)}B`;
        document.getElementById('dou-bars-time').innerHTML =
          `${data.date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}`;
        boxInfo.style.left = `${x - 25}px`;
        document.getElementById('value1-dou-bars').innerHTML = (
          Number(data.value1) + 1
        ).toFixed(2);
        document.getElementById('value2-dou-bars').innerHTML = (
          Number(data.value2) + 1
        ).toFixed(2);
        if (x < 170) {
          boxInfo.style.bottom = `78%`;
        } else {
          boxInfo.style.bottom = `94%`;
        }
      },
    });

    function updateWindowSize() {
      const actualWidth = document.documentElement.clientWidth;
      if (actualWidth < 1260) {
        doubleBarChart.updateSize(
          ((actualWidth / 100) * 90) / 2,
          chartDouBarsPool.height,
        );
      } else {
        doubleBarChart.updateSize(548, chartDouBarsPool.height);
      }
    }

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // dummy data
  let data = dataDummyChart;

  data.sort((a, b) => a.date - b.date);

  data.slice(0, 500).forEach(item => {
    item.value2 = item.value1 + 50;
  });

  data.slice(501, 999).forEach(item => {
    item.value2 = item.value1;
  });

  data.slice(1000).forEach(item => {
    item.value2 = item.value1 - 50;
  });

  // end dummy data

  let chartDouArea = document.getElementById('chart-dou-area-pool');

  if (chartDouArea) {
    let ctx = chartDouArea.getContext('2d');
    let doubleAreaChart = new DoubleAreaChart(ctx, {
      data: data,
      colors: ['#792FFD', '#45C793'],
      colorArea: ['#E1D9F0', '#E6F7F0'],
      onHover: (x, dataHover) => {
        console.log('Hover x position:', x);
        let boxInfo = document.getElementById('box-chart-dou-area');
        console.log(dataHover);
        document.getElementById('dou-area-value').innerHTML =
          `$${(Number(dataHover.value1) + Number(dataHover.value2)).toFixed(2)}B`;
        document.getElementById('dou-area-time').innerHTML =
          `${dataHover.date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}`;
        boxInfo.style.left = `${x - 40}px`;
        document.getElementById('value1').innerHTML = Number(
          dataHover.value1,
        ).toFixed(2);
        document.getElementById('value2').innerHTML = Number(
          dataHover.value2,
        ).toFixed(2);
        if (x < 200) {
          document.getElementById('box-chart-dou-area').style.bottom = `78%`;
        } else {
          document.getElementById('box-chart-dou-area').style.bottom = `94%`;
        }
      },
    });

    function updateWindowSize() {
      const actualWidth = document.documentElement.clientWidth;
      if (actualWidth < 1260) {
        doubleAreaChart.updateSize(
          ((actualWidth / 100) * 90) / 2,
          chartDouArea.height,
        );
      } else {
        doubleAreaChart.updateSize(548, chartDouArea.height);
      }
    }

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  let data = dataDummyPriceToken;

  let chartLineToken = document.getElementById('chart-line-token');

  if (chartLineToken) {
    let ctx = chartLineToken.getContext('2d');
    const lineChart = new SingleAreaChart(ctx, {
      data: dataDummyPriceToken,
      color: '#FF603B',
      colorArea: 'rgba(255, 96, 59, 0.25)',
      colorPointHover: {
        color: '#FF603B',
        colorStroke: 'rgba(255, 96, 59, 0.25)',
      },
      axis: { color: '#000', size: 14 },
      onHover: (x, data) => {
        console.log(data);
        document.querySelector('.token-chart-price-text').innerHTML =
          `$${Number(data.value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
      },
    });
    function updateWindowSize() {
      const actualWidth = document.querySelector(
        '.container-token-layout',
      ).clientWidth;
      console.log('actualWidth::', actualWidth);
      if (actualWidth < 1260) {
        lineChart.updateSize(actualWidth, chartLineToken.height);
      } else {
        lineChart.updateSize(548, chartLineToken.height);
      }
    }

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
  }
});
