import React from 'react';
import {RETRIEVE_USERDATA, FILL_PROFILE, SET_NAME} from '../constants';

const initialState = {
    userData: '',
    fName: '',
    lName: '',
    email: '',
    phone: 0,
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
}

export const PersonalInfoReducer = (state = initialState, action) =>{
    switch(action.type){
        case RETRIEVE_USERDATA:
            return{
                ...state,
                userData: action.userID,
            }
        case FILL_PROFILE:
        return{
            ...state,
            fName: action.first,
            lName: action.last,
            email: action.email,
            phone: action.phone,
            address: action.address,
            address2: action.address2,
            city: action.city,
            state: action.state,
            zip: action.zipcode,
        }
        case SET_NAME:
        return{
            fName: action.firstName,
            lName: action.lastName,
        }
        default:
          return state;
    }
}