import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {DataStore, Auth} from 'aws-amplify';
import {fillPersonalInfo, fetchCartP} from '../redux/action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SupportContext} from '../component/DrawerContext.tsx';
import Icon from 'react-native-vector-icons/Ionicons';
import {AccountInfo} from '../src/models/index.js';

const Account = (props, {navigation}) =>{

const {fillPersonalInfo, fetchCartP} = props;
const [editMode, setEditMode] = useState(false);

const [fname, setFname] = useState<String>(null);
const [lname, setLname] = useState<String>(null);
const [phone, setPhone] = useState<Int>(null);
const [email, setEmail] = useState<String>(null);
const [address, setAddress] = useState<String>(null);
const [address2, setAddress2] = useState<String>(null);
const [city, setCity] = useState<String>(null);
const [state, setState] = useState<String>(null);
const [zip, setZip] = useState<Int>(null);
const [isEmailValid, setEmailValidity] = useState(false);
const [userData, setUserData] = useState([])

const setEditTrue = () =>{
    setEditMode(true)
}

/* Verifying email code block */
const verifyEmail = () =>{
    const temp = email.split('@');
    if(temp[0] && temp[1] && temp.length > 1){
        setEmailValidity(true);
    }
    else{
        setEmailValidity(false);
    }
}

useEffect(()=>{
    if(email != null)
        verifyEmail();
}, [email])

/** Verifying email code block end **/

const saveEmail = async () =>{
if(userData.attributes.email !== email){
    await Auth.updateUserAttributes(userData, {
        "email": email,
    })
}
}

const saveInfo = async () =>{
    fillPersonalInfo(fname, lname, phone, email, address, address2, city, state, zip);
    //check for any existing personal info in DataStore first
    const currentUser = await DataStore.query(AccountInfo, userData.attributes.sub)
    //if there is an exsiting account
    saveEmail();
    if(currentUser){
        await DataStore.save(AccountInfo.copyOf(currentUser, updated => {
            updated.firstName = fname;
            updated.lastName = lname;
            updated.phoneNumber = phone;
            updated.address = address;
            updated.address2 = address2;
            updated.city= city;
            updated.state = state;
            updated.zipcode = zip;
            updated.email = email;
        }))
    }
    else{
        await DataStore.save(new AccountInfo({
            userSub: userData.attributes.sub,
            firstName: fname,
            lastName: lname,
            phoneNumber: phone,
            address: address,
            address2: address2,
            city: city,
            state: state,
            zipcode: zip,
            email: email,
        }))
    }
    alert("Your edits have been saved.")
    setEditMode(false)
}

const handleZip = (val, dispatch) =>{
    if(val.length < 6){
        dispatch(val)
    }
}

//retrieves existing personal information about the user
const retrieveUser = async () =>{
     const currentUser = await DataStore.query(AccountInfo,userData.attributes.sub)
     if(currentUser){
        setFname(currentUser.firstName)
        setLname(currentUser.lastName)
        setPhone(currentUser.phoneNumber)
        setAddress(currentUser.address)
        setAddress2(currentUser.address2)
        setCity(currentUser.city)
        setState(currentUser.state)
        setZip(currentUser.zipcode)

     }

}

useEffect(async ()=>{
    const userDat = await Auth.currentAuthenticatedUser();
    setUserData(userDat)
    if(userDat){
        setEmail(userDat.attributes.email)
        }

    //retrieves existing personal information about the user
    //retrieveUser();
},[])

return(
<ScrollView>
    <View style = {styles.container}>
    {!editMode ?
    <View style = {styles.container}>
        <View style = {{alignItems: 'center'}}><Text style = {styles.h1Title}>Account information</Text></View>
        <View style = {styles.nameContainer}>
            <View style = {styles.inputContainer}>
                { fname != null ?
                <Text style = {[styles.textInput, {paddingVertical: 10}]}>{fname}</Text>
                :
                <Text style = {[styles.textInput, {paddingVertical: 10}]}>Your first name</Text>
                }
            </View>
            <View style = {styles.inputContainer}>
                { fname != null ?
                <Text style = {[styles.textInput, {paddingVertical: 10}]}>{lname}</Text>
                :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>Your last name</Text>
                }
            </View>
        </View>
       <View style = {styles.emailContainer}>
               {phone != null ? <Text style = {[styles.textInput, {paddingVertical: 10}]}>{phone}</Text>
               :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>Your phone number</Text>
               }
       </View>
       <View style = {[styles.phoneContainer, {flexDirection: 'row'}]}>
               {email != null ? <Text style = {styles.emailTextInput}>{email}</Text>
               :
               <Text style = {styles.emailTextInput}>Your email address</Text>
               }
               {isEmailValid ?
               <Icon name = "checkmark-circle-outline" size= {25} color = '#30b033' style = {[styles.circleIcon]} />
               :
               <Icon name = "checkmark-circle-outline" size= {25} color = '#c4c4c4' style = {styles.circleIcon} />
               }
      </View>
      <View style = {styles.phoneContainer}>
               {address != null ? <Text style = {[styles.textInput, {paddingVertical: 10}]}>{address}</Text>
               :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>Your address</Text>
               }
        </View>
      <View style = {styles.phoneContainer}>
               {address2 != null ? <Text style = {[styles.textInput, {paddingVertical: 10}]}>{address2}</Text>
               :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>Your 2nd address</Text>
               }
      </View>
          <View style = {styles.city_state}>
            <View style = {styles.inputContainer}>
               {city != null ? <Text style = {[styles.textInput, {paddingVertical: 10}]}>{city}</Text>
               :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>City</Text>
               }
            </View>
            <View style = {styles.inputContainer}>
               {state != null ? <Text style = {[styles.textInput, {paddingVertical: 10}]}>{state}</Text>
               :
               <Text style = {[styles.textInput, {paddingVertical: 10}]}>State</Text>
               }
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
           <View style = {[styles.emailContainer, {flexDirection: 'row'}]}>
               <TextInput
                   placeholder = 'Email'
                   value = {email}
                   onChangeText = {val => setEmail(val)}
                   style = {styles.emailTextInput}
               />
               {isEmailValid ?
               <Icon name = "checkmark-circle-outline" size= {25} color = '#30b033' style = {styles.circleIcon} />
               :
               <Icon name = "checkmark-circle-outline" size= {25} color = '#c4c4c4' style = {styles.circleIcon} />
               }
           </View>
           <View style = {styles.phoneContainer}>
                  <TextInput
                      placeholder = 'Phone number'
                      value = {phone.toString()}
                      onChangeText = {val => setPhone(Number(val))}
                      style = {styles.textInput}
                      keyboardType = 'numeric'

                  />
          </View>
         <View style = {styles.phoneContainer}>
                <TextInput
                    placeholder = 'Address 1'
                    value = {address}
                    onChangeText = {val => setAddress(val)}
                    style = {styles.textInput}
                />
        </View>
         <View style = {styles.phoneContainer}>
                <TextInput
                    placeholder = 'Address 2'
                    value = {address2}
                    onChangeText = {val => setAddress2(val)}
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
         <TouchableOpacity style = {isEmailValid ? styles.actionButton : styles.disabledButton} onPress = {saveInfo} disabled={!isEmailValid}>
             <View><Text>Save</Text></View>
         </TouchableOpacity>
         <TouchableOpacity style = {styles.actionButton} onPress = {()=>{setEditMode(false)}}>
             <View><Text>Cancel</Text></View>
         </TouchableOpacity>
         </View>
        }
    </View>
</ScrollView>
)
}

//const mapDispatchtoProps = dispatch => ({fillPersonalInfo, fetchCartP}, dispatch)
const mapStatetoProps = store =>({})
const mapDispatchtoProps = dispatch => bindActionCreators({fillPersonalInfo, fetchCartP}, dispatch)
export default connect(mapStatetoProps, mapDispatchtoProps)(Account);
//export default connect(mapStatetoProps, null)(Account)
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
circleIcon:{
    padding: 5,
    alignItems: 'flex-end',
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
disabledButton:{
    borderRadius: 5,
    width: 300,
    backgroundColor: '#afafaf',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginVertical: 10,
    borderColor: '#c46b14',
    borderWidth: 1,
},
emailTextInput:{
    paddingLeft: 5,
    paddingVertical: 10,
    width: '90%',
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