import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Constant from 'expo-constants';
import {openDrawer } from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {DataStore} from 'aws-amplify';
import {Product} from '../src/models';

import ProductData from '../asset/products.ts';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../component/imageCarousel.js';

import QuantitySelector from '../component/quantityselector.js';
import CheckOutScreen from './checkout.js';


const ProductScreen = (props, {navigation, route}) =>{
const [store, setStore] = useState<Product[]>([]);
const [product, setProduct] = useState([]);

const fetchProduct = async () =>{
//    const selectedProduct = store.filter(val => val.id === props.route.params.ProductID)
 //   setProduct(selectedProduct[0]);
     await DataStore.query(Product, props.route.params.ProductID).then(setProduct)
}

const fetchStore = async ()=>{
    await DataStore.query(Product).then(result => setStore(result))
        console.log('ID: ' + props.route.params.ProductID)
}
useEffect(()=>{
   // fetchStore();
    fetchProduct();

}, [])

return(
<View style = {styles.container}>
   {product.price ?
   <View>
    <Text>{product.title}</Text>
    <Image
        source = {{uri: product.image}}
        style = {styles.image}
    />
    <Text>Price: ${product.price.toFixed(2)}</Text>
    <Text>Old Price: ${product.oldPrice.toFixed(2)}</Text>
    <Text>{product.description}</Text>
    </View>
    :
    <View></View>
    }
</View>
)
}

export default ProductScreen;

const winWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({

actionButton:{
    borderRadius: 5,
    width: 300,
    backgroundColor: '#e47911',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginVertical: 10,
    borderColor: '#c46b14',
    borderWidth: 1,
},
body:{
    alignItems: 'center',
},
container: {
    alignItems: 'center',
    flex: 1,
   // paddingTop: Constant.statusBarHeight,
},
description:{
    paddingHorizontal: 15,
    paddingVertical: 10,
},
dot:{
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: '#d5d5d5',
    margin: 5,
},
dotContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
},
header: {
    backgroundColor: '#fff',
    width: winWidth,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
},
image: {
    width: 300,
    height: 300,
},
logo: {
    width: '60%',
    height: '100%',
},
currentPrice: {
    fontSize: 25,
    fontWeight: 'bold'
},
oldPrice:{
    textDecorationLine: 'line-through',
    fontSize: 15,
},
picker:{
      width: 200,
      height: 50,
      borderColor: '#000',
      borderWidth: 1,
      marginVertical: 10,
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: '#d8d8d8',
},
pickerItem:{
      color: '#000',
    },
priceContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
},
ratingContainer:{
    flexDirection: 'row',
    alignItems: 'flex-end',
},
title:{
    fontWeight: 'bold',
    fontSize: 25,
    paddingHorizontal: 10,
},
})