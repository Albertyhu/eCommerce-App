import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Constant from 'expo-constants';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, goBack, StackActions } from '@react-navigation/native';
import { createDrawerNavigator, openDrawer } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {DataStore, Auth} from 'aws-amplify';
import {CartProduct} from '../src/models/index.js';

import Home from './home.tsx';
import ProductScreen from './product.tsx';
import ShoppingCartScreen from './ShoppingCart.tsx';
import CheckOutScreen from './checkout.js';
import SearchScreen from './search.js';
import EditProductScreen from './EditProduct.tsx';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const popAction = StackActions.pop(1);
export default function RootStack({navigation}) {
  return (
    <Stack.Navigator screenOptions = {{
        //headerShown: false,
    }}
    initialRouteName = "Home"
    >
        <Stack.Screen name = 'Home' component = {Home} navigation = {navigation}
        options = {{
            title: 'Home',
            headerLeft: ()=>(<Icon name = 'ios-menu' color = '#000' size = {25} onPress = {navigation.openDrawer} style = {styles.menuButton}/> ),
          headerStyle: {backgroundColor: '#cdbc00'}
        }}/>
        <Stack.Screen name = 'ProductScreen' component = {ProductScreen} navigation = {navigation} options = {{
            title: "Product",
            headerLeft: ()=>(<Icon name = 'ios-menu' color = '#000' size = {25} onPress = {navigation.openDrawer} style = {styles.menuButton}/> ),
            headerRight: () =>(<TouchableOpacity style = {styles.button} onPress = {() =>navigation.dispatch(popAction)}>
                    <View>
                        <Text style = {styles.buttonText}>Go Back</Text>
                    </View>
                </TouchableOpacity>),

        }} />
        <Stack.Screen name = 'EditProductScreen' component = {EditProductScreen} navigation = {navigation} options = {{
            title: "Edit Product",
            headerLeft: ()=>(<Icon name = 'ios-menu' color = '#000' size = {25} onPress = {navigation.openDrawer} style = {styles.menuButton}/> ),
            headerRight: () =>(<TouchableOpacity style = {styles.button} onPress = {() =>navigation.dispatch(popAction)}>
                    <View>
                        <Text style = {styles.buttonText}>Go Back</Text>
                    </View>
                </TouchableOpacity>),

        }} />
        <Stack.Screen name = 'ShoppingCartScreen' component = {ShoppingCartScreen} options = {{
            title: 'Shopping Cart',
            headerLeft: ()=>(<Icon name = 'ios-menu' color = '#000' size = {25} onPress = {navigation.openDrawer} style = {styles.menuButton}/> ),
            headerRight: ()=>( <TouchableOpacity style = {styles.backButton} onPress = {() =>navigation.goBack()}>
                                          <View>
                                              <Text style = {styles.backButtonText}>Go Back</Text>
                                          </View>
                                      </TouchableOpacity>)
                     }}
         />
        <Stack.Screen name='CheckOutScreen' component = {CheckOutScreen} options = {{
            title: "Check Out",
            headerLeft: ()=>(<Icon name = 'ios-menu' color = '#000' size = {25} onPress = {navigation.openDrawer} style = {styles.menuButton}/> ),
            headerRight: ()=>( <TouchableOpacity style = {styles.backButton} onPress = {() =>navigation.goBack()}>
                                          <View>
                                              <Text style = {styles.backButtonText}>Go Back</Text>
                                          </View>
                            </TouchableOpacity>)
                     }}
         />
       <Stack.Screen name='SearchScreen' component = {SearchScreen} options = {{
           title: "Search Out",
           headerLeft: ()=>(<Icon name = 'ios-menu' color = '#000' size = {25} onPress = {navigation.openDrawer} style = {styles.menuButton}/> ),
           headerRight: ()=>( <TouchableOpacity style = {styles.backButton} onPress = {() =>navigation.goBack()}>
                                         <View>
                                             <Text style = {styles.backButtonText}>Go Back</Text>
                                         </View>
                           </TouchableOpacity>)
                    }}
        />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    marginHorizontal: 10,
  },
  backButtonText:{
    fontSize: 15,
    padding: 5,
  },
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
 //   paddingTop: Constant.statusBarHeight,
  },
  menuButton:{
    marginLeft: 10,
  },
});
