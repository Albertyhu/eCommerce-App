import {Product, CartProduct} from '../../src/models/index.js';
import {DataStore, Auth} from 'aws-amplify';
import {RETRIEVE_CART,  CALC_TOTAL_ITEMS, RETRIEVE_USERDATA, FILL_PROFILE} from '../constants/index.js';

export function fetchCartP(){
    return (async (dispatch)=>{
        const userData = await Auth.currentAuthenticatedUser();
        const Cart = await DataStore.query(CartProduct, val => val.userSub('eq', userData.attributes.sub))
        dispatch(CalcTotalItems(Cart))
        dispatch({type: RETRIEVE_CART, cart: Cart })
    })
}

export function CalcTotalItems(Cart){
    return((dispatch) =>{
        const totalItems = Cart.reduce((total, ind) => {
            return total + ind.quantity
        }, 0)
        dispatch({type:  CALC_TOTAL_ITEMS, total: totalItems  })

    })
}

export function retrieveUserData(){
    return(async (dispatch) =>{
         const userData = await Auth.currentAuthenticatedUser()
         dispatch({type: RETRIEVE_USERDATA, userID: userData})
    })
}

//retrieves Personal info from DataStore
export function retrievePersonalInfo(){
    return(async (dispatch) =>{
         const userData = await Auth.currentAuthenticatedUser()
         const Profile = await DataStore.query(AccountInfo, val => val.userSub('eq', userData.attributes.sub))
         dispatch({type: FILL_PROFILE,
            first: Profile[0].firstName || null,
            last: Profile[0].lastName || null,
            phone: Profile[0].phoneNumber || null,
            address: Profile[0].address || null,
            address2: Profile[0].address2 || null,
            city: Profile[0].city || null,
            state: Profile[0].state || null,
            zip: Profile[0].zipcode || null,
            email: Profile[0].email || null,
         })
    })
}

export function fillPersonalInfo(
    fName,
    lName,
    Email,
    phoneN,
    Address,
    Address2,
    City,
    State,
    Zip,
){
    return (dispatch =>{
        dispatch({
            type: FILL_PROFILE,
            first: fName,
            last: lName,
            email: Email,
            phone: phoneN,
            address: Address,
            address2: Address2,
            city: City,
            state: State,
            zipcode: Zip,
        })
    })
}