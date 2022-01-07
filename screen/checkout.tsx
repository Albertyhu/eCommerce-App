import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import {DataStore, Auth, API, graphqlOperation } from 'aws-amplify';
import {Product, CartProduct, Order, OrderProduct} from '../src/models/index.js';
import {connect } from 'react-redux';
import {bindActionCreator} from 'redux';
import Icons from 'react-native-vector-icons/Ionicons';
import {useStripe} from '@stripe/stripe-react-native';

import {createPaymentIntent} from '../src/graphql/mutations.ts';
import {AccountInfo} from '../src/models/index.js'

import SummaryScreen from './summary.tsx';

const CheckOut = (props, {navigation}) =>{

//for userSub
const [user, setUser] = useState<String | null>(null);

const [fname, setFname] = useState<String>('');
const [lname, setLname] = useState<String>('');
const [phone, setPhone] = useState<String | null>(null);
const [email, setEmail] = useState<String>('');
const [address, setAddress] = useState<String>('');
const [address2, setAddress2] = useState<String>('');
const [city, setCity] = useState<String>('');
const [state, setState] = useState<String>('');
const [zip, setZip] = useState<String>('');

//need to keep total amount in cents
const totalAmount = props.route.params?.totalCost * 100;

const [Saddress, setSAddress] = useState<String>('');
const [Saddress2, setSAddress2] = useState<String>('');
const [Scity, setSCity] = useState<String>('');
const [Sstate, setSState] = useState<String>('');
const [Szip, setSZip] = useState<String>('');

//For saving shipping address once saveOrder is executed
const [shippingInfo, setShippingInfo] = useState({})

const [newOrder, setNewOrder] = useState<Order[]>([])

//if shipping address is the same as the pre-initialized address, displayShipping is false
const [displayShipping, setDisplayShipping] = useState(false);
const [clientSecret, setClientSecret] = useState<String | null>(null);

const amount = Math.floor(props.route.params?.totalCost * 100 || 0) ;

const {initPaymentSheet, presentPaymentSheet} = useStripe();

const {totalQuantity} = props;

const proceed = () =>{
    props.navigation.navigate('SummaryScreen');
}

const toggleSwitch = () =>{
    setDisplayShipping(prevState => !prevState)
}

const handleZip = (val, dispatch) =>{
    if(val.length < 6){
        dispatch(val)
    }
}

//request payment intent from backend and retrieve secret_client
const fetchPaymentIntent = async () =>{
    const response = await API.graphql(
        graphqlOperation(createPaymentIntent, {amount}),
    );
    setClientSecret(response.data.createPaymentIntent.clientSecret);
}

const initializePaymentSheet = async () => {
    if(!clientSecret){
        return;
    }
    const { error } = await initPaymentSheet({
        merchantDisplayName: `${fname} ${lname}`,
        paymentIntentClientSecret: clientSecret,
    });
    if(error) {
        Alert.alert(error)
    }
}

//retrieves existing personal information about the user
const retrieveUser = async () =>{
     const userID = await Auth.currentAuthenticatedUser()
     setUser(userID);
     const currentUser = await DataStore.query(AccountInfo, val => val.userSub('eq', userID.attributes.sub))
     if(currentUser.length > 0){
        setFname(currentUser[0].firstName)
        setLname(currentUser[0].lastName)
        setPhone(currentUser[0].phoneNumber)
        setAddress(currentUser[0].address)
        setAddress2(currentUser[0].address2)
        setCity(currentUser[0].city)
        setState(currentUser[0].state)
        setZip(currentUser[0].zipcode)
        setEmail(userID.attributes.email)
     }
}
/*
const openPaymentSheet = async () =>{
    if(!clientSecret)
        return;
    const { error } = await presentPaymentSheet({clientSecret})
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      saveOrder();
      Alert.alert('Success', 'Your payment is confirmed!');
    }

}*/

const openPaymentSheet = async () =>{
    saveOrder();
}

const saveOrder = async () =>{
//if initial address is not the same as the shipping address
if(displayShipping){
await DataStore.save(
        new Order ({
        userSub: user.attributes.sub,
        firstName: fname,
        lastName: lname,
        phoneNumber: phone,
        address: Saddress,
        address2: Saddress2,
        city: Scity,
        state: Sstate,
        zipcode: Szip,
})).then(setNewOrder)
}
//if the initial address is the same as the shipping address
else {
await DataStore.save(
        new Order ({
        userSub: user.attributes.sub,
        firstName: fname,
        lastName: lname,
        phoneNumber: phone,
        address: address,
        address2: address2,
        city: city,
        state: state,
        zipcode: zip,
})).then(setNewOrder)
}

const cart = await DataStore.query(CartProduct, val => val.userSub("eq", user.attributes.sub)).then(async val => {
    await DataStore.save(new OrderProduct({
        quantity: val.quantity,
        option: val.option,
        productID: val.productID,
        orderID: newOrder.id,
    }))
})
}

useEffect(()=>{
    retrieveUser();
    fetchPaymentIntent();
},[])

useEffect(()=>{
    initializePaymentSheet();
}, [clientSecret] )

return(
<ScrollView>
    <View style = {styles.container}>
        <View style = {{alignItems: 'center'}}><Text style = {styles.h1Title}>Fill in your information</Text></View>
        <Text>Total items in cart: {totalQuantity ? totalQuantity : null}</Text>
        <Text>Total Cost: ${props.route.params.totalCost ? props.route.params.totalCost : 0}</Text>
        <Text style = {styles.subtitle}></Text>
        <View style = {styles.nameContainer}>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = 'First name'
                    value = {fname}
                    onChangeText = {val => setFname(val)}
                    style = {styles.textInput}
                />
            </View>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = 'Last name'
                    value = {lname}
                    onChangeText = {val => setLname(val)}
                    style = {styles.textInput}
                />
            </View>
        </View>
           <View style = {styles.emailContainer}>
               <TextInput
                   placeholder = 'Email'
                   value = {email}
                   onChangeText = {val => setEmail(val)}
                   style = {styles.textInput}
               />
           </View>
           <View style = {styles.phoneContainer}>
                  <TextInput
                      placeholder = 'Phone number'
                      value = {phone ? phone.toString() : null}
                      onChangeText = {val => setPhone(val)}
                      style = {styles.textInput}
                      keyboardType = 'numeric'

                  />
          </View>
         <View style = {styles.phoneContainer}>
                <TextInput
                    placeholder = 'Address 1'
                    value = {address}
                    onChangeText = {val => setAdress(val)}
                    style = {styles.textInput}
                />
        </View>
         <View style = {styles.phoneContainer}>
                <TextInput
                    placeholder = 'Address 2'
                    value = {address2}
                    onChangeText = {val => setAdress2(val)}
                    style = {styles.textInput}
                />
        </View>
        <View style = {styles.city_state}>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = 'City'
                    value = {city}
                    onChangeText = {val => setCity(val)}
                    style = {styles.textInput}
                />
            </View>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = 'State'
                    value = {state}
                    onChangeText = {val => setState(val)}
                    style = {styles.textInput}
                />
            </View>
        </View>
            <View style = {[styles.inputContainer, {marginVertical: 10}]}>
                <TextInput
                    placeholder = 'Zipcode'
                    value = {zip.toString()}
                    onChangeText = {val => handleZip(val, setZip)}
                    style = {styles.textInput}
                    keyboardType = "numeric"
                />
            </View>
        <View style = {styles.shippingQuestionContainer}>
            <Text style = {styles.subtitle}>Is your shipping address the same as above?</Text>
            <View style = {styles.switchContainer}>
            <Text>Yes</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={displayShipping ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value = {displayShipping}
            />
            <Text>No</Text>
            </View>
        </View>

{displayShipping ?
    <View style = {styles.container}>
        <Text style = {styles.subtitle}>Shipping Address</Text>
        <View style = {styles.phoneContainer}>
                <TextInput
                    placeholder = 'Address 1'
                    value = {Saddress}
                    onChangeText = {val => setSAddress(val)}
                    style = {styles.textInput}
                />
        </View>
         <View style = {styles.phoneContainer}>
                <TextInput
                    placeholder = 'Address 2'
                    value = {Saddress2}
                    onChangeText = {val => setSAddress2(val)}
                    style = {styles.textInput}
                />
        </View>
        <View style = {styles.city_state}>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = 'City'
                    value = {Scity}
                    onChangeText = {val => setSCity(val)}
                    style = {styles.textInput}
                />
            </View>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = 'State'
                    value = {Sstate}
                    onChangeText = {val => setSState(val)}
                    style = {styles.textInput}
                />
            </View>
        </View>
            <View style = {[styles.inputContainer, {marginVertical: 10, width: 150}]}>
                <TextInput
                    placeholder = 'Zipcode'
                    value = {Szip.toString()}
                    onChangeText = {val => handleZip(val, setSZip)}
                    style = {styles.textInput}
                    keyboardType = "numeric"
                />
            </View>
         </View>
           :
           <View></View>
}
        <TouchableOpacity style = {styles.actionButton} onPress = {openPaymentSheet}>
            <View><Text>Make Payment</Text></View>
        </TouchableOpacity>
    </View>
</ScrollView>
)
}

const mapStatetoProps = store =>({
    totalQuantity: store.CartReducer.totalQuantity,
})

export default connect(mapStatetoProps, null)(CheckOut);

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
city_state:{
    flexDirection: 'row',
    width: winWidth,
    alignItems: 'center',
    marginVertical: 10,
},
container: {
    alignItems: 'center',
    flex: 1,
},
h1Title:{
    fontWeight: 'bold',
    fontSize: 30,
    alignItems: 'center',
},
emailContainer:{
    width: winWidth * 0.9,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
},
inputContainer:{
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginHorizontal: 10,
    width: "40%",
    marginLeft: 'auto',
    marginRight: 'auto',
},
nameContainer:{
    flexDirection: 'row',
    width: winWidth,
    alignItems: 'center',
    marginVertical: 10,
},
phoneContainer:{
    width: winWidth * 0.9,
   marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
},
subtitle:{
    fontWeight: 'bold',
    fontSize: 25,
},
shippingQuestionContainer:{
    alignItems: 'center',
},
switchContainer:{
    flexDirection: 'row',
    alignItems: 'center',
},
textInput:{
    padding: 5,
}
})