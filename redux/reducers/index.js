import {CartProductReducer} from './CartProductReducer.tsx';
import {combineReducers } from 'redux';

const Reducers = combineReducers({
    CartReducer: CartProductReducer,
})

export default Reducers;