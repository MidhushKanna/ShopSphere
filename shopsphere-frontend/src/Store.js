import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { cartReducer } from './reducers/CartReducer';
import { orderCreateReducer, orderDeliverReducer, orderDetailsReducer, orderListReducer, orderMineListReducer, orderPayReducer } from './reducers/OrderReducer';
import { productDetailsReducer, productListReducer } from './reducers/ProductReducer';
import { userDetailsReducer, userRegisterReducer, userSigninReducer, userUpdateProfileReducer } from './reducers/UserReducer';

const safeParseStorage = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (err) {
        console.warn(`Failed to parse localStorage key "${key}":`, err);
        return fallback;
    }
};

const initialState = {
    cart: {
        cartItems: safeParseStorage('cartItems', []),
        shippingAddress: safeParseStorage('shippingAddress', {}),
        paymentMethod: 'PayPal',
    },
    userSignin: {
        userInfo: safeParseStorage('userInfo', null),
    }
};
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userRegister: userRegisterReducer,
    userSignin: userSigninReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile : userUpdateProfileReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer, 
    initialState,
    composeEnhancer(applyMiddleware(thunk)),
);

export default store;