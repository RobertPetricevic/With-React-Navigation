import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as TaskManager from 'expo-task-manager';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    return;
  }
  if (data) {
    console.log('NAVIGATION data:', data);
  }
});

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  async function requestPermissions() {
    const requestForeground = Location.requestForegroundPermissionsAsync;
    const requestBackground = Location.requestBackgroundPermissionsAsync;

    const foregroundRequest = await requestForeground();
    if (foregroundRequest.granted) {
      const backgroundRequest = await requestBackground();
      if (backgroundRequest.granted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest,
          activityType: Location.LocationActivityType.Fitness,
          foregroundService: {
            notificationTitle: 'Location',
            notificationBody: 'Tracking your location',
          },
        });
      }
    }
    return false;
  }

  React.useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
