import React, {useState, useEffect, useMemo} from 'react';
import {View, StyleSheet, Text, TextInput, Image, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductData from '../asset/products.ts';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Constant from 'expo-constants';
import {DataStore} from 'aws-amplify';
import {Product} from '../src/models';

import ProductScreen from './product.tsx';

function randNum(){
return Math.floor(Math.random() * 100)
}

const Search = props =>{
const handleQuery = val =>{
    props.changeQuery(val)
}
return(
<View style = {styles.searchContainer}>
    <Icon name = 'search' size  = {25} color = '#000' style = {styles.magnifyIcon}/>
    <TextInput
        value = {props.query}
        style = {styles.textInput}
        onChangeText = {handleQuery}
    />
</View>
    )
}

const ListHeaderComponent = (navigation, query, setQuery) =>{
return(
    <View style = {styles.header}>
        <Search query = {query} changeQuery = {setQuery} />
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
            <Text>Price: ${item.price.toFixed(2)}</Text>
            {item.oldPrice && <View style = {{flexDirection: 'row'}}>
                <Text>Old Price: </Text>
                <Text style = {{textDecorationLine: 'line-through'}}>${item.oldPrice.toFixed(2)}</Text></View>}
        </View>
        </View>
    </View>
</TouchableOpacity >
)
}
const Home = (props, {navigation}) =>{

//products carry's the full list of products currently in datastore
const [products, setProducts] = useState<Product[]>([]);
//searchResults displays the list of products onto the interface
const [searchResults, setSR] = useState<Products[]>([]);
const [query, setQuery] = useState<String>('')
//this part uses Typescript
// this operator <> is used to set the type of the object when it is defined, but has no set value.
//You'll have to install the library first
//And you have to rename the extension of the file that uses the typescript with '.tsx'
//I'm only using it because I was following the tutorial

const fetchProducts = async () =>{
    const results = await DataStore.query(Product);
    setProducts(results)

    //for the Search Bar
    setSR(results)
    /*
        //Alternatively, this also works the same way
        DataStore.query(Product).then(setProducts);
    */

    }

//function for the Search Bar
const filterData = () => {
if(products){
    if(query.length !== 0){
        let newArray = products.filter(val => val.title.toLowerCase().search(query.toLowerCase()) > -1)
        setSR(newArray.map(val => val))
        }
    else{
        setSR(products)
    }
}
}

useEffect(()=>{
    fetchProducts();
}, [])

useEffect(()=>{
    filterData();
}, [query])

return(
    <SafeAreaView style = {styles.container}>
        <FlatList
            data = {searchResults}
            renderItem = {(item) => renderItem(item, props.navigation)}
           ListHeaderComponent = {ListHeaderComponent(navigation, query, setQuery)}

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
 //   paddingTop: Constant.statusBarHeight,
},
header: {
    backgroundColor: '#cdbc00',
    width: winWidth,
    alignItems: 'center',
},
image: {
    width: 100,
    height: 100,
},
logo: {
    width: winWidth,
    height: '100%',
},
magnifyIcon:{
    justifyContent: 'flex-end',
    marginLeft: 5,
    paddingVertical: 10,
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
searchContainer:{
    backgroundColor:'#fff',
    flexDirection: 'row',
    width: winWidth * 0.95,
    marginVertical: 10,
    height: 45,
},
textInput:{
    paddingVertical: 10,
    width: '100%',
    paddingLeft: 5,
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