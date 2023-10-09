import axios from "axios"

class TelegramApi {
  private static instance: TelegramApi
  private token: string
  private telegramBotName: string
  private isCallbackInitialized = false

  private constructor(token: string, telegramBotName: string) {
    this.token = token
    this.telegramBotName = telegramBotName
  }

  public static getInstance(
    token: string,
    telegramBotName: string
  ): TelegramApi {
    if (!TelegramApi.instance) {
      TelegramApi.instance = new TelegramApi(token, telegramBotName)
    }

    return TelegramApi.instance
  }

  public async initCallback(): Promise<void> {
    try {
      if (this.isCallbackInitialized) {
        return
      }

      if (
        !process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ||
        process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL.startsWith("http://")
      ) {
        console.error(
          "NEXT_PUBLIC_AUTH_REDIRECT_URL is not set or starts with http://"
        )
        return
      }

      const url = `https://api.telegram.org/bot${this.token}/setWebhook?url=${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}/api/messengers/callback?secret=${process.env.CALLBACK_SECRET_URL_STRING}`
      const res = await axios.get(url)
      console.log(res.data)
      console.log("Telegram callback initialized for: ", url)

      this.isCallbackInitialized = true
    } catch (e) {
      console.error("Failed to initialize Telegram callback: ", e)
    }
  }

  public async sendMessage(
    chatId: number | string,
    text: string
  ): Promise<void> {
    if (!this.isCallbackInitialized) {
      await this.initCallback()
    }

    const url = `https://api.telegram.org/bot${this.token}/sendMessage`
    await axios.post(url, {
      chat_id: chatId,
      text,
    })
  }
}

export default TelegramApi.getInstance(
  process.env.TELEGRAM_BOT_TOKEN!,
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME!
)
