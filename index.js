import { Telegraf, Markup } from "telegraf";
import fs from "fs";

const BOT_TOKEN = "8575973881:AAFfDeDvGEUBZKSiKk4uqBxS-KIZ__hM3gI";
const ADMIN_ID = 5728779626;

const bot = new Telegraf(BOT_TOKEN);

const DB = "./users.json";
if (!fs.existsSync(DB)) fs.writeFileSync(DB, "{}");

function getUsers() {
  return JSON.parse(fs.readFileSync(DB));
}
function saveUsers(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

const mainMenu = Markup.keyboard([
  ["📚 Sessiya testlari"],
  ["ℹ️ Ma’lumot"]
]).resize();

bot.start(ctx => {
  ctx.reply(
    "Assalomu alaykum!\n\n📚 Sessiya uchun tayyorgarlik testlar botiga xush kelibsiz.\n\nTelefon raqamingizni yuboring.",
    Markup.keyboard([
      [Markup.button.contactRequest("📞 Telefon raqamni yuborish")]
    ]).resize()
  );
});

bot.on("contact", ctx => {
  const users = getUsers();
  const id = ctx.from.id;

  users[id] = {
    telegram_id: id,
    username: ctx.from.username || "yo‘q",
    phone: ctx.message.contact.phone_number,
    date: new Date().toLocaleString()
  };

  saveUsers(users);
  ctx.reply("✅ Ro‘yxatdan o‘tdingiz!", mainMenu);
});

bot.hears("📚 Sessiya testlari", ctx => {
  ctx.reply(
    "📚 Sessiya uchun tayyorgarlik testlar\n\n" +
    "Real savollar, tezkor natija, reyting va nazorat tizimi.\n\n" +
    "Testlar tez orada ishga tushadi."
  );
});

bot.hears("ℹ️ Ma’lumot", ctx => {
  ctx.reply("Bu bot orqali sessiyaga tayyorgarlik testlaridan foydalanishingiz mumkin.");
});

bot.command("admin", ctx => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply("❌ Ruxsat yo‘q");

  const users = getUsers();
  if (Object.keys(users).length === 0) return ctx.reply("Hali foydalanuvchi yo‘q.");

  let text = "👥 RO‘YXATDAN O‘TGANLAR:\n\n";
  for (let u of Object.values(users)) {
    text += `🆔 ${u.telegram_id}\n👤 @${u.username}\n📞 ${u.phone}\n🕓 ${u.date}\n──────────\n`;
  }
  ctx.reply(text);
});

bot.launch();
console.log("🤖 BOT ISHLAYAPTI");
