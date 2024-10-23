const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Texto copiado exitosamente!");
  } catch (err) {
    console.error("Error al copiar el texto: ", err);
    throw new Error("No se pudo copiar el texto.");
  }
};

export default copyToClipboard
