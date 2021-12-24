import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import Constant from 'expo-constants';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, openDrawer, DrawerContentScrollView , DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { withAuthenticator } from 'aws-amplify-react-native'

import Home from './screen/home.tsx';
import ProductScreen from './screen/product.tsx';
import ShoppingCartScreen from './screen/ShoppingCart.tsx';
import RootStack from './screen/rootstack.tsx';
import CheckOutScreen from './screen/checkout.js';
import {DrawerContent} from './screen/DrawerContent.tsx';
import Amplify from 'aws-amplify'
import config from './src/aws-exports'
//Amplify.configure(config)

//Got an unhandled rejection and this seems to solve the issue.
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
LogBox.ignoreLogs(['Setting a timer']);

function App() {
  return (
  <NavigationContainer>
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} /> }
        screenOptions = {{
            headerShown: false,
        }}
    >
        <Drawer.Screen name = 'RootStack' component = {RootStack} options = {{
            title: "Home",
        }}/>
    </Drawer.Navigator>
  </NavigationContainer>
  );
}

export default withAuthenticator(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constant.statusBarHeight,
  },
});
