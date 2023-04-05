import { useContext } from "react"
// Importar contexts
import ProyectosContext from "../context/ProyectosProvider"

const useProyectos = () => {
    return useContext(ProyectosContext)
}

export default useProyectos