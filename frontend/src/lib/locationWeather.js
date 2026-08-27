import { useState, useEffect, useCallback } from "react";
import { http } from "./api";

// Cache key and duration (10 minutes)
const WEATHER_CACHE_KEY = "nexus_device_weather_v2";
const CACHE_DURATION_MS = 10 * 60 * 1000;

// Helper to map WMO code to human-readable condition text & icon hint
export function getWmoCondition(code) {
  const mapping = {
    0: { text: "Clear Sky", icon: "Sun", spiderText: "Optimal flight conditions. Clear skies." },
    1: { text: "Mainly Clear", icon: "Sun", spiderText: "Visibility clear across all perimeters." },
    2: { text: "Partly Cloudy", icon: "CloudSun", spiderText: "Partial cloud cover. Optical radar nominal." },
    3: { text: "Overcast", icon: "Cloud", spiderText: "Heavy cloud ceiling. Thermal sensors engaged." },
    45: { text: "Foggy / Mist", icon: "CloudFog", spiderText: "Low visibility fog. LIDAR navigation active." },
    48: { text: "Rime Fog", icon: "CloudFog", spiderText: "Freezing fog detected. Thermal heating online." },
    51: { text: "Light Drizzle", icon: "CloudDrizzle", spiderText: "Minor precipitation. Web shooters unaffected." },
    53: { text: "Moderate Drizzle", icon: "CloudDrizzle", spiderText: "Drizzle active. Surface friction reduced 5%." },
    55: { text: "Dense Drizzle", icon: "CloudDrizzle", spiderText: "Continuous mist. Optical tracking recalibrated." },
    56: { text: "Freezing Drizzle", icon: "CloudSnow", spiderText: "Sub-zero drizzle. Anti-icing protocols online." },
    57: { text: "Dense Freezing Drizzle", icon: "CloudSnow", spiderText: "Severe icing conditions. Nano-armor warmed." },
    61: { text: "Slight Rain", icon: "CloudRain", spiderText: "Light rain. Web lines maintaining 98% tensile strength." },
    63: { text: "Moderate Rain", icon: "CloudRain", spiderText: "Steady rainfall. Surface adhesion compensated." },
    65: { text: "Heavy Rain", icon: "CloudRain", spiderText: "Torrential rain. Glide wings angle adjusted." },
    66: { text: "Freezing Rain", icon: "CloudSnow", spiderText: "Freezing rain hazard. Hydrophobic coating active." },
    67: { text: "Heavy Freezing Rain", icon: "CloudSnow", spiderText: "Heavy ice accumulation warning. Caution on high swings." },
    71: { text: "Slight Snow", icon: "CloudSnow", spiderText: "Light snowfall detected. Atmospheric temp dropping." },
    73: { text: "Moderate Snow", icon: "CloudSnow", spiderText: "Moderate snow. Wall-crawling micro-heaters active." },
    75: { text: "Heavy Snow", icon: "CloudSnow", spiderText: "Heavy blizzard conditions. Infrared targeting active." },
    77: { text: "Snow Grains", icon: "Snowflake", spiderText: "Ice particles detected in air currents." },
    80: { text: "Rain Showers", icon: "CloudRain", spiderText: "Scattered showers across sector grid." },
    81: { text: "Moderate Showers", icon: "CloudRain", spiderText: "Passing storm cells. Flight path clear." },
    82: { text: "Violent Showers", icon: "CloudRain", spiderText: "Violent downpour. Avoid open lightning rods." },
    85: { text: "Snow Showers", icon: "CloudSnow", spiderText: "Intermittent snow flurries." },
    86: { text: "Heavy Snow Showers", icon: "CloudSnow", spiderText: "Blizzard flurries. Wind shear elevated." },
    95: { text: "Thunderstorm", icon: "CloudLightning", spiderText: "ELECTRICAL STORM DETECTED! High voltage discharge risk." },
    96: { text: "Thunderstorm w/ Hail", icon: "CloudLightning", spiderText: "Severe hail and lightning storm. Armor deflectors up." },
    99: { text: "Severe Thunderstorm", icon: "CloudLightning", spiderText: "CRITICAL STORM CELL! Lightning strike probability 78%." },
  };
  return mapping[code] || { text: "Partly Cloudy", icon: "CloudSun", spiderText: "Weather conditions stable." };
}

