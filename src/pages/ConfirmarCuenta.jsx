import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
// Importar settings
import clienteAxios from '../config/clienteAxios'
// Importar components
import Alerta from '../components/Alerta'

const ConfirmarCuenta = () => {
  const [ alerta, setAlerta ] = useState({})
  const [ cuentaConfirmada, setCuentaConfirmada ] = useState(false)

  const params = useParams()
  const { id } = params
  // console.log(params)

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios.get(url)

        // console.log(data)
        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)

      } catch (error) {
        // console.log(error)
        // console.log(error.response.data.msg)
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

    confirmarCuenta()
    // Eliminar el doble renderizado
    // return () => { confirmarCuenta() }
  }, [])

  const { msg } = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Confirma tu cuenta y Comienza a crear tus <span className='text-slate-700'>proyectos</span></h1>

      <div className='mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (
          <Link to='/' className='block text-center my-5 text-slate-500 uppercase text-sm'>Inicia Sesión</Link>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta