export const formatearFecha = fecha => {
  // console.log(fecha)
  // console.log(fecha.split('T')[0].split('-'))     // ['2023', '01', '31']

  // const nuevaFecha = new Date(fecha)
  const nuevaFecha = new Date(fecha.split('T')[0].split('-'))
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return nuevaFecha.toLocaleDateString('es-ES', opciones)
}