/**
 * Get device GPS coordinates via HTML5 Geolocation API with IP fallback
 */
export async function getDeviceCoordinates() {
  // 1. Try HTML5 Browser GPS
  if (typeof window !== "undefined" && navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 300000, // 5 mins cache
        });
      });
      if (pos && pos.coords) {
        return {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          source: "gps",
        };
      }
    } catch (e) {
      console.warn("[Weather/Location] Browser GPS unavailable, falling back to IP:", e.message || e);
    }
  }

  // 2. Fallback to client-side IP lookup via ipwho.is
  try {
    const res = await fetch("https://ipwho.is/", { cache: "no-cache" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.latitude && data.longitude) {
        return {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          city: data.city,
          region: data.region,
          country: data.country,
          source: "ip",
        };
      }
    }
  } catch (err) {
    console.warn("[Weather/Location] ipwho.is failed, trying ipapi:", err);
  }

  // 3. Fallback to ipapi.co
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-cache" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        return {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          city: data.city,
          region: data.region,
          country: data.country_name,
          source: "ip",
        };
      }
    }
  } catch (_) {}

  // 4. Ultimate fallback (Bengaluru coordinates default)
  return {
    latitude: 12.9716,
    longitude: 77.5946,
    city: "Local Device",
    region: "",
    country: "",
    source: "default",
  };
}

/**
 * Direct client-side weather fetcher as an ultra-resilient fallback
 */
