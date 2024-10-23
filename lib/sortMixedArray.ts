// Función de comparación para ordenar tanto números como letras
const sortMixedArray = (a: string | number, b: string | number): number => {
  // Verificar si ambos elementos son números
  if (typeof a === "number" && typeof b === "number") {
    return a - b; // Ordenar números de forma ascendente
  }

  // Si ambos son cadenas, compararlos como texto
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }

  // Si uno es número y otro es cadena, poner los números primero
  return typeof a === "string" ? 1 : -1;
};

export default sortMixedArray