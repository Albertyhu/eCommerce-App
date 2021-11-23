import React from 'react';
import {View, StyleSheet, Text, TextInput, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants'
import {openDrawer} from '@react-navigation/drawer';

import QuantitySelector from '../component/quantityselector.js';
import CartItems from '../asset/cart.ts';
import ProductScreen from './product.js';
import CheckOutScreen from './checkout.js';

//Calculates total price of all items in shopping cart
export const CalcTotal = data => {

    const totalItems = data.reduce((previous, current) =>{
        return previous + current.quantity;
    }, 0)
     const sumTotal = data.reduce((previous, current)=>{
        return previous + (current.quantity * current.item.price)

     }, 0)


return(
    <View style = {styles.sumTotal} >
        <Text>{`Subtotal [ ${totalItems} items ]: $${Math.round(sumTotal * 100) / 100}`}</Text>
    </View>
)
}

const renderHeader = (item, navigation) =>{
return(
    <View styles = {styles.checkoutContainer}>
        {item ?
            CalcTotal(item)
            :
            <View>
                <Text>There are currently no items in the cart</Text>
            </View>
            }
        <TouchableOpacity onPress = {()=>{navigation.navigate('CheckOutScreen')}}>
            <View style = {styles.checkoutButton}>
                <Text style = {styles.checkoutButtonText}>Proceed to Check Out</Text>
            </View>
        </TouchableOpacity>
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

// 11/17/21 the navigation is not working at the moment
const viewProduct = () =>{
    navigation.navigate('ProductScreen', {ProductID: item.id})
}

return(
    <View style = {styles.wholeContainer}>
    <TouchableOpacity onPress = {viewProduct} >
        <View style = {styles.productContainer}>
        <Image source = {{uri: item.item.image}} style = {styles.image} resizeMode = 'contain'/>
        <View style = {styles.textInfo}>
            <Text style = {styles.title}>{item.item.title}</Text>
            <View style = {styles.rating}>
                {ConvertRating(item.item.avgRating)}
                <View style = {styles.textRating}>
                {item.ratings != 0 ?
                <Text>{item.item.ratings}</Text>
                :
                <Text>0</Text>
                }
                <Text> ratings</Text>
                </View>
            </View>
            <Text>Price: ${item.item.price}</Text>
            {item.item.oldPrice && <View style = {{flexDirection: 'row'}}>
                <Text>Old Price: </Text>
                <Text style = {{textDecorationLine: 'line-through'}}>${item.item.oldPrice}</Text></View>}
            {item.quantity &&
                <View>
                    <Text>{`Quantity: ${item.quantity}`}</Text>
                </View>

            }
            </View>
        </View>
       </TouchableOpacity >
        <QuantitySelector />
    </View>

)
}

const ShoppingCart = ({navigation}) =>{
return(
    <View style = {styles.container}>
        <FlatList
            data = {CartItems}
            renderItem = {(item) => renderItem(item, navigation)}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent = {renderHeader(CartItems, navigation)}
            ListHeaderComponentStyle = {styles.checkoutContainer}
             stickyHeaderIndices={[0]}
        />
    </View>
)
}

export default ShoppingCart;

const winWidth = Dimensions.get('window').width;

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
checkoutButton:{
    width: 300,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#efdc1a',
    alignItems: 'center',
    marginVertical: 10,
},
checkoutButtonText:{
    margin: 5,
},
checkoutContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
    width: winWidth,
},
container: {
    alignItems: 'center',
    flex: 1,
    //paddingTop: Constants.statusBarHeight,
},
header:{
  width: winWidth,
  height: '10%',
  borderBottomWidth: 1,
  borderBottomColor: '#000',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-around',
},
headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 10,
},
image:{
    width: 100,
    height: 100,
    margin: 10,
},
  menuButton:{
    marginHorizontal: 10,
    justifyContent: 'flex-end',
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
sumTotal: {
    alignItems: 'center',

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
    backgroundColor: '#fff',
},
})