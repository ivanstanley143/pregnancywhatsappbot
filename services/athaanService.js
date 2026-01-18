const axios = require("axios");

const CITY = "Kannur";
const COUNTRY = "India";

// Shafi = method 1 (Kerala accepted)
const METHOD = 1;

async function getTodayPrayerTimes() {
  const url = `https://api.aladhan.com/v1/timingsByCity`;

  const res = await axios.get(url, {
    params: {
      city: CITY,
      country: COUNTRY,
      method: METHOD
    }
  });

  const t = res.data.data.timings;

  return {
    Fajr: t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha
  };
}

module.exports = { getTodayPrayerTimes };
