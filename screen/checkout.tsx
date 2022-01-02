import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, TouchableOpacity, ScrollView, Switch } from 'react-native';
import {DataStore} from 'aws-amplify';
import {Product, CartProduct} from '../src/models/index.js';
import {connect } from 'react-redux';
import {bindActionCreator} from 'redux';
import Icons from 'react-native-vector-icons/Ionicons';

import SummaryScreen from './summary.tsx';

const CheckOut = (props, {navigation}) =>{
const [fname, setFname] = useState<String>('');
const [lname, setLname] = useState<String>('');
const [phone, setPhone] = useState(0);
const [email, setEmail] = useState<String>('');
const [address, setAddress] = useState<String>('');
const [address2, setAddress2] = useState<String>('');
const [city, setCity] = useState<String>('');
const [state, setState] = useState<String>('');
const [zip, setZip] = useState<String>('');

const [Saddress, setSAddress] = useState<String>('');
const [Saddress2, setSAddress2] = useState<String>('');
const [Scity, setSCity] = useState<String>('');
const [Sstate, setSState] = useState<String>('');
const [Szip, setSZip] = useState<String>('');

const [displayShipping, setDisplayShipping] = useState(false);

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

return(
<ScrollView>
    <View style = {styles.container}>
        <View style = {{alignItems: 'center'}}><Text style = {styles.h1Title}>Fill in your information</Text></View>
        <Text>Total items in cart: {totalQuantity ? totalQuantity : null}</Text>
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
                      value = {phone.toString()}
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
                    onChangeText = {val => setSAdress(val)}
                    style = {styles.textInput}
                />
        </View>
         <View style = {styles.phoneContainer}>
                <TextInput
                    placeholder = 'Address 2'
                    value = {Saddress2}
                    onChangeText = {val => setSAdress2(val)}
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
        <TouchableOpacity style = {styles.actionButton} onPress = {proceed}>
            <View><Text>Next</Text></View>
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