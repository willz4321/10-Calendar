import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { checking, clearErrorMessage, onLogin, onLogout, onLogoutCalendar } from "../store";



export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) => {
        dispatch(checking());

        try {
            const {data} = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token); 
            console.log('datos:',data);   
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }));
            console.log("datos importantes",{ name: data.name, uid: data.uid })

        } catch (error) {

           dispatch( onLogout('Credenciales incorrectas'));
           setTimeout(() => {
               dispatch( clearErrorMessage() );
           },10);
            
        }
    }

    const startRegister = async({ name,email, password }) => {
        dispatch(checking());
        try {
            const {data} = await calendarApi.post('/auth/new', { name,email, password });
            localStorage.setItem('token', data.token);    
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
            console.log(error.Message)
           localStorage.clear();
           dispatch( onLogout() );
        }
    }
    
    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch( onLogout() );
       
        try {
            const {data} = await calendarApi.post('/auth/renew', { name ,email, password });
            localStorage.setItem('token', data.token);    
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }));

        } catch (error) {
           console.log(error);
           dispatch( onLogout( error.response.data?.msg || 'Usuario ya existente' ));
           setTimeout(() => {
               dispatch( clearErrorMessage() );
           },10);
            
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogoutCalendar() );
        dispatch(onLogout());
    }
  
    return {
        // Propiedades
        errorMessage,
        status,
        user,


        //Metodos
        startLogin,
        startRegister,
        startLogout,
        checkAuthToken
  }
}
