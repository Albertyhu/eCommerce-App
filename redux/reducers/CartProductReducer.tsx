import React from 'react'
import {CartProduct} from '../../src/models/index.js';
import {RETRIEVE_CART,  CALC_TOTAL_ITEMS} from '../constants/index.js';

const initialState = {
    cartArray<CartProduct>: [],
    totalQuantity: 0,
}

export const CartProductReducer = (state = initialState, action) =>{
    switch(action.type){
        case RETRIEVE_CART:
            return{
            ...state,
            cartArray: [...action.cart],
        }
        case CALC_TOTAL_ITEMS:
            return{
            ...state,
            totalQuantity: action.total,
            }
         default:
            return state
    }
}