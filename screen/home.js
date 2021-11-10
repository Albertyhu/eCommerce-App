import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Image, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductData from '../asset/products.ts';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Constant from 'expo-constants';

import ProductScreen from './product.js';

function randNum(){
return Math.floor(Math.random() * 100)
}

const ListHeaderComponent = () =>{
return(
    <View style = {styles.header}>
        <Image
            source = {require('../asset/GearTechLogo2.jpg')}
            style = {styles.logo}
        />
    </View>
)
}

const renderItem = ({item}, navigation) =>{
//const [ratingStars, setStars] = useState([])
function renderStar(){
 return <Icon name = 'star' size = {25} color = '#e47911' />
}

function renderHalfStar(){
return(
<Icon name = 'star-half' size = {25} color = '#e47911' />
)
}
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

const viewProduct = () =>{
    navigation.navigate('ProductScreen', {ProductID: item.id})
}

return(
<TouchableOpacity onPress = {viewProduct} >
    <View style = {styles.wholeContainer}>
        <View style = {styles.productContainer}>
        <Image source = {{uri: item.image}} style = {styles.image} resizeMode = 'contain'/>
        <View style = {styles.textInfo}>
            <Text style = {styles.title}>{item.title}</Text>
            <View style = {styles.rating}>
                {ConvertRating(item.avgRating)}
                <View style = {styles.textRating}>
                {item.ratings != 0 ?
                <Text>{item.ratings}</Text>
                :
                <Text>0</Text>
                }
                <Text> ratings</Text>
                </View>
            </View>
            <Text>Price: ${item.price}</Text>
            {item.oldPrice && <View style = {{flexDirection: 'row'}}>
                <Text>Old Price: </Text>
                <Text style = {{textDecorationLine: 'line-through'}}>${item.oldPrice}</Text></View>}
        </View>
        </View>
    </View>
</TouchableOpacity >
)
}
const Home = ({navigation}) =>{
return(
    <SafeAreaView style = {styles.container}>
        <FlatList
            data = {ProductData}
            renderItem = {(item) => renderItem(item, navigation)}
            ListHeaderComponent = {ListHeaderComponent}
        />
    </SafeAreaView>
)
}

export default Home;

const winWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f3f3f3',
    paddingTop: Constant.statusBarHeight, 
},
header: {
    backgroundColor: '#fff',
    width: winWidth,
    height: 100,
},
image: {
    width: 100,
    height: 100,
},
logo: {
    width: winWidth,
    height: '100%',
},
productContainer:{
    width: winWidth,
    flexDirection: 'row',
    backgroundColor: '#fff',
    flex: 1,
},

rating: {
    flexDirection: 'row',
},
textRating: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
},
title: {
    fontWeight: 'bold',
},
wholeContainer:{
    marginVertical: 5,
    marginRight: 10,

},
})