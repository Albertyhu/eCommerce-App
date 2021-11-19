import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Constant from 'expo-constants';
import {openDrawer } from '@react-navigation/drawer';

import ProductData from '../asset/products.ts';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../component/imageCarousel.js';

import QuantitySelector from '../component/quantityselector.js';

/*
const generateKey = id =>{
    return `${id}-${Math.random() * 100000 - 1}`
}

*/
function ConvertRating(rating){
    const ratingArray = [];

    for(let i = 0; i < Math.floor(rating); i++){
        ratingArray[i] = (<View key = {i}><Icon name = 'star' size = {25} color = '#e47911' /></View>)
    }
    let num = ratingArray.length;
    if((Math.floor(rating) + 0.5 ) < rating) {
        ratingArray[num] = (<View key = {num + 1}><Icon name = 'star-half' size = {25} color = '#e47911' /></View>)
    }
    for(let i = ratingArray.length; i < 5; i++){
        ratingArray[i] = (<View key = {i + 1}><Icon name = 'star-outline' size = {25} color = '#e47911' /></View>)
    }
    return ratingArray;
}

const Product = (props, {route, navigation}) =>{
const [product, setProduct] = useState([]);
const [colorOptions, setColorOptions] = useState([]);
const [selectedOption, setSelectedOption] = useState('black');
const pickerRef = useRef();

const openPicker = () =>{
     pickerRef.current.focus();
}

const closePicker = () =>{
    pickerRef.current.blur();
}

const DisplayColorOptions = () =>{
    //this works
    //return product.options ? product.options.map(val => <Text key = {val + 1}>{val}</Text>) : null
return (product.options ?
            <TouchableOpacity style = {styles.picker} onPress = {openPicker}>
            <Picker
                ref = {pickerRef}
                selectedValue={selectedOption}
                onValueChange={itemValue => setSelectedOption(itemValue) }
               style = {styles.pickerItem}
            >
                {product.options.map((val, key) => <Picker.Item key = {key} label = {val} value = {val} itemStyle = {{color: '#fff'}} />)}
            </Picker>
            </TouchableOpacity>
            :
            <View>
            </View>
)
}

const fetchProduct = () =>{
    const newProduct = ProductData.filter(val => val.id === props.route.params.ProductID);
 //   console.log(newProduct)
    setProduct(...newProduct);
}




useEffect(()=>{
    fetchProduct();
}, [])

return(
<ScrollView>
    <View style = {styles.container}>
        <View style = {styles.body}>
            <Text style = {styles.title}>{product.title}</Text>
            {/*
            <Image
                source = {{uri: product.image}}
                style = {styles.image}
            /> */}
            <Carousel data = {product.images} />
            <View style = {styles.dotContainer}>
                 {/*
                 product.images &&
                 product.images.map(val =>(
                        <View style = {styles.dot} key = {generateKey(product.id)}></View>
                 ))*/}
            </View>
            <View style = {styles.priceContainer}>
                <Text style ={styles.currentPrice}>From {product.price}</Text>
                {product.oldPrice && <Text style = {styles.oldPrice}>{product.oldPrice}</Text>}
            </View>
            {product.ratings!= 0 ?
                <View style = {styles.ratingContainer}>
                <Text>Rating: </Text>
                 {ConvertRating(product.avgRating)}
                <Text>{product.ratings} ratings</Text>
                </View>
               :
               <View><Text>No ratings yet</Text></View>
            }
            {DisplayColorOptions()}
            {product.description &&
            <View style = {styles.description}>
                <Text style = {{lineHeight: 20}}>{product.description}</Text>
            </View>
            }
            <QuantitySelector />
            <TouchableOpacity style = {styles.actionButton}>
                <View><Text>Add to Cart</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.actionButton}>
                <View><Text>Buy Now</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.actionButton}>
                <View><Text>Proceed to Check Out</Text></View>
            </TouchableOpacity>
        </View>
    </View>
</ScrollView>
)
}

export default Product;

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