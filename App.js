import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import React, {useEffect, useState} from "react";
import { Fontisto } from '@expo/vector-icons';

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = 'b50cb30c632114573a377bb9c6c95de3';

const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Snow : 'snow',
  Rain: 'rains',
  Drizzle: 'rain',
  Thunderstorm: 'lightning',
  Atmosphere: 'cloudy-gusts'
}

export default function App() {
  NavigationBar.setBackgroundColorAsync('olive');
  const [days, setDays] = useState([]);
  const [city, setCity] = useState('loading...');
  const getWeather = async() => {
    const granted = await Location.requestForegroundPermissionsAsync();
    if(!granted){
    } else{
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
      const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
      console.log(location);
      setCity(location[0].city);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
      const json = await response.json();
      setDays(json.daily);
    }
  }
  console.log("location2");
  useEffect(()=>{getWeather()}, []);

  return (
    <View style={styles.container}>
      <StatusBar style={{backgroundColor: 'olive'}}></StatusBar>
      <View style={styles.location}>
        <Text style={styles.bigFont}>{city}</Text>
      </View>

      <ScrollView
      pagingEnabled
      horizontal
      contentContainerStyle={styles.weather}
      showsHorizontalScrollIndicator={false}
      >
        { 
          days.length===0 ? (
          <View style={{...styles.day, alignItems: 'center'}}>
            <ActivityIndicator
            color="white" size="large"
            />
          </View>
          ) : (
            days.map((day, index) =>
          <View key={index} style={styles.day}>
            <View style={{
              flexDirection: "row",
              alignItems:"center",
              width: "100%",
              paddingRight: 30,
              justifyContent:"space-between"
              }}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size = {44} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'olive'
  },
  location: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weather: {
  },
  bigFont: {
    color: 'white',
    fontSize: 54,
    fontWeight: '600'
  },
  day: {
    paddingLeft: 20,
    width: SCREEN_WIDTH,
  },
  description: {
    color: 'white',
    fontSize: 44,
    marginTop: -10,
    fontWeight: '100'
  },
  temp:{
    color: 'white',
    marginTop: 60,
    fontSize: 144
  },
  tinyText:{
    color: 'white',
    fontSize: 24,
  }
});