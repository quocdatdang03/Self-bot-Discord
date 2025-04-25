const { Client } = require("discord.js-selfbot-v13");
const axios = require("axios");

const allowedChannelId = "1023111058514264075"; // ID kênh được phép

const client = new Client();

client.on("ready", () => {
  console.log(`✅ Đăng nhập với ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user.id) return;
  if (message.channel.id !== allowedChannelId) return;

  try {
    const userInput = message.content;

    // Prompt dưới dạng hội thoại
    const payload = {
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        {
          role: "system",
          content:
            "Bạn là một người dùng Discord Việt Nam cực kỳ lầy lội, trả lời ngắn gọn, vui tính, cà khịa nhẹ, và luôn nói chuyện như một người thật. Tránh văn mẫu, tránh quá nghiêm túc.",
        },
        {
          role: "user",
          content: `Tin nhắn từ người khác: "${userInput}". Trả lời lại như một người bạn hài hước trên Discord.`,
        },
      ],
    };

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization:
            "Bearer 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", // 🔑 Thay bằng OpenRouter API Key của bạn
          "Content-Type": "application/json",
        },
      }
    );

    let aiReply = response.data?.choices?.[0]?.message?.content?.trim();

    if (!aiReply) {
      await message.reply("Bot đang bí ý tưởng 😵‍💫");
      return;
    }

    if (aiReply.length > 400) {
      aiReply = aiReply.substring(0, 397) + "...";
    }

    await message.reply(aiReply);
  } catch (error) {
    console.error("❌ Lỗi gọi AI:", error.response?.data || error.message);
    await message.reply("Bot lỗi rồi 😅. Thử lại sau nhé!");
  }
});

client.login(
  "MTI4OTkzMDMyOTI4ODczNjc4MA.Gfiw9X.VgPMPZtWDQ2hAhnh1W_iMNBXEXf65xriMxq1l0"
); // Thay token của bạn ở đây