async function fetchClientDirectWeather(lat, lng, knownCity, knownRegion, knownCountry, source) {
  let cityName = knownCity;
  let regionName = knownRegion;
  let countryName = knownCountry;

  // Reverse Geocode if needed
  if (!cityName || cityName === "Local Device") {
    try {
      const revRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (revRes.ok) {
        const rd = await revRes.json();
        cityName = rd.city || rd.locality || rd.principalSubdivision || "Your City";
        regionName = rd.principalSubdivision || "";
        countryName = rd.countryName || "";
      }
    } catch (_) {}
  }

  const locParts = [cityName, regionName, countryName].filter(Boolean);
  const locationString = locParts.length > 0 ? locParts.join(", ") : "Your Device Location";

  // Query Open-Meteo directly from browser
  const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
  const mRes = await fetch(meteoUrl);
  if (!mRes.ok) throw new Error("Open-Meteo request failed");

  const wdata = await mRes.json();
  const current = wdata.current || {};
  const daily = wdata.daily || {};

  const temp = Math.round(current.temperature_2m ?? 24);
  const feelsLike = Math.round(current.apparent_temperature ?? temp);
  const tempF = Math.round((temp * 9) / 5 + 32);
  const feelsLikeF = Math.round((feelsLike * 9) / 5 + 32);
  const humidity = Math.round(current.relative_humidity_2m ?? 55);
  const windKmh = Math.round(current.wind_speed_10m ?? 10);
  const windMph = Math.round(windKmh * 0.621371);
  const windDir = current.wind_direction_10m ?? 0;
  const code = current.weather_code ?? 0;
  const isDay = current.is_day ?? 1;
  const pressure = Math.round(current.surface_pressure ?? 1013);

  const wmo = getWmoCondition(code);

  const forecast = [];
  const dailyTimes = daily.time || [];
  const dailyCodes = daily.weather_code || [];
  const dailyMax = daily.temperature_2m_max || [];
  const dailyMin = daily.temperature_2m_min || [];

  for (let i = 0; i < Math.min(dailyTimes.length, 7); i++) {
    const dt = dailyTimes[i];
    let dayLabel = "Day " + (i + 1);
    try {
      const d = new Date(dt + "T00:00:00");
      dayLabel = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
    } catch (_) {}

    const fCode = dailyCodes[i] ?? 0;
    const fWmo = getWmoCondition(fCode);

    forecast.push({
      day: dayLabel,
      date: dt,
      hi: Math.round(dailyMax[i] ?? temp + 2),
      lo: Math.round(dailyMin[i] ?? temp - 4),
      condition: fWmo.text,
      code: fCode,
      icon: fWmo.icon,
    });
  }

  const uvList = daily.uv_index_max || [];
  const uvVal = uvList.length > 0 ? Number(uvList[0].toFixed(1)) : 4.0;

  return {
    status: "success",
    location: locationString,
    city: cityName || "Device Location",
    region: regionName || "",
    country: countryName || "",
    latitude: lat,
    longitude: lng,
    source: source || "gps",
    temp,
    temp_str: `${temp}°C`,
    temp_c: `${temp}°c`,
    temp_f: `${tempF}°F`,
    feels_like: `${feelsLike}°C`,
    feels_like_c: `${feelsLike}°c`,
    feels_like_f: `${feelsLikeF}°F`,
    condition: wmo.text,
    condition_code: code,
    icon: wmo.icon,
    spider_text: wmo.spiderText,
    is_day: isDay,
    humidity: `${humidity}%`,
    humidity_val: humidity,
    wind: `${windKmh} km/h`,
    wind_kmh: windKmh,
    wind_mph: `${windMph} mph`,
    wind_direction: windDir,
    pressure: `${pressure} hPa`,
    uv_index: uvVal,
    forecast: forecast.length > 0 ? forecast : [
      { day: "Today", hi: temp + 2, lo: temp - 4, condition: wmo.text, code, icon: wmo.icon },
      { day: "Tomorrow", hi: temp + 3, lo: temp - 3, condition: "Partly Cloudy", code: 2, icon: "CloudSun" },
    ],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch real device location & weather data
 */
export async function fetchDeviceWeather(forceRefresh = false) {
  // Check local cache if not forcing refresh
  if (!forceRefresh && typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(WEATHER_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_DURATION_MS && parsed.data) {
          return parsed.data;
        }
      }
    } catch (_) {}
  }

  // 1. Get real device coordinates
  const coords = await getDeviceCoordinates();
  const { latitude, longitude, city, region, country, source } = coords;

  let weatherPayload = null;

  // 2. Try backend endpoint with precise coordinates
  try {
    const res = await http.get(`/browser/weather?lat=${latitude}&lng=${longitude}`, { timeout: 4000 });
    if (res.data && res.data.status === "success" && res.data.temp !== undefined) {
      weatherPayload = {
        ...res.data,
        source: source || "gps",
        spider_text: getWmoCondition(res.data.condition_code || 0).spiderText,
      };
    }
  } catch (backendErr) {
    console.warn("[Weather/Location] Backend weather endpoint failed, falling back to direct browser request:", backendErr);
  }

  // 3. If backend was unreachable or returned empty, query directly from browser
  if (!weatherPayload) {
    weatherPayload = await fetchClientDirectWeather(latitude, longitude, city, region, country, source);
  }

  // Save to cache
  if (typeof window !== "undefined" && weatherPayload) {
    try {
      localStorage.setItem(
        WEATHER_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: weatherPayload,
        })
      );
      window.dispatchEvent(new CustomEvent("nexus_weather_updated", { detail: weatherPayload }));
    } catch (_) {}
  }

  return weatherPayload;
}

/**
 * React Hook for real-time device location & weather telemetry
 */
export function useDeviceWeather() {
  const [weather, setWeather] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(WEATHER_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.data) return parsed.data;
        }
      } catch (_) {}
    }
    return null;
  });

  const [loading, setLoading] = useState(!weather);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDeviceWeather(force);
      setWeather(data);
      return data;
    } catch (err) {
      console.error("[useDeviceWeather] Error:", err);
      setError(err.message || "Failed to fetch weather telemetry");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(false);

    const handleSync = (e) => {
      if (e.detail) setWeather(e.detail);
    };
    window.addEventListener("nexus_weather_updated", handleSync);

    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      loadWeather(true);
    }, 15 * 60 * 1000);

    return () => {
      window.removeEventListener("nexus_weather_updated", handleSync);
      clearInterval(interval);
    };
  }, [loadWeather]);

  const requestGpsLocation = useCallback(async () => {
    return await loadWeather(true);
  }, [loadWeather]);

  return {
    weather,
    loading,
    error,
    refresh: () => loadWeather(true),
    requestGpsLocation,
    isGps: weather?.source === "gps",
  };
}
