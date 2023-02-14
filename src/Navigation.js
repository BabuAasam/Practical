import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MovieList from './screen/MovieList';
import MainList from './screen/MainList';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainList">
        <Stack.Screen
          name="MovieList"
          component={MovieList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainList"
          component={MainList}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
