/*
The core management object of redux: store
*/
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducer from './reducer'

// Default export of the store
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
