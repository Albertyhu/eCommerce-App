import React, { useReducer } from 'react';
import {View, StyleSheet, Text, TextInput, Image, TouchableOpacity } from 'react-native';

const QuantitySelector = () =>{

const initialQuantity = {
    stock: 0,
}

const [quantity, setQuantity] = useReducer(quantityReducer, initialQuantity)

function quantityReducer(quantity = initialQuantity, action){
    switch(action.type){
        case 'INCREASE':
            return{
            stock: quantity.stock + 1,
            }
        case 'DECREASE':
            return{
            stock: quantity.stock - 1,
            }
        case 'SET':
            return{
            stock: action.number,
            }
    }
}

const increment = () =>{
    setQuantity({type: 'INCREASE'});
}

const decrement = () =>{
    if(quantity.stock > 0)
    setQuantity({type: 'DECREASE'});
}

const handleTextChange = val =>{
    setQuantity({type: 'SET', number: val})
}

return(
    <View style = {styles.container}>
        <View style = {{marginHorizontal: 32,}}>
        <Text>Quantity</Text>
        </View>
        <View style = {styles.counterContainer}>
           <TouchableOpacity onPress ={decrement}><View style = {[styles.button, styles.subtractButton]}><Text>-</Text></View></TouchableOpacity>
           <View style = {[styles.button, {backgroundColor: '#fff'}]}>
           <Text>{quantity.stock}</Text>
           </View>
           <TouchableOpacity onPress = {increment}><View style = {[styles.button, styles.addButton]}><Text>+</Text></View></TouchableOpacity>
        </View>
    </View>
)
}

export default QuantitySelector;

const styles = StyleSheet.create({
button:{
    width: 40,
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0c0c0',
},
subtractButton:{
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
},
addButton:{
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
},
container: {
   // alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 5,
},
counterContainer:{
    flexDirection: 'row',
},
})