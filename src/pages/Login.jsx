import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Importar settings
import clienteAxios from '../config/clienteAxios'
// Impotar custom hooks
import useAuth from '../hooks/useAuth'
// Importar components
import Alerta from '../components/Alerta'

const Login = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ alerta, setAlerta ] = useState({})

  const navigate = useNavigate()

  const { /*auth, */setAuth/*, cargando*/ } = useAuth()

  // console.log(auth)
  // console.log(cargando)

  const handleSubmit = async e => {
    e.preventDefault()

    // Validar que no esten vacios
    if ([email, password].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    try {
      const { data } = await clienteAxios.post('usuarios/login', {
        email,
        password
      })
      
      setAlerta({})

      // console.log(data)
      // Almacenar el token en LocalStorage
      localStorage.setItem('token', data.token)

      setAuth(data)

      // Navegar a la raiz del proyecto
      navigate('/proyectos')

    } catch (error) {
      console.log(error.response.data.msg)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesión y administra tus <span className="text-slate-700">proyectos</span></h1>

      {/* Mostrar alerta */}
      { msg && <Alerta alerta={alerta} /> }

      <form 
        className="bg-white shadow rounded-lg my-10 p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label htmlFor="email" className="text-gray-600 text-xl font-bold block uppercase">Email</label>
          <input 
            type="email"
            placeholder="Email de Registro"
            id="email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={ e => setEmail(e.target.value) }
          />
        </div>

        <div className="my-5">
          <label htmlFor="password" className="text-gray-600 text-xl font-bold block uppercase">Password</label>
          <input 
            type="password"
            placeholder="Password de Registro"
            id="password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={ e => setPassword(e.target.value) }
          />
        </div>

        <input 
          type="submit" 
          value="Iniciar Sesión"
          className="bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/registrar'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >¿No tienes una cuenta? Regístrate</Link>

        <Link
          to='/olvide-password'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >Olvide Mi Password</Link>
      </nav>
    </>
  )
}

export default Login