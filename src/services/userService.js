export const registrarUsuario = async (datosFrontend) => {
  try {
    const datosBackend = {
      nombre: datosFrontend.fullName,         
      email: datosFrontend.email,
      username: datosFrontend.username,
      telefono: datosFrontend.telefono,
      genero: datosFrontend.genero,
      departamento: datosFrontend.departamento,
      ciudad: datosFrontend.ciudad,
      fecha_nacimiento: datosFrontend.fechaNacimiento, 
      contrasena: datosFrontend.password      
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/usuarios/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosBackend), 
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = Array.isArray(data.errors) 
        ? data.errors.map(e => e.msg).join(", ") 
        : data.error || "Error en el registro";
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error("Error en registrarUsuario:", error.message);
    throw error;
  }
};