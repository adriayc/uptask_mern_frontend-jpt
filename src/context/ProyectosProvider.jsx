import { useEffect, useState, createContext } from 'react' 
import { useNavigate } from 'react-router-dom'
// Importar socket.io
import io from 'socket.io-client'
// Importar settings
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth'

// Definir una variable para socket.io
let socket

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {
  const [ proyectos, setProyectos ] = useState([])
  const [ alerta, setAlerta ] = useState({})
  const [ proyecto, setProyecto ] = useState({})
  const [ cargando, setCargando ] = useState(false)
  const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false)
  const [ tarea, setTarea ] = useState({})
  const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
  const [ colaborador, setColaborador ] = useState({})
  const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false)
  const [ buscador, setBuscador ] = useState(false)

  const navigate = useNavigate()
  const { auth } = useAuth()

  // Crear la conexion a socket.io (backend)
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
  }, [])

  const mostrarAlerta = alerta => {
    setAlerta(alerta)

    // Despues de 5s ocultar alerta
    setTimeout(() => {
      setAlerta({})
    }, 5000)
  }

  const submitProyecto = async proyecto => {
    // console.log(proyecto)
    // return;

    if (proyecto.id) {
      await editarProyecto(proyecto)
    } else {
      await nuevoProyecto(proyecto)
    }
  }

  const editarProyecto = async proyecto => {
    // console.log('Editando...')

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Configuracion de la autorizacion
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
      // console.log(data)
      // Sincronizar el state
      const proyectoActualizado = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
      // console.log(proyectoActualizado)
      setProyectos(proyectoActualizado)

      // Mostrar la alerta
      setAlerta({
        msg: 'Proyecto Actualizado Correctamente',
        error: false
      })

      // Redireccionar
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000)

    } catch (error) {
      console.log(error)
    }
  }

  const nuevoProyecto = async proyecto => {
    // console.log('Creando...')

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Configuracion de la autorizacion
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post('/proyectos', proyecto, config)
      // console.log(data)

      // Agregar el proyecto al state (evita solicitar a la API)
      setProyectos([...proyectos, data])

      setAlerta({
        msg: 'Proyecto creado correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')    // Redirigir a la pagina de proyectos
      }, 3000);

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }

        const { data } = await clienteAxios('/proyectos', config)
        // console.log(data)
        setProyectos(data)
      } catch (error) {
        console.log(error)
      }
    }

    obtenerProyectos()

  }, [auth])        // Se llama cada vez que se modifica el auth

  const obtenerProyecto = async id => {
    // console.log(id)

    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios(`/proyectos/${id}`, config)
      // console.log(data)
      setProyecto(data)
      setAlerta({})

    } catch (error) {
      // console.log(error)

      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      navigate('/proyectos')

      setTimeout(() => {
        setAlerta({})
      }, 3000)
    } finally {
      setCargando(false)
    }
    // setCargando(false)
  }  

  const eliminarProyecto = async id => {
    // console.log('Eliminando ', id)

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
      // console.log(data);

      // Sincronizar el state de proyetos
      const proyectosActualizados = proyectos.filter(proyectoState => proyectoState.id !== id)
      // console.log(proyectosActualizados)
      setProyectos(proyectosActualizados)

      // Mostrar alerta
      setAlerta({
        msg: data.msg,
        error: false
      })

      // Redireccionar
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000)

    } catch (error) {
      console.log(error)
    }
  }

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea)
    setTarea({})
  }

  const submitTarea = async tarea => {
    // console.log(tarea)

    if (tarea?.id) {
      // console.log('Editando...')
      // return
      await editarTarea(tarea)
    } else {
      // console.log('Creando...')
      // return
      await crearTarea(tarea)
    }
  }

  const crearTarea = async tarea => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post('/tareas', tarea, config)
      // console.log(data)

      // Cerrar la alerta y modal
      setAlerta({})
      setModalFormularioTarea(false)

      // Socket.io
      socket.emit('nueva tarea', data)

    } catch (error) {
      console.log(error)
    }
  }

  const editarTarea = async tarea => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.put(`tareas/${tarea.id}`, tarea, config)
      // console.log(data)

      // Socket.io
      socket.emit('actualizar tarea', data)

      // Remover la alerta y modal
      setAlerta({})
      setModalFormularioTarea(false)

    } catch (error) {
      console.log(error)
    }
  }

  const handleModalEditarTarea = tarea => {
    // console.log(tarea)

    setTarea(tarea)
    // Mostrar modal
    setModalFormularioTarea(true)
  }

  const handleModalEliminarTarea = tarea => {
    setTarea(tarea)
    // Mostrar modal
    // setModalEliminarTarea(true)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const eliminarTarea = async () => {
    // console.log(tarea)

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.delete(`tareas/${tarea._id}`, config)
      // console.log(data)
      setAlerta({
        msg: data.msg,
        error: false
      })

      // Socket.io
      socket.emit('eliminar tarea', tarea)

      setModalEliminarTarea(false)
      setTarea({})

      // Despues de 3s ocultar alerta
      setTimeout(() => {
        setAlerta({})
      }, 3000)
      
    } catch (error) {
      console.log(error)
    }
  }

  const submitColaborador = async email => {
    // console.log(email)

    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
      // console.log(data)

      setColaborador(data)
      setAlerta({})       // Limpiar alerta
      
    } catch (error) {
      // console.log(error)
      // console.log(error.response)

      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    } finally {
      setCargando(false)
    }
  }

  const agregarColaborador = async email => {
    // console.log(email)
    // console.log(proyecto)
    // return

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
      // console.log(data)

      setAlerta({
        msg: data.msg,
        error: false
      })
      // Reset colaborador y alerta
      setColaborador({})
      // setAlerta({})

      setTimeout(() => {
        setAlerta({})
      }, 3000)
      
    } catch (error) {
      // console.log(error.response)

      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const handleModalEliminarColaborador = colaborador => {
    // console.log(colaborador)
    setColaborador(colaborador)

    setModalEliminarColaborador(!modalEliminarColaborador)
  }

  const eliminarColaborador = async () => {
    // console.log(colaborador)

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)
      // console.log(data)

      const proyectoActualizado = {...proyecto}
      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

      setProyecto(proyectoActualizado)
      setModalEliminarColaborador(false)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})

      setTimeout(() => {
        setAlerta({})
      }, 3000)

    } catch (error) {
      // console.log(error.response)

      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const completarTarea = async id => {
    // console.log(id)

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }

      const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
      // console.log(data)

      // Socker.io
      socket.emit('cambiar estado', data)

      setTarea({})
      setAlerta({})

    } catch (error) {
      console.log(error)
    }
  }

  const handleBuscador = () => {
    setBuscador(!buscador)
  }

  // Socket.io
  const submitTareaProyecto = (tarea) => {
    // Agregar la tarea al state
    const proyectoActualizado = {...proyecto}
    // proyectoActualizado.tareas = [...proyecto.tareas, data]
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

    setProyecto(proyectoActualizado)
  }

  const eliminarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)

    setProyecto(proyectoActualizado)
  }

  const actualizarTareaProyecto = tarea => {
    // Actualizar el state de tareas del proyecto
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)

    setProyecto(proyectoActualizado)
  }

  const cambiarEstadoTarea = tarea => {
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
    
    setProyecto(proyectoActualizado)
  }

  const cerrarSesionProyectos = () => {
    setProyectos([])
    setProyecto({})
    setAlerta({})
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareaProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea,
        cerrarSesionProyectos,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}

export {
  ProyectosProvider
}
export default ProyectosContext