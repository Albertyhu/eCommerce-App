import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Image, FlatList, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants'
import {openDrawer} from '@react-navigation/drawer';
import {DataStore, Auth} from 'aws-amplify';
import {Product, CartProduct} from '../src/models/index.js';
import DropDown from '../component/dropdownQuantitySelector.tsx';
import { useIsFocused } from '@react-navigation/native';
import QuantitySelector from '../component/quantityselector.tsx';
import CartItems from '../asset/cart.ts';
import ProductScreen from './product.tsx';
import CheckOutScreen from './checkout.js';
import EditProductScreen from './EditProduct.tsx'
import {CalcTotalItems} from '../redux/action';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SupportContext} from '../component/DrawerContext.tsx';

//Calculates total price of all items in shopping cart
export const CalcTotal = data => {

    const totalItems = data.reduce((previous, current) =>{
        return previous + current.quantity;
    }, 0)
     const sumTotal = data.reduce((previous, current)=>{
        return previous + (current.quantity * current.price)

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
        {item.length ?
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

const renderItem = ({item}, navigation, fetchCartItems, fetchProducts, updateItemQuantity) =>{
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
    navigation.navigate('ProductScreen', {ProductID: item.productID})
}

const navEditProduct = async () => {
    navigation.navigate('EditProductScreen', {ProductID: item.id})
}

//item.id is the id of the CartProduct. This is different than that of corresponding product
const handleDelete = async () =>{
   const toDelete = await DataStore.query(CartProduct, item.id)
    alert("Deleted " + item.title)
    DataStore.delete(toDelete);
    fetchCartItems();
    fetchProducts();
    updateItemQuantity();
}

return(
    <View style = {styles.rowContainer}>
    <View style = {styles.deleteContainer}>
        <TouchableOpacity style = {[styles.deleteButton, {backgroundColor: "#efdc1a"}]} onPress = {navEditProduct}>
            <Text style = {{padding: 5}}>Edit Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {[styles.deleteButton, {marginTop: 25}]} onPress = {handleDelete}>
            <Text style = {{padding: 5}}>Delete</Text>
        </TouchableOpacity>
    </View>
    <TouchableOpacity onPress = {viewProduct} >
        <View style = {styles.productContainer}>
        <Image source = {{uri: item.image}} style = {styles.image} resizeMode = 'contain'/>
        <View style = {styles.textInfo}>
            <Text style = {styles.title}>{item.title}</Text>
            <View style = {styles.rating}>
                {ConvertRating(item.avgRating)}
            </View>
            <View style = {styles.textRating}>
            {item.ratings != 0 ?
            <Text>{item.ratings}</Text>
            :
            <Text>0</Text>
            }
            <Text> ratings</Text>
            </View>
            {item.option &&
                <Text>{`Option: ${item.option}`}</Text>
            }
            {item.price && <Text>Price: ${item.price.toFixed(2)}</Text>}
            {item.oldPrice && <View style = {{flexDirection: 'row'}}>
                <Text>Old Price: </Text>
                <Text style = {{textDecorationLine: 'line-through'}}>${item.oldPrice.toFixed(2)}</Text></View>}
            {item.quantity &&
                <Text>{`Quantity: ${item.quantity}`}</Text>

            }
            </View>
        </View>
       </TouchableOpacity >
    </View>

)
}

const ShoppingCart = (props) =>{

const {CalcTotalItems} = props;
const [cart, setCart] = useState<CartProduct[]>([])
const [product, setProduct] = useState<Product[]>([]);
const [render, setRender ] = useState(false);
const navigation = useNavigation();
//this useState array combines the data of Product and CartProduct
const [data, setData] = useState([]);
//const [quantity, setQuantity] = useState<Int>(0);

const {setItemTotal, calTotalQuantity } = React.useContext(SupportContext);
const { itemQuantity} = props;

//updates shopping cart item indicated on drawer
const updateItemQuantity = () =>{
    calTotalQuantity()
}

//The structure of the code is based on the documentation in AWS Amplify website.
//https://docs.amplify.aws/lib/datastore/data-access/q/platform/js/
const fetchCartItems = async () =>{
    const userData = await Auth.currentAuthenticatedUser();
    await DataStore.query(CartProduct, val => val.userSub("eq", userData.attributes.sub)).then(setCart)
}

const fetchProducts = async () => {
    const products = await Promise.all(cart.map(async (val) =>
        {const productData = await DataStore.query(Product, val.productID);
        return{
            title: productData.title,
            //description: productData.description,
            image: productData.image,
            images: [...productData.images],
            options: [...productData.options],
            avgRating: productData.avgRating,
            ratings: productData.ratings,
            price: productData.price,
            oldPrice: productData.oldPrice,
            userSub: val.userSub,
            quantity: val.quantity,
            option: val.option,
            productID: val.productID,
            checkbox: false,
            id: val.id
            }
        }

        ))
       // console.log(products)
     await setProduct(products);
}
/*
const fetchProducts = async () => {
    const products = await Promise.all(cart.map((val) => DataStore.query(Product, val.productID)
        ))
    setProduct(products);
}
*/
/*Manipulating Quantity*/
const updateQuantity = async (val, product_id) =>{
    const original = await DataStore.query(CartProduct, product_id)
    await DataStore.save(Post.copyOf(original, change => change.quantity = val))
}
/*Manipulating Quantity End*/

// useIsFocused() returns true when the screen is loaded. 
// useIsFocused() is necessary because without it, the Shopping Cart list isn't updated whenever a new item is added.
const isFocused =  useIsFocused();

useEffect(()=>{
   fetchCartItems();
   fetchProducts();
}, [isFocused])

useEffect(()=>{
    fetchProducts();
}, [cart])

useEffect(()=>{
   if(product){
        setRender(true)
        }
}, [product])


return(
    <View style = {styles.container}>
    {render ?
        <FlatList
            data = {product}
            renderItem = {(item) => renderItem(item, navigation, fetchCartItems, fetchProducts, updateItemQuantity)}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent = {renderHeader(product, navigation)}
            ListHeaderComponentStyle = {styles.checkoutContainer}
             stickyHeaderIndices={[0]}
        />
        :
        null
    }
    </View>
)
}

const mapStatetoProps = store =>({
    itemQuantity: store.CartReducer.totalQuantity,
})
const mapDispatchToProps = dispatch => bindActionCreators({CalcTotalItems}, dispatch);
export default connect(mapStatetoProps, mapDispatchToProps)(ShoppingCart);

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
deleteButton:{
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#e0dec7',
},
deleteContainer: {
    justifyContent: 'center',
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
textInfo:{
flexShrink: 1,
flexDirection: 'column',
width: 190,
},
textRating: {
    flexDirection: 'row',
},
title: {
    fontWeight: 'bold',
},
rowContainer:{
    marginVertical: 5,
    marginRight: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
},
})