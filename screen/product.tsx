import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Constant from 'expo-constants';
import {openDrawer } from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {DataStore, Auth} from 'aws-amplify';
import {Product, CartProduct } from '../src/models';
import {bindActionCreators } from 'redux';
import {connect } from 'react-redux';

import ProductData from '../asset/products.ts';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../component/imageCarousel.js';

import QuantitySelector from '../component/quantityselector.tsx';
import CheckOutScreen from './checkout.js';

import ShoppingCartScreen from './ShoppingCart.tsx';
import RootStack from './rootstack.tsx';
import Home from './home.tsx';
import Search from './search.js';

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

const ProductScreen = (props, {route, navigation}) =>{

const navi = useNavigation();

const [store, setStore ] = useState([])
const [product, setProduct] = useState([]);
const [colorOptions, setColorOptions] = useState([]);
const [selectedOption, setSelectedOption] = useState('black');
const [description, setDescription] = useState('');
const [extend, setExtend] = useState(false);
const [shouldExpand, createExpandButton] = useState(false);
const [expandButton, setExpandButton] = useState(true);
const [quantity, setQuantity] = useState<Int>(1)

const pickerRef = useRef();

const openPicker = () =>{
     pickerRef.current.focus();
}

const closePicker = () =>{
    pickerRef.current.blur();
}


/*code for product options */
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
/*end code for product options*/

const fetchProduct = async () =>{
  //The following line is no longer in use. It serves as a fake list of products.
  //  const newProduct = ProductData.filter(val => val.id === props.route.params.ProductID);

  //Retrieve the selected product with product's ID
  //const newProduct = store.filter(val => val.id === props.route.params.ProductID);

 //   console.log(newProduct)
   // setProduct(newProduct[0]);

//My previous methods didn't work, but this code which I copied from the tutorial worked
await DataStore.query(Product, props.route.params.ProductID).then(setProduct)
}

const fetchStore = async  () =>{
    await DataStore.query(Product).then(results => setStore(results))
}

const handleDescription = () =>{
if(product.description.length > 1000){
    setDescription(product.description.substring(0, 1000))
    createExpandButton(true)
}
else {
    setDescription(product.description)
}
}

/*Add to Cart code */

const addToCart = async () =>{
//Retrieve data of current user
const userData = await Auth.currentAuthenticatedUser();

//Find any existing product in the Cart that is the same as what the user has chosen to add to the cart using ProductID and option
//If there aren't any, duplicateProduct should return false
const duplicateProduct = await DataStore.query(CartProduct, val => val.and(val => val.productID("eq", props.route.params.ProductID)
    .option("eq", selectedOption)
    .userSub("eq", userData.attributes.sub)))

if(quantity > 0){
    if(duplicateProduct.length !== 0){
        await DataStore.save(CartProduct.copyOf(duplicateProduct[0], updated => {
            //add the new and old quantities together
            updated.quantity += quantity;
            props.navigation.navigate('RootStack', {screen: 'ShoppingCartScreen', initial: false,})
        }))
    }
    else{
        if(!product || !userData){
            return;
        }

        const newCartProduct = new CartProduct({
           userSub: userData.attributes.sub,
           quantity,
           option: selectedOption,
           productID: product.id,
        })
         DataStore.save(newCartProduct);
        props.navigation.navigate('RootStack', {screen: 'ShoppingCartScreen', initial: false,});
    }
    }
else{
                alert('You have selected 0 quantity to purchase for this product.')
}

}

/*Add to Cart End*/

useEffect(()=>{
   // fetchStore();
    fetchProduct();
}, [])


const ToggleExpansion = () =>{
    if(expandButton){
        setExpandButton(false)
    }
    else{
        setExpandButton(true)
    }
}

useEffect(()=>{
    if(!props.route.params?.ProductID){
        return;
    }
    fetchProduct();
}, [props.route.params?.ProductID])

//Because that retrieving data from the datastore takes time, the app has to check whether the desired data exist or not in its own side
/*
useEffect(()=>{
    if(product?.title){
        console.log(product?.title)
    }
}, [product?.title])
*/

//Code for product description.

useEffect(()=>{
    if(product?.description){
        handleDescription();
    }
}, [product?.description])

useEffect(()=>{
if(product?.description){
    if(expandButton){
       setDescription(product.description.substring(0, 1000))
    }
    else{
       setDescription(product.description)
    }
   }
}, [expandButton])
/*product description end code */

return(
<ScrollView>
{/*
Using the ? operator is necessary to make this work. I found that without it, the screen loads before the data from datastore does, and therefore it throws an error.
*/}
{ product.price ?
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
                <Text style ={styles.currentPrice}>From ${product.price.toFixed(2)}</Text>
                {product.oldPrice && <Text style = {styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>}
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
            <View>
                <View style = {styles.description}>
                    <Text style = {{lineHeight: 20}}>{description}</Text>
                </View>
                <View style = {styles.expandButtonContainer}>
                    {shouldExpand ?
                        expandButton ?
                            <TouchableOpacity style = {styles.expandButton} onPress = {ToggleExpansion}>
                                <View>
                                    <Text style = {styles.expandButtonText}>Expand +</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style = {styles.expandButton} onPress = {ToggleExpansion}>
                                <View>
                                    <Text style = {styles.expandButtonText}>Collapse -</Text>
                                </View>
                            </TouchableOpacity>
                        :
                        null
                    }
                </View>
            </View>
            }
            <QuantitySelector finalQ = {quantity} setFinalQ = {setQuantity} />
            <TouchableOpacity style = {styles.actionButton} onPress = {addToCart}>
                <View><Text>Add to Cart</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.actionButton}>
                <View><Text>Buy Now</Text></View>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => props.navigation.navigate('CheckOutScreen')} style = {styles.actionButton}>
                <View><Text>Proceed to Check Out</Text></View>
            </TouchableOpacity>
        </View>
    </View>
    :
    <View style = {styles.container}>
        <Text>No Product</Text>
    </View>
    }
</ScrollView>
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
expandButton:{
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
    width: '60%',
},
expandButtonContainer:{
    alignItems: 'center',
},
expandButtonText:{
    padding: 5,
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