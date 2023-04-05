import { useState } from "react"
// Importar custom hooks
import useProyectos from "../hooks/useProyectos"
// Importar components
import Alerta from "./Alerta"

const FormularioColaborador = () => {
  const [ email, setEmail ] = useState('')

  const { alerta, mostrarAlerta, submitColaborador } = useProyectos()

  const handleSubmit = e => {
    e.preventDefault()

    if (email === '') {
      mostrarAlerta({
        msg: 'El email es obligatorio',
        error: true
      })

      return
    }

    submitColaborador(email)
  }

  const { msg } = alerta

  return (
    <form
      className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
      onSubmit={ handleSubmit }
    >
      {/* Mostrar alerta */}
      {msg && <Alerta alerta={alerta} />}

      <div className="mb-5">
        <label 
          htmlFor="email"
          className="text-gray-700 font-bold text-sm uppercase"
        >Email Colaborador</label>
        <input 
          type="email" 
          name="" 
          id="email"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Email del Usuario"
          value={ email }
          onChange={ e => setEmail(e.target.value) }
        />
      </div>

      <input 
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm"
        value="Buscar Colaborador"
      />
    </form>
  )
}

export default FormularioColaborador