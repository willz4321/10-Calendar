import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";


export const useCalendarStore = () => {

   const dispatch = useDispatch();
   const {events, activeEvent} = useSelector(state => state.calendar);
   const { user } = useSelector( state => state.auth);
  
   const setSetActiveEvent = (calendarEvent) => {
      dispatch(onSetActiveEvent(calendarEvent));
   }
   
   const startSavingEvent = async(calendarEvent) => {

      try {
         
         if(calendarEvent.id) {
            //actualiza
            await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
            dispatch(onUpdateEvent({...calendarEvent}));
   
         }
             //crea
             const {data} = await calendarApi.post('/events', calendarEvent);
             dispatch(onAddNewEvent({...calendarEvent, id: data.evento.id, user }));

      } catch (error) {
         console.log(error);
         Swal.fire('Error al guardar', error.response.data.msg, 'error' );
      }
      
      
   }

   const StartDeleteEvent = async() => {

      try {

         await calendarApi.delete(`/events/${ activeEvent.id }`);
         dispatch(onDeleteEvent()); 

      } catch (error) {
         console.log(error);
         Swal.fire('Error al eliminar', error.response.data.msg, 'error' );
      }
     
   }

   const startLoadingEvents = async() => {
          try {
              
             const { data } = await calendarApi.get('/events');
             const events = convertEventsToDateEvents( data.events );
             dispatch( onLoadEvents(events) );
         
          } catch (error) {
            console.log('error cargando enventos');
            console.log(error);
          }
   }


  return {
     activeEvent,
     events,
     setSetActiveEvent,
     startLoadingEvents,
     startSavingEvent,
     StartDeleteEvent,
     hasEventSelected: !!activeEvent,  
  }
}
