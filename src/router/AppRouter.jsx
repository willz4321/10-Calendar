import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth";

import { CalendarPage } from "../calendar";
import { getEnVariables, useAuthStore } from "../helpers";
import { useEffect } from "react";


export const AppRouter = () => {

 const { status ,checkAuthToken } = useAuthStore(); 
 //const authStatus = 'not-authenticated'; 
 
 useEffect(() => {
    checkAuthToken()
 }, [])

 if( status === 'checking' ) {
  return (
     <h3>Cargando...</h3>
  )
 }

 console.log(getEnVariables());
    
  return (
    <Routes>
        {
            (status === 'not-authenticated')
            ? (
               <>
                   <Route path="/auth/*" element={ <LoginPage/> } />
                   <Route path="/*" element={ <Navigate to='/auth/login' /> } />
               </>
            )
            : (
                 <>
                     <Route path="/" element={ <CalendarPage/> } /> 
                     <Route path="/*" element={ <Navigate to='' /> } />
                 </> 
              ) 
        }

        
    </Routes>
  )
}
