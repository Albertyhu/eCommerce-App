import {Product, CartProduct} from '../../src/models/index.js';
import {DataStore, Auth} from 'aws-amplify';
import {RETRIEVE_CART,  CALC_TOTAL_ITEMS} from '../constants/index.js';

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