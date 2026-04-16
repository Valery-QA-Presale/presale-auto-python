import baseConfig from './playwright.config';

export default {
  ...baseConfig,
  testDir: './tests/b2c',

  reporter: [
    ['list'],
    ['html'],
    [
      '@b3nab/playwright-telegram-reporter',
      {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID,

        sendOn: 'failure',

        customFormatter: (result, suite) => {
          const tests = suite.allTests();
          const passedTests = tests.filter(t => t.results[0]?.status === 'passed');
          const failedTests = tests.filter(t =>
            t.results[0]?.status === 'failed' ||
            t.results[0]?.status === 'timedOut'
          );
          const skipped = tests.filter(t => t.results[0]?.status === 'skipped').length;

          const header = 'ЕСТЬ ПАДЕНИЯ!';

          // Секция с падениями
          let failedSection = '';
          if (failedTests.length > 0) {
            failedSection = '\n❌ <b>УПАВШИЕ ТЕСТЫ:</b>\n' + failedTests
              .map((t, index) => {
                const title = t.titlePath().pop() || '';
                const error = t.results[0]?.error?.message || '';
                const cleanError = error
                  .replace(/\[\d+m/g, '')
                  .split('\n')[0]
                  .trim();

                return `  ${index + 1}. 🔴 <b>${title}</b>\n     ⚠️ ${cleanError}`;
              })
              .join('\n\n');
          }

          // Прошедшие тесты (только для контекста, первые 3)
          const passedSample = passedTests
            .slice(0, 3)
            .map(t => {
              const title = t.titlePath().pop() || '';
              return `  • 📝 ${title}`;
            })
            .join('\n');

          return `
${header}

Status: <b>${result.status.toUpperCase()}</b>
Duration: ${(result.duration / 1000).toFixed(2)}s

📊 <b>Summary:</b>
• Total: ${tests.length}
• Passed: ${passedTests.length}
• Failed: ${failedTests.length}
• Skipped: ${skipped}
${failedSection}
✅ <b>PASSED (${passedTests.length}):</b>
${passedSample}
${passedTests.length > 3 ? `  ... и еще ${passedTests.length - 3} тестов` : ''}
          `;
        }
      }
    ]
  ],
};

// export default {
//   ...baseConfig,
//   testDir: './tests/b2c',
//   reporter: [ ['list'], ['html'],
//     [
//       '@b3nab/playwright-telegram-reporter',
//       {
//         botToken: process.env.TELEGRAM_BOT_TOKEN,
//         chatId: process.env.TELEGRAM_CHAT_ID,
//         reportType: 'detailed', //detailed детальная простыня тестов
//         sendOn: 'always',
//         testFormat: '{TEST} ({TIME})',
//         title: (passed) => {
//           if (passed) return '🎉🎉🎉 ВСЕ ТЕСТЫ ЗЕЛЕНЫЕ! 🎉🎉🎉';
//           return '💩💩💩 ЧТО-ТО УПАЛО! 💩💩💩';
//         }
//       }
//     ]
//   ],
// };