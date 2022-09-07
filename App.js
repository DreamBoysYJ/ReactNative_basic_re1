import * as Location from "expo-location";
import { StatusBar } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "72e8add4459f7cfe1591b5e7d79659eb";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightening",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="black" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={{ fontSize: 50 }}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <Fontisto
                style={{ marginTop: 20 }}
                name={icons[day.weather[0].main]}
                size={160}
                color="black"
              />
              <Text style={styles.temp}>
                {`${parseFloat(day.temp.day).toFixed(1)} c`}
              </Text>

              <Text style={styles.description}>{day.weather[0].main}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCF05",
  },
  city: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "600",
  },

  weather: {},
  day: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 10,
    fontSize: 80,
  },
  description: {
    marginTop: 10,
    fontSize: 50,
  },
  tinyText: {
    fontSize: 20,
  },
});
