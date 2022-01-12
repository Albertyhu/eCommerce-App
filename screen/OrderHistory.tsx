import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Auth, DataStore} from 'aws-amplify';
import {Order, OrderProduct} from '../src/models/index.js';
import ProductScreen from './product.tsx';

const renderItem = ({item}, props) =>{
return(
<View style = {styles.wholeContainer}>
<TouchableOpacity onPress = {() => props.navigation.navigate('ProductScreen', {ProductID: item.product.id})}>
    <View style = {styles.productContainer}>
        <Image
            source = {item.product.image ? {uri: item.product.image} : null}
            style = {styles.image}
             resizeMode = 'contain'
        />
        <View>
        <Text style = {styles.title}>{item.product.title}</Text>
        <View style = {styles.row}><Text style = {{fontWeight: 'bold'}}>Price:</Text><Text> ${item.product.price.toFixed(2)}</Text></View>
        <View style = {styles.row}><Text style = {{fontWeight: 'bold'}}>Option:</Text><Text> {item.option}</Text></View>
        <View style = {styles.row}><Text style = {{fontWeight: 'bold'}}>Quantity:</Text><Text>{item.quantity}</Text></View>
        </View>
    </View>
</TouchableOpacity>
</View>
)
}

const OrderHistory = (props) =>{

const [orderList, setOrderList] = useState<Order[]>([])
const [orderedItems, setOrderItems] = useState<OrderProduct[]>([])

const retrieveOrderInfo = async () =>{
    const userData = await Auth.currentAuthenticatedUser();
    await DataStore.query(Order, val => val.userSub("eq", userData.attributes.sub)).then(setOrderList)

}

const retrieveOrderedItems = () => {
   orderList.forEach(async val => {
        const result = await DataStore.query(OrderProduct, item => item.orderID("eq", val.id))
        result.forEach( prod => {
            setOrderItems(prevState =>
               [...prevState, prod]
            )
        })
   })
}


useEffect(() =>{
    retrieveOrderInfo();
}, [])

useEffect(()=>{
    retrieveOrderedItems();
}, [orderList])

return(
    <View style = {styles.container}>
        <FlatList
            data = {orderedItems ? orderedItems : null}
            renderItem = {(item) => renderItem(item, props)}
        />
    </View>
)
}

export default OrderHistory;

const winWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
},
h1:{
    fontWeight: 'bold',
    fontSize: 25,
    color: '#e47911',
},
h2:{
    fontWeight: 'bold',
    fontSize: 20,
},
image: {
    width: 100,
    height: 100,
},
orderInformation:{
    marginVertical: 20,
},
productContainer:{
    width: winWidth,
    flexDirection: 'row',
    backgroundColor: '#fff',
    flex: 1,
},
row:{
    flexDirection: 'row',
},
subtitle:{
    fontWeight: 'bold',
},
textInput:{
    paddingVertical: 10,
    width: '100%',
    paddingLeft: 5,
},
title: {
    fontWeight: 'bold',
},
titleContainer:{
    alignItems: 'center',
    marginVertical: 8,
},
wholeContainer:{
    marginVertical: 5,
    marginRight: 10,

},
})