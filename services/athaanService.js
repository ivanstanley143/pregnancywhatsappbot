const axios = require("axios");

async function getTodayPrayerTimes() {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Kannur, Kerala
    const latitude = 11.8745;
    const longitude = 75.3704;

    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=1&school=1&timezonestring=Asia/Kolkata`;

    console.log("🕌 Fetching Athaan from AlAdhan API");

    const res = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!res.data || res.data.code !== 200) {
      throw new Error("Invalid AlAdhan API response");
    }

    const t = res.data.data.timings;

    return normalizeTimes(t);
  } catch (err) {
    console.error("⚠️ AlAdhan failed:", err.message);

    // 🔁 FALLBACK API (by city)
    return await fallbackByCity();
  }
}

/* =========================
   🔁 FALLBACK (CITY BASED)
========================= */
async function fallbackByCity() {
  try {
    console.log("🔁 Using fallback prayer API");

    const url =
      "https://api.aladhan.com/v1/timingsByCity?city=Kannur&country=India&method=1&school=1";

    const res = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!res.data || res.data.code !== 200) {
      throw new Error("Invalid fallback API response");
    }

    return normalizeTimes(res.data.data.timings);
  } catch (err) {
    console.error("❌ Fallback Athaan failed:", err.message);
    throw err;
  }
}

/* =========================
   🧹 NORMALIZE TIMES
========================= */
function normalizeTimes(t) {
  return {
    Fajr: clean(t.Fajr),
    Sunrise: clean(t.Sunrise),
    Dhuhr: clean(t.Dhuhr),
    Asr: clean(t.Asr),
    Maghrib: clean(t.Maghrib),
    Isha: clean(t.Isha)
  };
}

function clean(time) {
  return String(time).split(" ")[0]; // remove (IST)
}

module.exports = { getTodayPrayerTimes };
