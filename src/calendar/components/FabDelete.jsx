
import { useCalendarStore, useUiStore } from "../../hooks"


export const FabDelete = () => {

    
    const {StartDeleteEvent,hasEventSelected} = useCalendarStore();

    const handDelete = () => {
      StartDeleteEvent();
    }
  return (
    <button
      className="btn btn-danger fab-delete"
      onClick={handDelete}
      style={{
         display: hasEventSelected ? '': 'none'
      }}
    >
        <i className="fas fa-trash-alt" ></i>
    </button>
  )
}
