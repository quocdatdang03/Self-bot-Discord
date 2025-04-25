require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const axios = require("axios");

const allowedChannelId = process.env.CHANNEL_ID;

const client = new Client();

client.on("ready", () => {
  console.log(`✅ Đăng nhập với ${client.user.tag}`);
});

// Hàm kiểm tra xem có phải tiếng Việt không
function isVietnamese(text) {
  return /[àáảãạâầấẩẫậăằắẳẵặêèéẻẽẹêếềểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(
    text
  );
}

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user.id) return;
  if (message.channel.id !== allowedChannelId) return;

  try {
    const userInput = message.content;

    const isVN = isVietnamese(userInput);

    const promptVN = {
      role: "system",
      content:
        "Bạn là một người dùng Discord Việt Nam, nói chuyện cực kỳ tự nhiên, hài hước, cà khịa nhẹ. Không được nói như sách vở hay dài dòng.",
    };

    const promptEN = {
      role: "system",
      content:
        "You're a friendly Discord user who responds in a casual, short, and funny way. Make it feel like a real person talking to a friend, with a bit of humor if possible.",
    };

    const payload = {
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [
        isVN ? promptVN : promptEN,
        {
          role: "user",
          content: isVN
            ? `Bạn tôi vừa hỏi: "${userInput}". Hãy trả lời như một người bạn thân trên Discord, ngắn gọn, vui tính, nếu được hãy thêm một chút cảm xúc hay meme reaction.`
            : `My friend just asked: "${userInput}". Reply like a close Discord friend, casually and funny. You can include emoji or meme reaction if appropriate.`,
        },
      ],
    };

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let aiReply = response.data?.choices?.[0]?.message?.content?.trim();

    if (!aiReply) {
      await message.reply(
        isVN ? "Bot đang bí ý tưởng 😵‍💫" : "I'm kinda blank rn 😵‍💫"
      );
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

client.login(process.env.DISCORD_TOKEN);
