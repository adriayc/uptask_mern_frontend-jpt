import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
// Importar settings
import clienteAxios from '../config/clienteAxios'
// Importar components
import Alerta from '../components/Alerta'

const NuevoPassword = () => {
  const [ password, setPassword ] = useState('')
  const [ tokenValido, setTokenValido ] = useState(false)
  const [ alerta, setAlerta ] = useState({})
  const [ passwordModificado, setPasswordModificado ] = useState(false)

  const params = useParams()
  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        // const { data } = await axios(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        
        // console.log(data)
        setTokenValido(true)
      } catch (error) {
        // console.log(error.response)
        // console.log(error.response.data.msg)
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }

    }
    comprobarToken()
  }, [])

  const { msg } = alerta

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      setAlerta({
        msg: 'El password debe ser mínimo 6 caracteres',
        error: true
      })
      return
    }

    try {
      const url = `/usuarios/olvide-password/${token}`
      const { data } = await clienteAxios.post(url, {
        password
      })

      // console.log(data)
      setAlerta({
        msg: data.msg,
        error: false
      })
      setPasswordModificado(true)
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  return (
    <>
    <h1 className='text-sky-600 font-black text-6xl capitalize'>Reestablece tu password y no pierdas acceso a tus <span className='text-slate-700'>proyectos</span></h1>

    {/* Mostrar alerta */}
    {msg && <Alerta alerta={alerta} />}

    {tokenValido && (
      <form 
        className='my-10 bg-white shadow rounded-lg p-10'
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label htmlFor="password" className="text-gray-600 text-xl font-bold block uppercase">Nuevo Password</label>
          <input 
            type="password"
            placeholder="Escribe tu nuevo Password"
            id="password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={ e => setPassword(e.target.value) }
          />
        </div>

        <input 
          type="submit" 
          value="Guardar Nuevo Password"
          className="bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>
    )}

    {passwordModificado && (
      <Link to='/' className='block text-center my-5 text-slate-500 uppercase text-sm'>Iniciar Sesión</Link>
    )}
  </>
  )
}

export default NuevoPassword