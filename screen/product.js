import React from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions } from 'react-native';
import Constant from 'expo-constants';
import ProductData from '../asset/products.ts';

const Product = ({navigation}) =>{

const displayProduct = props =>{

}

return(
    <View style = {styles.container}>
        <View style = {styles.header}>
            <Image
                source = {require('../asset/GearTechLogo2.jpg')}
                style = {styles.logo}
            />
        </View>
    </View>
)
}

export default Product;

const winWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: Constant.statusBarHeight,
},
header: {
    backgroundColor: '#fff',
    width: winWidth,
    height: 100,
    justifyContent: 'flex-start',
},
logo: {
    width: '50%',
    height: '100%',
},
})