import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom'
// Importar custom hooks
import useProyectos from "../hooks/useProyectos"
// Importar components
import Alerta from "./Alerta"

const FormularioProyecto = () => {
  const [ id, setId ] = useState(null)
  const [ nombre, setNombre ] = useState('')
  const [ descripcion, setDescripcion ] = useState('')
  const [ fechaEntrega, setFechaEntrega ] = useState('')
  const [ cliente, setCliente ] = useState('')

  const navigate = useNavigate()
  const params = useParams()
  // console.log(params)

  const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
      // console.log('Todos los campos son obligatorios')
      mostrarAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    // Pasar los datos hacia el provider
    await submitProyecto({
      id,
      nombre,
      descripcion,
      fechaEntrega,
      cliente,
    })

    setId(null)
    setNombre('')
    setDescripcion('')
    setFechaEntrega('')
    setCliente('')
  }

  const { msg } = alerta

  useEffect(() => {
    // console.log(params)
    if (params.id) {
    // if (params.id && proyecto.nombre) {
      // console.log('Editando Proyecto...')
      // console.log(proyecto.fechaEntrega)

      setId(proyecto._id)
      setNombre(proyecto.nombre)
      setDescripcion(proyecto.descripcion)
      // setFechaEntrega(proyecto.fechaEntrega.split('T')[0])
      setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
      setCliente(proyecto.cliente)
    }/* else {
      console.log('Nuevo Proyecto')
    }*/
  }, [params])

  return (
    <form 
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {/* Mostrar alerta */}
      {msg && <Alerta alerta={alerta} />}

      <div className="mb-5">
        <label 
          htmlFor="nombre"
          className="text-gray-700 uppercase font-bold text-sm"
        >Nombre Proyecto</label>

        <input 
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          id="nombre"
          placeholder="Nombre del proyecto"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label 
          htmlFor="descripcion"
          className="text-gray-700 uppercase font-bold text-sm"
        >Descripción</label>

        <textarea 
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          id="descripcion"
          placeholder="Descripción del proyecto"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-5">
        <label 
          htmlFor="fecha-entrega"
          className="text-gray-700 uppercase font-bold text-sm"
        >Fecha Entrega</label>

        <input 
          type="date"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          id="fecha-entrega"
          value={fechaEntrega}
          onChange={e => setFechaEntrega(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label 
          htmlFor="cliente"
          className="text-gray-700 uppercase font-bold text-sm"
        >Nombre Cliente</label>

        <input 
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          id="cliente"
          placeholder="Nombre del Cliente"
          value={cliente}
          onChange={e => setCliente(e.target.value)}
        />
      </div>

      <input 
        type='submit'
        value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        className="bg-sky-600 w-full p-3 font-bold text-white uppercase rounded cursor-pointer hover:bg-sky-700 transition-colors"
      />
    </form>
  )
}

export default FormularioProyecto