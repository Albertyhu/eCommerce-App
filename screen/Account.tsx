import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {DataStore, Auth} from 'aws-amplify';
import {fillPersonalInfo} from '../redux/action';
import {connect} from 'react-redux';
import {SupportContext} from '../component/DrawerContext.tsx';

const Account = (props, {navigation}) =>{

//const {fillPersonalInfo} = props;
const [editMode, setEditMode] = useState(false);

const [fname, setFname] = useState<String>('First Name');
const [lname, setLname] = useState<String>('Last Name');
const [phone, setPhone] = useState<Int>(null);
const [email, setEmail] = useState<String>('Email');
const [address, setAddress] = useState<String>('Address');
const [address2, setAddress2] = useState<String>('Address 2');
const [city, setCity] = useState<String>('City');
const [state, setState] = useState<String>('State');
const [zip, setZip] = useState<Int>(null);

const setEditTrue = () =>{
    setEditMode(true)
}

const setEditFalse = () =>{
    setEditMode(false)
}

return(
<ScrollView>
    <View style = {styles.container}>
    {!editMode ?
    <View style = {styles.container}>
        <View style = {{alignItems: 'center'}}><Text style = {styles.h1Title}>Account information</Text></View>
        <View style = {styles.nameContainer}>
            <View style = {styles.inputContainer}>
                <Text style = {[styles.textInput, {paddingVertical: 10}]}>{fname}</Text>
            </View>
            <View style = {styles.inputContainer}>
                <Text style = {[styles.textInput, {paddingVertical: 10}]}>{lname}</Text>
            </View>
        </View>
       <View style = {styles.emailContainer}>
               {phone != null ? <Text style = {[styles.textInput, {paddingVertical: 10}]}>{phone}</Text>
               :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>Your phone number</Text>
               }
       </View>
       <View style = {styles.phoneContainer}>
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>{email}</Text>
      </View>
      <View style = {styles.phoneContainer}>
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>{address}</Text>
        </View>
      <View style = {styles.phoneContainer}>
                <Text style = {[styles.textInput, {paddingVertical: 10}]}>{address2}</Text>
      </View>
          <View style = {styles.city_state}>
            <View style = {styles.inputContainer}>
                   <Text style = {[styles.textInput, {paddingVertical: 10}]}>{city}</Text>
            </View>
            <View style = {styles.inputContainer}>
                   <Text style = {[styles.textInput, {paddingVertical: 10}]}>{state}</Text>
            </View>
       </View>
       <View style = {[styles.inputContainer, {marginVertical: 10, width: 150,}]}>
               {zip !== null ? <Text style = {[styles.textInput, {paddingVertical: 10}]}>{zip}</Text>
               :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>Your zip code</Text>
               }
       </View>
       <TouchableOpacity style = {styles.actionButton} onPress = {() => setEditMode(true)}>
            <View><Text>Edit Information</Text></View>
       </TouchableOpacity>
    </View>

    :

    <View style = {styles.container}>
        <View style = {{alignItems: 'center'}}><Text style = {styles.h1Title}>Edit your information</Text></View>
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
                      value = {phone}
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
            <View style = {[styles.inputContainer, {marginVertical: 10, width: 150}]}>
                <TextInput
                    placeholder = 'Zipcode'
                    value = {zip}
                    onChangeText = {val => handleZip(val, setZip)}
                    style = {styles.textInput}
                    keyboardType = "numeric"
                />
            </View>
         <TouchableOpacity style = {styles.actionButton} onPress = {() => setEditMode(false)}>
             <View><Text>Save</Text></View>
         </TouchableOpacity>
         </View>
        }
    </View>
</ScrollView>
)
}

//const mapDispatchtoProps = dispatch => ({fillPersonalInfo, fetchCartP}, dispatch)
const mapStatetoProps = store =>({})
//const mapDispatchtoProps = dispatch => ({fillPersonalInfo}, dispatch)
//export default connect(mapStatetoProps, mapDispatchtoProps)(Account);
export default connect(mapStatetoProps, null)(Account)
//export default Account;

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
textBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginHorizontal: 10,
    width: "40%",
    marginLeft: 'auto',
    marginRight: 'auto',
    },
switchContainer:{
    flexDirection: 'row',
    alignItems: 'center',
},
textInput:{
    padding: 5,
}
})