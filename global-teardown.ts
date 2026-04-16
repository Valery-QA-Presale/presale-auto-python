import { TelegramNotifier } from './tests/utils/telegram/telegram-notifier';
import { failed, passed, resetStats } from './tests/utils/test-context';

console.log('🔥🔥🔥 GLOBAL TEARDOWN IS RUNNING! 🔥🔥🔥'); // 👈 ЭТО УВИДИШЬ?


console.log('🔥🔥🔥 GLOBAL TEARDOWN IS RUNNING! 🔥🔥🔥');

export default async function globalTeardown() {
  console.log('\n📊 ===== GLOBAL TEARDOWN STARTED =====');
  console.log(`📊 FINAL RESULTS: ✅ ${passed} | ❌ ${failed}`);

  if (passed > 0 || failed > 0) {
    console.log('📤 Sending to Telegram...');
    const total = passed + failed;
    const icon = failed === 0 ? '✅' : '❌';

    await TelegramNotifier.sendMessage(
      `${icon} <b>Tests: ${passed} ✅ / ${failed} ❌ / ${total} 📝`
    );
    console.log('✅ Telegram sent');
  }

  resetStats(); // 👈 чистим после отправки
  console.log('📊 ===== GLOBAL TEARDOWN COMPLETED =====\n');
}