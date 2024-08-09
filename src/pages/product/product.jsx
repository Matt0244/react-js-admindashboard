import React from 'react'
import {Switch,Route, Redirect} from 'react-router-dom'
// import Product from './product'
// import ProductAddUpdate from './add-update'
// import ProductDetail from './datail'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './datail'



function Product() {
  return (
    
      <Switch>
        <Route  path='/product' component={ProductHome} exact/>
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product' />
      </Switch>
      



   
  )
}

export default Product