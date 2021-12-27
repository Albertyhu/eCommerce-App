import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import Constant from 'expo-constants';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, openDrawer, DrawerContentScrollView , DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { withAuthenticator } from 'aws-amplify-react-native';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware } from 'redux'
import {Provider} from 'react-redux';
import Amplify from 'aws-amplify'
import config from './src/aws-exports'
import {SupportContext} from './component/DrawerContext.tsx';

import Home from './screen/home.tsx';
import ProductScreen from './screen/product.tsx';
import ShoppingCartScreen from './screen/ShoppingCart.tsx';
import RootStack from './screen/rootstack.tsx';
import CheckOutScreen from './screen/checkout.js';
import DrawerContent from './screen/DrawerContent.tsx';
import RootReducer from './redux/reducers';

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

/*Redux Store code */
//The Redux store and passing context code are solely to update the number of items in the Shopping Cart indicated in the Drawer every time...
//an item gets added or deleted in the Shopping Cart
const store = createStore(RootReducer, applyMiddleware(thunk))

/*Redux Store code end */

function App() {
const [itemTotal, setTotal] = useState(0);

const supportContext = React.useMemo(()=>({
setItemTotal: (num) =>{
    setTotal(num);
},
returnItemTotal: ()=>{return itemTotal}
}))

  return (
  <Provider store = {store}>
  <NavigationContainer>
  <SupportContext.Provider value = {supportContext}>
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} /> }
        screenOptions = {{
            headerShown: false,
        }}
    >
        <Drawer.Screen name = 'RootStack' component = {RootStack} options = {{
            title: "Home",
        }}/>
    </Drawer.Navigator>
    </SupportContext.Provider>
  </NavigationContainer>
  </Provider>

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
