import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Constant from 'expo-constants';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, goBack, StackActions } from '@react-navigation/native';
import { createDrawerNavigator, openDrawer, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {Drawer} from 'react-native-paper';

import Home from './home.js';
import ProductScreen from './product.js';
import ShoppingCartScreen from './ShoppingCart.js';
import SearchScreen from './search.js';

const popAction = StackActions.pop(1);
export function DrawerContent(props) {
return (
<View style = {styles.drawerContainer}>
    <DrawerContentScrollView {...props}>
        <View style = {styles.title}>
            <Text style = {{fontSize: 20,}}>Menu</Text>
        </View>
           <DrawerItem
               icon={({color, size}) => (
                   <Icon
                       name='home-outline'
                       color={color}
                       size={size}
                   />
               )}
               label = 'Home'
               onPress = {()=>{props.navigation.navigate('Home')}}
           />
           <DrawerItem
               icon={({color, size}) => (
                   <Icon
                       name='cart-outline'
                       color={color}
                       size={size}
                   />
               )}
               label = "Shopping Cart"
               onPress = {()=>{props.navigation.navigate('ShoppingCartScreen')}}
               style = {styles.drawerItem}

           />
           <DrawerItem
               icon={({color, size}) => (
                   <Icon
                       name='search'
                       color={color}
                       size={size}
                   />
               )}
               label = "Search for a product"
               onPress = {()=>{props.navigation.navigate('SearchScreen')}}
               style = {styles.drawerItem}

           />
    </DrawerContentScrollView>
</View>
);
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    marginHorizontal: 10,
  },
  buttonText:{
    fontSize: 15,
    padding: 5,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000'
 //   paddingTop: Constant.statusBarHeight,
  },
  drawerItem:{},
  menuButton:{
    marginLeft: 10,
  },
  title: {
    marginHorizontal: 20,
    fontWeight: 'bold',

  },
});
