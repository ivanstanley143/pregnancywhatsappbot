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
  // 📍 Kannur exact
  const coordinates = new Coordinates(11.8745, 75.3704);

  // Base calculation
  const params = CalculationMethod.MoonsightingCommittee();
  params.madhab = Madhab.Shafi;

  const date = new Date();
  const p = new PrayerTimes(coordinates, date, params);

  // ✅ Kerala Masjid Adjustments (IMPORTANT)
  const OFFSETS = {
    fajr: -8,      // earlier
    sunrise: -25,  // earlier
    dhuhr: -3,
    asr: +2,
    maghrib: 0,
    isha: +1
  };

  return {
    Fajr: formatTime(addMinutes(p.fajr, OFFSETS.fajr)),
    Sunrise: formatTime(addMinutes(p.sunrise, OFFSETS.sunrise)),
    Dhuhr: formatTime(addMinutes(p.dhuhr, OFFSETS.dhuhr)),
    Asr: formatTime(addMinutes(p.asr, OFFSETS.asr)),
    Maghrib: formatTime(addMinutes(p.maghrib, OFFSETS.maghrib)),
    Isha: formatTime(addMinutes(p.isha, OFFSETS.isha))
  };
}

module.exports = { getTodayPrayerTimes };
