import * as fs from 'fs';
import {
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';
import { release } from 'os';

class CustomReporter implements Reporter {
  private results: any[] = [];
  private runDate: string = new Date().toISOString();

  onTestEnd(test: TestCase, result: TestResult): void {

    const logs =
      result.stdout.map(s => s.toString()).join('\n') +
      '\n' +
      result.stderr.map(s => s.toString()).join('\n');

    const screenshots = result.attachments
      .filter(
        attachment =>
          attachment.path &&
          attachment.path.endsWith('.png')
      )
      .map(attachment => attachment.path);

    this.results.push({
      title: test.title,
      status: result.status,
      duration: (result.duration / 1000).toFixed(2),
      error: result.error?.message ?? null,
      log: logs,
      media: screenshots.length
        ? screenshots.join(', ')
        : null,

    });
  }

  async onEnd(): Promise<void> {
    fs.writeFileSync(
      'custom-report/result.json',
      JSON.stringify(
        {
          appName: 'Sauce Demo',
          browserName: 'Chrome',
          runDate: this.runDate,
          results: this.results,
          totalCount: this.results.length,
        },
        null,
        2
      )
    );

    console.log('Results written to result.json');
  }
}

export default CustomReporter;