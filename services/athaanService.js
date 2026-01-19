const axios = require("axios");

async function getTodayPrayerTimes() {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Kannur, Kerala (latitude & longitude)
    const latitude = 11.8745;
    const longitude = 75.3704;

    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=1&school=1&timezonestring=Asia/Kolkata`;

    const res = await axios.get(url, { timeout: 10000 });

    if (!res.data || res.data.code !== 200) {
      throw new Error("Invalid prayer API response");
    }

    const t = res.data.data.timings;

    return {
      Fajr: clean(t.Fajr),
      Sunrise: clean(t.Sunrise),
      Dhuhr: clean(t.Dhuhr),
      Asr: clean(t.Asr),
      Maghrib: clean(t.Maghrib),
      Isha: clean(t.Isha)
    };
  } catch (err) {
    console.error("❌ AthaanService error:", err.message);
    throw err;
  }
}

// Remove timezone text like "(IST)"
function clean(time) {
  return String(time).split(" ")[0];
}

module.exports = { getTodayPrayerTimes };
