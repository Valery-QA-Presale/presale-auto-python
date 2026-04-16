import * as dotenv from 'dotenv';
import * as path from 'path';

// Тихо грузим .env без лишнего шума
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export class TelegramNotifier {
  private static botToken = process.env.TELEGRAM_BOT_TOKEN;
  private static chatId = process.env.TELEGRAM_CHAT_ID;

  static async sendMessage(message: string) {
    if (!this.botToken || !this.chatId) {
      console.log('⚠️ Telegram not configured');
      return;
    }

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Telegram error:', error);
      }
    } catch (error) {
      console.error('❌ Telegram error:', error);
    }
  }

  static formatTestResults(passed: number, failed: number, duration: number) {
    const icon = failed === 0 ? '✅' : '❌';
    const total = passed + failed;

    return `
${icon} <b>Test Run Complete</b>
📊 Passed: ${passed}
❌ Failed: ${failed}
📝 Total: ${total}
⏱️ Duration: ${Math.round(duration / 1000)}s
    `;
  }
}
