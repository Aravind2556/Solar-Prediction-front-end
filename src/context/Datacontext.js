import React, { createContext, useEffect, useState } from 'react'

export const DContext = createContext()
function Datacontext(props) {
    const apiurl = process.env.REACT_APP_API_URL;

    const [Auth,setAuth]=useState(null)
    const [User,setUser]=useState(null)
  
   


    useEffect(()=>{
        
          fetch(`${apiurl}/checkauth`,{
            method:"GET",
            credentials:'include'
          })
          .then(res=>res.json())
          .then(data=>{
            if(data.success === true){
              setAuth(data.user)
              
              
            }
            else{
              console.log(data.messsage)
            }
          })
          .catch(err=>{
            console.log("error fetching to username",err)
          })
    
    
      },[apiurl])

      useEffect(()=>{
        fetch(`${apiurl}/fetch-user`,{
          method:"GET",
          credentials:'include'
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.success === true){
            setUser(data.user)
            
            
          }
          else{
            console.log(data.messsage)
          }
        })
        .catch(err=>{
          console.log("error fetching to username",err)
        })
  

      },[apiurl])






    const data = {Auth,setAuth,User}
return (
   

   
        <DContext.Provider value={data}>
            {props.children}
        </DContext.Provider>
  )
}

export default Datacontext
