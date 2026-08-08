import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | string;
  duration: string;
  error: string | null;
  log: string;
  media: string | null;
}

interface ReportData {
  appName: string;
  browserName: string;
  runDate: string;
  results: TestResult[];
  totalCount: number;
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalTimedOut: number;
}

function generateHtmlReport(data: ReportData): string {
  const { appName, browserName, runDate,totalCount, results, totalPassed, totalFailed, totalSkipped, totalTimedOut } = data;

  const passedTests = results.filter(
    result => result.status === 'passed'
  ).length;

  const failedTests = results.filter(
    result => result.status === 'failed'
  ).length;

  const skippedTests = results.filter(
    result => result.status === 'skipped'
  ).length;

  const timedOutTests = results.filter(
    result => result.status === 'timedOut'
  ).length;

  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Test Report</title>

<style>


  h1 {
    text-align: center;
  }

  body {
    font-family: Arial, sans-serif;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  .passed {
    color: MediumSeaGreen;
  }

  .failed {
    color: Tomato;
  }

  .skipped {
    color: Gray;
  }

  .timedOut {
    color: SlateBlue;
  }

  .chart-container {
    width: 30%;
    margin: auto;
  }

.testreportchart {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 30px;
    margin-bottom: 10px;
}


.report {
    width: 55%;
}

.chart-container {
    width: 40%;
    max-width: 400px;
    height: 320px;
    display: flex; 
    justify-content: center;
    align-items: center;
}


.chart-container canvas {
    max-width: 100%;
    max-height: 320px;
}

  
.test-counts {
    width: 55%;
    margin-top: 10px;
    margin-bottom: 20px;
}

.test-counts table {
    width: 100%;
    border-collapse: collapse;
}

.test-counts th,
.test-counts td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
}

.test-counts th {
    background-color: #f2f2f2;
}

.test-counts td {
    font-size: 30px;
    font-weight: bold;
}
.passed {
    color: MediumSeaGreen;
}

.failed {
    color: Tomato;
}

.skipped {
    color: Gray;
}

.timedOut {
    color: SlateBlue;
}
</style>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>

<h1>Automation Execution Report</h1>

<div class="testreportchart">

  <div class="report">
    <table>
      <tr>
        <th>Application</th>
        <td>${appName}</td>
      </tr>
      <tr>
        <th>Browser</th>
        <td>${browserName}</td>
      </tr>
      <tr>
        <th>Test Run Date</th>
        <td>${runDate}</td>
      </tr>
    </table>
  </div>
  
  <div class="chart-container">
    <canvas id="testResultsChart"></canvas>
  </div>

</div>
<div class="test-counts">
    <table>
    <tr>
        <th>Total Tests</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Skipped</th>
        <th>Timed Out</th>
      </tr>
        <td>${totalCount}</td>
        <td class="passed" style="color: MediumSeaGreen;">${passedTests}</td>
        <td class="failed" style="color: Tomato;">${failedTests}</td>
        <td class="skipped" style="color: Gray;">${skippedTests}</td>
        <td class="timedOut" style="color: SlateBlue;">${timedOutTests}</td>
      <tr>
      </tr>
    </table>
  </div>

<table>

<tr>
  <th>Test Case Name</th>
  <th>Status</th>
  <th>Duration (seconds)</th>
  <th>Logs</th>
  <th>Media</th>
</tr>
`;

  results.forEach((result: TestResult) => {
    htmlContent += `
<tr>
  <td>${result.title}</td>
  <td class="${result.status}">
    ${result.status}
  </td>
  <td>${result.duration}</td>
<td>
<pre>${result.log ?? ''}</pre>
${result.error ? `<pre style="color:red">${result.error}</pre>` : ''}
</td>  <td>
${
  result.media
    ? result.media
        .split(', ')
        .map((media) => {
          const normalizedPath = media.replace(/\\/g, '/');
          const fileName = media.split('\\').pop() || 'Screenshot';

          return `<a href="${normalizedPath}" target="_blank">${fileName}</a>`;
        })
        .join('<br>')
    : ''
}
</td>
</tr>
`;
  });

  htmlContent += `
</table>

<script>
const ctx = document.getElementById('testResultsChart').getContext('2d');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Passed', 'Failed', 'Skipped', 'TimedOut'],
    datasets: [{
      data: [
        ${passedTests},
        ${failedTests},
        ${skippedTests},
        ${timedOutTests}
      ],
      backgroundColor: [
        'MediumSeaGreen',
        'Tomato',
        'Gray',
        'SlateBlue'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Execution Status'
      }
    }
  }
});
</script>

</body>
</html>
`;

  return htmlContent;
}

const resultsPath: string = path.resolve(
  __dirname,
  'result.json'
);

const outputPath: string = path.resolve(
  __dirname,
  'custom-report.html'
);

fs.readFile(
  resultsPath,
  'utf8',
  (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      console.error(
        'Error reading the results file:',
        err
      );
      return;
    }

    const resultsData: ReportData = JSON.parse(data);

    const htmlReport = generateHtmlReport(resultsData);

    fs.writeFile(
      outputPath,
      htmlReport,
      'utf8',
      (writeErr: NodeJS.ErrnoException | null) => {
        if (writeErr) {
          console.error(
            'Error writing the HTML report:',
            writeErr
          );
        } else {
          console.log(
            'HTML report generated successfully!'
          );
        }
      }
    );
  }
);