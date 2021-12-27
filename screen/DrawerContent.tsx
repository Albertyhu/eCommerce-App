import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Constant from 'expo-constants';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, goBack, StackActions } from '@react-navigation/native';
import { createDrawerNavigator, openDrawer, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {Drawer, Divider} from 'react-native-paper';
import {DataStore, Auth} from 'aws-amplify';
import {CartProduct} from '../src/models/index.js';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {SupportContext} from '../component/DrawerContext.tsx';

import Home from './home.tsx';
import ProductScreen from './product.tsx';
import ShoppingCartScreen from './ShoppingCart.tsx';
import SearchScreen from './search.js';
import {fetchCartP} from '../redux/action';

const popAction = StackActions.pop(1);

function DrawerContent(props) {

const {fetchCartP} = props;
const {Cart_data, TotalItem_redux} = props;
const [cart, setCart] = useState<CartProduct[]>([])
const [totalItems, setTotal] = useState<Int>(0);
const {setItemTotal, returnItemTotal} = React.useContext(SupportContext);


//not in use
const fetchCart = async () =>{
    const userData = await Auth.currentAuthenticatedUser()
    await DataStore.query(CartProduct, val => val.userSub("eq", userData.attributes.sub)).then(setCart)
}

//This function is no long in use since I'm using redux to update total number of items in Shopping Cart
const sumTotalItems = () =>{
    let sumTotal = 0;
    cart.forEach(i => {
        sumTotal += i.quantity;
    })
    setTotal(sumTotal)
}
useEffect(()=>{
    fetchCartP();
}, [])

useEffect(()=>{
    setItemTotal(TotalItem_redux);
}, [TotalItem_redux])


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
               label ={() => <Text>Shopping Cart [
                {cart ? <Text style = {{color: 'red'}}>{returnItemTotal()} items</Text>
                    : <Text> {randNum} items</Text>
                }]
                </Text>}
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
           <Drawer.Section>
            <Divider />
               <DrawerItem
                   icon={({color, size}) => (
                       <Icon
                           name='exit-outline'
                           color={color}
                           size={size}
                       />
                   )}
                   label = "Logout"
                   onPress = {() => Auth.signOut()}
                   style = {styles.drawerItem}

               />
           </Drawer.Section>
    </DrawerContentScrollView>
</View>
);
}

const mapStateToProps = store => {
    return{
        Cart_data: [...store.CartReducer.cartArray],
        TotalItem_redux: store.CartReducer.totalQuantity,
    }
}
const mapDispatchToProps = dispatch => bindActionCreators({fetchCartP}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

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
