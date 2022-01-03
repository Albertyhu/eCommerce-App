import {CartProductReducer} from './CartProductReducer.tsx';
import {PersonalInfoReducer} from './PersonalInfoReducer.tsx';
import {combineReducers } from 'redux';

const Reducers = combineReducers({
    CartReducer: CartProductReducer,
    UserReducer: PersonalInfoReducer,
})

export default Reducers;