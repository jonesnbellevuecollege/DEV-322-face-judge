import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import useRecommendationEngine from './useRecommendationEngine';
import useSensorManager from './useSensorManager';
import { MoodEntry } from '@/components/MoodEntry';

// Vlad & Singh

export default function useMoodEngineInterface(): MoodEntry {
  const { light, steps, altitude, loading, battery } = useSensorManager();

  const [temperature, setTemperature] = useState(22);
  const [moodLabel, setMoodLabel] = useState('');
  const [emoji, setEmoji] = useState('');
  const [suggestion, setSuggestion] = useState('');

  // Fetch only the temperature (weather part)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const loc = await Location.getCurrentPositionAsync({});
        const weather = await fetch(`https://wttr.in/${loc.coords.latitude},${loc.coords.longitude}?format=j1`)
          .then(res => res.json())
          .catch(() => null);

        if (weather?.current_condition?.[0]?.temp_C) {
          setTemperature(parseFloat(weather.current_condition[0].temp_C));
        }
      } catch (err) {
        console.warn('Weather error:', err);
      }
    };

    fetchWeather();
  }, []);

  useRecommendationEngine({ light, temperature, steps, altitude, loading, battery, setMoodLabel, setEmoji, setSuggestion });

  return { moodLabel, emoji, suggestion, loading };
}
