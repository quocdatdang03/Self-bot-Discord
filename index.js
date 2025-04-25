const { Client } = require("discord.js-selfbot-v13");
const axios = require("axios");

const allowedChannelId = "1023111058514264075";

const client = new Client();

client.on("ready", () => {
  console.log(`✅ Đăng nhập với ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user.id) return;
  if (message.channel.id !== allowedChannelId) return;

  try {
    const userInput = message.content;

    // Prompt định dạng giống hội thoại
    const systemInstruction =
      "Bạn là một trợ lý ảo vui tính, trả lời ngắn gọn, hài hước, không nói thừa.";
    const prompt = `${systemInstruction}\n<|user|>\n${userInput}\n<|assistant|>`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: "Bearer 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",
          Accept: "application/json",
        },
      }
    );

    const aiReply = response.data?.[0]?.generated_text
      ?.split("<|assistant|>")[1]
      ?.trim();

    if (!aiReply) {
      await message.reply("Bot đang bí ý tưởng 😵‍💫");
    } else {
      await message.reply(aiReply);
    }
  } catch (error) {
    console.error("❌ Lỗi gọi AI miễn phí:", error.message);
    await message.channel.send("Tao bị lag rồi 😅. Thử lại sau nhé!");
  }
});

client.login(
  "MTI4OTkzMDMyOTI4ODczNjc4MA.Gfiw9X.VgPMPZtWDQ2hAhnh1W_iMNBXEXf65xriMxq1l0"
);
