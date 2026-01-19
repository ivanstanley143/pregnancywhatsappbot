const {
  PrayerTimes,
  CalculationMethod,
  Madhab,
  Coordinates
} = require("adhan");

function formatTime(date) {
  return date
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    });
}

async function getTodayPrayerTimes() {
  // 📍 Kannur, Kerala (exact)
  const coordinates = new Coordinates(11.8745, 75.3704);

  // 🕌 Kerala-compatible calculation
  const params = CalculationMethod.MoonsightingCommittee();
  params.madhab = Madhab.Shafi;

  const date = new Date();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return {
    Fajr: formatTime(prayerTimes.fajr),
    Sunrise: formatTime(prayerTimes.sunrise),
    Dhuhr: formatTime(prayerTimes.dhuhr),
    Asr: formatTime(prayerTimes.asr),
    Maghrib: formatTime(prayerTimes.maghrib),
    Isha: formatTime(prayerTimes.isha)
  };
}

module.exports = { getTodayPrayerTimes };
