const API_URL = "http://localhost:4000/api/usuarios";
export async function registrarUsuario(usuario) {
  try {
    const response = await fetch("http://localhost:4000/api/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const text = await response.text();
      let mensajeError = "Error al registrar usuario";

      if (text.startsWith("<!DOCTYPE")) {
        throw new Error("No se pudo conectar con el backend (verifica la URL)");
      }

      const data = JSON.parse(text);
      throw new Error(data.error || mensajeError);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error.message);
    throw error;
  }
}
