import { useEffect/*, useState*/ } from "react"
import { useParams, Link } from "react-router-dom"
// Importar socket.io
import io from 'socket.io-client'
// Importar custom hooks
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"
// Importar components
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import Tarea from "../components/Tarea"
import Colaborador from "../components/Colaborador"
import ModalEliminarColaborador from "../components/ModalElimiarColaborador"

// Definimos una variable para socke.io-client
let socket

const Proyecto = () => {
  const params = useParams()
  // console.log(params)

  const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareaProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyectos()
  const admin = useAdmin()

  // obtenerProyecto(params.id)
  // Lo ideal es mejor cargarlo por medio de hooks
  useEffect(() => {
    obtenerProyecto(params.id)
  }, [])

  // useEffect que se ejecuta una sola vez para la conexion a socket.io (backend)
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    // Emitir un evento al backend (socket.io) e informa en que proyecto se encuentra
    socket.emit('abrir proyecto', params.id)
  }, [])

    // Recibiendo el evento desde socker.io (backend)
    useEffect(() => {
      socket.on('tarea agregada', tareaNueva => {
        // console.log(tareaNueva)

        // Validar el ID del proyecto
        if (tareaNueva.proyecto === proyecto._id) {
          submitTareaProyecto(tareaNueva)
        }
      })

      socket.on('tarea eliminada', tareaEliminada => {
        if (tareaEliminada.proyecto === proyecto._id) {
          eliminarTareaProyecto(tareaEliminada)
        }
      })

      socket.on('tarea actualizada', tareaActualizar => {
        if (tareaActualizar.proyecto._id === proyecto._id) {
          actualizarTareaProyecto(tareaActualizar)
        }
      })

      socket.on('nuevo estado', nuevoEstadoTarea => {
        if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
          cambiarEstadoTarea(nuevoEstadoTarea)
        }
      })
    })

  // useEffect que se ejecuta todo el tiempo
  useEffect(() => {
    // Recibir la respuesta desde socker.io (backend)
    socket.on('respuesta', (persona) => {
      console.log(persona)
    })
  })   // Sin dependencia

  // console.log(proyecto)
  const { nombre } = proyecto

  if (cargando) return 'Cargando...'

  // console.log(proyecto)
  // console.log(proyecto.tareas?.length)
  // console.log(admin)

  const { msg } = alerta

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{nombre}</h1>

        {admin && (
          <div className="flex items-center gap-2 text-gray-400 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>

            <Link
              to={`/proyectos/editar/${params.id}`}
              className='uppercase font-bold'
            >Editar</Link>
          </div>
        )}
      </div>

      {admin && (
        <button
          type="button"
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center"
          onClick={ handleModalTarea }
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
          </svg>
          Nueva Tarea
        </button>
      )}

      <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>
      
      <div className="bg-white shadow rounded-lg mt-10">
        {/* {proyecto.tareas?.length ? 'Si hay tareas' : 'No hay tareas'} */}
        {proyecto.tareas?.length ? proyecto.tareas?.map(tarea => (
          <Tarea 
            key={tarea._id}
            tarea={tarea}
          />
        )) : <p className="text-center my-5 p-10">No hay tareas en este proyecto</p>}
      </div>

      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl">Colaboradores</p>
            <Link
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className='text-gray-400 hover:text-black font-bold uppercase'
            >Añadir</Link>
          </div>

          <div className="bg-white shadow rounded-lg mt-10">
            {proyecto.colaboradores?.length ? proyecto.colaboradores?.map(colaborador => (
              <Colaborador 
                key={colaborador._id}
                colaborador={colaborador}
              />
            )) : <p className="text-center my-5 p-10">No hay colaboradores en este proyecto</p>}
          </div>
        </>
      )}

      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  )
}

export default Proyecto