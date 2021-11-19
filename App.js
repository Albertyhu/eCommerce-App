import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constant from 'expo-constants';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, openDrawer, DrawerContentScrollView , DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './screen/home.js';
import ProductScreen from './screen/product.js';
import ShoppingCartScreen from './screen/ShoppingCart.js';
import RootStack from './screen/rootstack.js';
import {DrawerContent} from './screen/DrawerContent.js';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
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
        <Drawer.Screen name = 'ShoppingCart' component = {ShoppingCartScreen} options = {{
            title: 'Shopping Cart',
        }} />
    </Drawer.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constant.statusBarHeight,
  },
});
