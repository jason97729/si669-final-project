import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from './LoginScreen';
import { RecipesScreen } from './RecipesScreen';
import { DetailScreen } from './DetailScreen';
import { AddRecipeNameScreen } from './AddRecipeNameScreen';
import { CameraScreen } from './CameraScreen';
/*
import { ChatScreen } from './ChatScreen';
import { CameraScreen } from './CameraScreen';
*/

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"   
        screenOptions={{
          headerShown: true
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Recipes" component={RecipesScreen} />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name='AddRecipeName' component={AddRecipeNameScreen} />
        <Stack.Screen name='Camera' component={CameraScreen} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// <Stack.Screen name="Chat" component={ChatScreen} />
// <Stack.Screen name="Camera" component={CameraScreen} />