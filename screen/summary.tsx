import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import {DataStore, Auth} from 'aws-amplify';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Cart, Product, OrderProduct, Order } from '../src/models/index.js';

import ProductScreen from './product.tsx';

const renderHeader = (props, order_id) =>{
return(
<View style = {styles.container}>
    <View style = {styles.titleContainer}>
        <Text style = {styles.h1}>Thank you for shopping with us</Text>
        <Text style = {styles.h2}>Your purchase has been confirmed</Text>
    </View>
    {order_id ?
        <View style = {styles.orderInformation}>
            <View style = {{flexDirection: 'row'}}><Text style = {{fontWeight: 'bold'}}>Order ID: </Text><Text>{order_id.id}</Text></View>
            <Text style = {styles.subtitle}>Shipping To:</Text>
            <Text>{order_id.address}</Text>
            {order_id.address2 ?
                <Text>{order_id.address2}</Text>
                :
                null
            }
            <Text>{order_id.city}, {order_id.state} {order_id.zipcode}</Text>
            <View style = {styles.row}><Text style = {{fontWeight: 'bold'}}>Total Paid:</Text><Text> ${props.route.params.totalPaid}</Text></View>
            <View style = {styles.row}><Text style = {{fontWeight: 'bold'}}>Total Item Quantity:</Text><Text> {props.route.params.totalItems}</Text></View>
        </View>
      :
      null
     }
</View>
)
}

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

//Start of main component
const Summary = props =>{
const {firstName, lastName} = props;

const [order_id, setOrderID] = useState<Order[]>([]);

//Data of all OrderProduct items
const [orderItems, setOrderItems] = useState<OrderProduct[]>([]);

const retrieveOrder = async () =>{
    const orderData = await DataStore.query(OrderProduct, val =>{val.orderID("eq", props.route.params.OrderID)});
    //I have to use the following array filter code because for some reason, the above code retrieves all the OrderProduct Item regardless of whether or not they have the correct OrderID
    const result = orderData.filter(val => val.orderID === props.route.params.OrderID)
    setOrderItems(result);

}

const retrieveOrderInfo = async () =>{
    await DataStore.query(Order, props.route.params.OrderID).then(setOrderID)
   // console.log(props.route.params.TotalPaid)
}


useEffect(()=>{
    retrieveOrderInfo();
    retrieveOrder();


}, [])

return(
    <View style = {styles.container}>

     {orderItems ?
     <View>
        <FlatList
            data= {orderItems}
            renderItem = {(item) => renderItem(item, props)}
            ListHeaderComponent = {renderHeader(props, order_id)}
        />
     </View>
     :
     null
     }

    </View>
)
}

const mapDispatchtoProps = dispatch =>bindActionCreators({}, dispatch )

const mapStatetoProps = store =>({
    firstName: store.UserReducer.fName,
    lastName: store.UserReducer.lName,
})

export default connect(mapStatetoProps, mapDispatchtoProps)(Summary);


const winWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
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