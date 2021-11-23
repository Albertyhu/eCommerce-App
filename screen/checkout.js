import React from 'react';
import {View, StyleSheet, Text, TextInput, Image } from 'react-native';

const CheckOut = () =>{
return(
    <View style = {styles.container}>
        <Text>check out page</Text>
    </View>
)
}

export default CheckOut;

const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
},
})