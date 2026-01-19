const {
  PrayerTimes,
  CalculationMethod,
  Madhab,
  Coordinates
} = require("adhan");

function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  });
}

async function getTodayPrayerTimes() {
  const coordinates = new Coordinates(11.8745, 75.3704);

  const params = CalculationMethod.MoonsightingCommittee();
  params.madhab = Madhab.Shafi;

  const date = new Date();
  const p = new PrayerTimes(coordinates, date, params);

  return {
    Fajr: formatTime(addMinutes(p.fajr, -8)),
    Sunrise: formatTime(p.sunrise), // ✅ REAL SUNRISE
    Dhuhr: formatTime(addMinutes(p.dhuhr, -3)),
    Asr: formatTime(addMinutes(p.asr, +2)),
    Maghrib: formatTime(p.maghrib),
    Isha: formatTime(addMinutes(p.isha, +1))
  };
}

module.exports = { getTodayPrayerTimes };
