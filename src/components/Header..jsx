import { Link } from 'react-router-dom'
// Importar custom hooks
import useProyectos from '../hooks/useProyectos'
import useAuth from '../hooks/useAuth'
// Importar components
import Busqueda from './Busqueda'

const Header = () => {
  const { handleBuscador, cerrarSesionProyectos } = useProyectos()
  const { cerrarSesionAuth } = useAuth()

  const handleCerrarSesion = () => {
    cerrarSesionAuth()
    cerrarSesionAuth()
    localStorage.removeItem('token')
  }

  return (
    <header className="px-4 py-5 bg-white border-b">
      <div className="md:flex md:justify-between">
        <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">UpTask</h2>

        {/* <input 
          type='search'
          placeholder="Buscar Proyecto"
          className="rounded-lg lg:w-96 block p-2 border"
        /> */}

        <div className='flex flex-col md:flex-row items-center gap-4'>
          <button
            type='button'
            className='font-bold uppercase'
            onClick={handleBuscador}
          >Buscar Proyectos</button>

          <Link 
            to='/proyectos' 
            className='font-bold uppercase'
          >Proyectos</Link>

          <button 
            type='button'
            className='text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold'
            onClick={handleCerrarSesion}
          >Cerrar Sesíon</button>

          {/* Modal buscador */}
          <Busqueda />
        </div>
      </div>
    </header>
  )
}

export default Header