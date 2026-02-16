import { useState, useEffect } from "react";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("Andrea Gómez");
  const [email, setEmail] = useState("Andrea@example.com");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState("/avatar-default.png");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===============================
    CARGAR DATOS GUARDADOS
  =============================== */
useEffect(() => {

  const loadProfile = async () => {

    if (!user?.email) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/usuarios/${user.email}`)
      .then(res => res.json())
      .then(data => {

        setName(data.nombre);
        setEmail(data.email);
        setBio(data.bio || "");

        if (data.foto_perfil){
          setPhoto(`${API_URL}${data.foto_perfil}`);
        } 
        setLoading(false);
      })

        .catch(err => {
          console.error(err);
          setLoading(false); 
        });

    };

    loadProfile();

}, [user]);



  /* ===============================
    CAMBIO DE FOTO (BASE64)
  =============================== */
const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!user?.email) return;


  const formData = new FormData();
  formData.append("email", user.email);
  formData.append("foto", file);

  const res = await fetch(
    `${API_URL}/api/usuarios/foto-perfil`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (res.ok) {
    // mostrar la imagen real del servidor
    setPhoto(`${API_URL}${data.foto_perfil}`);
  }
};


  /* ===============================
    GUARDAR PERFIL
  =============================== */
const handleSave = async (e) => {

  e.preventDefault();

  if (!user?.email) return;

  try {
    const res = await fetch(
        `${API_URL}/api/usuarios/actualizar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            bio: bio,
            email: user.email,
            nombre: name
          }),
      }
    );

    if (!res.ok) throw new Error("Error al guardar");

    navigate("/profile");

  } catch (error) {

    console.error(error);

    alert("Error al guardar perfil");

  }

};


  if (loading) return <div>Cargando...</div>;



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ===== TOAST ===== */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-white/90 backdrop-blur-md border border-green-300 text-gray-800 shadow-xl rounded-2xl px-5 py-3 flex items-center gap-3 animate-slide-in">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <p className="font-medium">Perfil actualizado correctamente</p>
          </div>
        </div>
      )}

      {/* ===== CONTENIDO ===== */}
      <div className="flex-grow flex justify-center items-center px-4 py-10 bg-[url('/bg-dark.jpg')] bg-cover bg-center">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8 relative">

          <button
            onClick={() => navigate("/profile")}
            className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6 mt-4">
            Editar perfil
          </h1>

          <form onSubmit={handleSave} className="space-y-6">

            {/* FOTO */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={photo}
                  alt="Foto de perfil"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                />
                <label
                  htmlFor="photo"
                  className="absolute bottom-0 right-0 bg-blue-200 p-2 rounded-full cursor-pointer hover:bg-blue-300 transition"
                >
                  <Upload className="w-4 h-4 text-blue-700" />
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cambia tu foto de perfil
              </p>
            </div>

            {/* NOMBRE */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>

            {/* BIO */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Descripción
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                rows="4"
                placeholder="Cuéntanos algo sobre ti..."
                maxLength={160}
              ></textarea>

              <p className="text-sm text-gray-400">
                {bio.length}/160 caracteres
              </p>
            </div>

            {/* BOTÓN */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== ANIMACIÓN ===== */}
      <style>{`
        @keyframes slide-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
