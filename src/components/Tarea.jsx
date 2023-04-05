// Importar custom hooks
import useProyectos from '../hooks/useProyectos'
import useAdmin from '../hooks/useAdmin'
// Importar helpers
import { formatearFecha } from '../helpers/formatearFecha'

const Tarea = ({tarea}) => {
  const { nombre, descripcion, estado, fechaEntrega, prioridad, _id } = tarea

  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos()
  const admin = useAdmin()

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className='flex flex-col items-start'>
        <p className="text-xl mb-1">{nombre}</p>
        <p className="text-sm text-gray-500 uppercase mb-1">{descripcion}</p>
        <p className="text-sm mb-1">{formatearFecha(fechaEntrega)}</p>
        <p className="text-gray-600 mb-1">Prioridad: {prioridad}</p>
        {estado && <p className='text-xs bg-green-600 uppercase p-1 rounded-lg text-white'>Completado por: {tarea.completado.nombre}</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {admin && (
          <button
            className="font-bold text-white text-sm bg-indigo-600 px-4 py-3 rounded-lg uppercase"
            onClick={ () => handleModalEditarTarea(tarea) }
          >Editar</button>
        )}

        {/* {estado ? (
          <button
            className="font-bold text-white text-sm bg-sky-600 px-4 py-3 rounded-lg uppercase"
            onClick={() => completarTarea(_id)}
          >Completa</button>
        ) : (
          <button
            className="font-bold text-white text-sm bg-gray-600 px-4 py-3 rounded-lg uppercase"
            onClick={() => completarTarea(_id)}
          >Incompleta</button>
        )} */}

          <button
            className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} font-bold text-white text-sm px-4 py-3 rounded-lg uppercase`}
            onClick={() => completarTarea(_id)}
          >{estado ? 'Completa' : 'Incompleta'}</button>

        {admin && (
          <button
            className="font-bold text-white text-sm bg-red-600 px-4 py-3 rounded-lg uppercase"
            onClick={ () => handleModalEliminarTarea(tarea) }
          >Eliminar</button>
        )}
      </div>
    </div>
  )
}

export default Tarea