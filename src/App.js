
import React, { useContext} from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login } from './components/createAccount/Login'

import  Navbar  from './components/Navbar'
import Register from './components/createAccount/Register'


import { Dashboard } from './components/NewDashboardFilter'
import { DContext } from './context/Datacontext'







export const App = () => {

   const {Auth}=useContext(DContext)


  return (
    <div>

     <Navbar/>




   
    <Routes>
      <Route path='/' element={Auth ? <Dashboard/> : <Login/>}></Route>

      <Route path='/create-account' element={<Register/>}></Route>
 
    
     

    </Routes>

    

    </div>
  )
}
