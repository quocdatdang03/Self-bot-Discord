require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");

const allowedChannelId = process.env.CHANNEL_ID;

const client = new Client();

client.on("ready", () => {
  console.log(`✅ Đăng nhập với ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user.id) return;
  if (message.channel.id !== allowedChannelId) return;

  try {
    const userInput = message.content;
    if (!userInput) return; // Không có nội dung thì bỏ qua

    await message.reply(userInput); // Trả lời lại đúng nội dung
  } catch (error) {
    console.error("❌ Lỗi reply:", error.message);
    await message.reply("Bot lỗi rồi 😅. Thử lại sau nhé!");
  }
});

client.login(process.env.DISCORD_TOKEN);
