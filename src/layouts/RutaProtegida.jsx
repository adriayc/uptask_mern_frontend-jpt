import { Outlet, Navigate } from "react-router-dom"
// Impotar custom hooks
import useAuth from "../hooks/useAuth"
// Importar components
import Header from "../components/Header."
import Sidebar from "../components/Sidebar"

const RutaProtegida = () => {
  const { auth, cargando } = useAuth()
  // console.log(auth)
  // console.log(cargando)

  if (cargando) return 'Cargando...'
  return (
    <>
      {/* {auth._id ? 'Autenticado' : 'No Autenticado'} */}
      {/* {auth._id ? 'Autenticado' : <Navigate to='/' />} */}
      {auth._id ? (
        <div className="bg-gray-100">
          <Header />

          <div className="md:flex md:min-h-screen">
            <Sidebar />

            <main className="flex-1 p-10">
              <Outlet />
            </main>
          </div>
        </div>
      ) : <Navigate to='/' />}
    </>
  )
}

export default RutaProtegida