const API_URL = "http://localhost:4000/api/usuarios";
export async function registrarUsuario(usuario) {
  try {
    const response = await fetch("http://localhost:4000/api/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    // Si el servidor responde con HTML (error 404 o 500), esto lanza el mismo error que viste
    if (!response.ok) {
      const text = await response.text();
      let mensajeError = "Error al registrar usuario";

      // Detecta si el backend devolvió HTML en lugar de JSON
      if (text.startsWith("<!DOCTYPE")) {
        throw new Error("No se pudo conectar con el backend (verifica la URL)");
      }

      const data = JSON.parse(text);
      throw new Error(data.error || mensajeError);
    }

    // ✅ Todo bien, parsea el JSON correctamente
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error.message);
    throw error;
  }
}
