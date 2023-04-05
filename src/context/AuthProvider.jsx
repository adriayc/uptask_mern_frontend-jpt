import { useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom"
// Importar settings
import clienteAxios from "../config/clienteAxios"

const AuthContext = createContext()

const AuthProvider = ({children}) => {
  const [ auth, setAuth ] = useState({})
  const [ cargando, setCargando ] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token')
      // console.log(token)

      if (!token) {
        setCargando(false)
        return
      }

      // console.log('Si hay Token')
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      try {
        // Llamamos la API y le pasamos el config de headers
        const { data } = await clienteAxios('/usuarios/perfil', config)

        // console.log(data)
        setAuth(data)
        // Redireccionar a la pagina de proyectos
        // navigate('/proyectos')
      } catch (error) {
        setAuth({})
      }/* finally {
        setCargando(false)
      }*/
      setCargando(false)
    }
    autenticarUsuario()
  }, [])

  const cerrarSesionAuth = () => {
    setAuth({})
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        cerrarSesionAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthProvider
}
export default AuthContext