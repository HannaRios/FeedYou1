import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const UBICACIONES = {
  "Antioquia": ["Medellín", "Envigado", "Itagüí", "Bello", "Rionegro"],
  "Bogotá D.C.": ["Bogotá"],
  "Valle del Cauca": ["Cali", "Palmira", "Buga"],
  "Atlántico": ["Barranquilla", "Soledad"],
  "Santander": ["Bucaramanga", "Floridablanca"],
  "Bolívar": ["Cartagena"],
  "Cundinamarca": ["Soacha", "Chía"],
  "Risaralda": ["Pereira"],
  "Quindío": ["Armenia"],
  "Caldas": ["Manizales", "Villamaría"]
};

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, nombre } = location.state || {};

  const [formData, setFormData] = useState({
    username: "", telefono: "", genero: "",
    departamento: "", ciudad: "", fecha_nacimiento: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!email) {
    navigate("/login");
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Usuario requerido";
    if (!formData.genero) newErrors.genero = "Selecciona género";
    if (!formData.departamento) newErrors.departamento = "Requerido";
    if (!formData.ciudad) newErrors.ciudad = "Requerido";
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/usuarios/actualizar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nombre, // no modificamos el nombre de google
          bio: "",
          username: formData.username,
          telefono: formData.telefono,
          genero: formData.genero,
          departamento: formData.departamento,
          ciudad: formData.ciudad,
          fecha_nacimiento: formData.fecha_nacimiento
        })
      });
      
      if (!res.ok) {
        throw new Error("Error guardando los datos del perfil");
      }
      
      navigate("/test-intro");
    } catch (err) {
      console.error(err);
      setErrors({ global: "Ocurrió un error al guardar los datos o el usuario ya existe" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) => `
    w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-[11px] sm:text-sm
    ${isSubmitted && errors[fieldName] ? "border-red-500 shadow-sm" : "border-gray-300 focus:ring-blue-300"}
  `;

  return (
    <AuthLayout>
      <div className="pt-2 sm:pt-8 pb-2 sm:pb-8">
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          Termina tu Perfil
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">Completa estos últimos datos para poder iniciar</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {errors.global && <p className="text-sm text-red-500 text-center font-bold">⚠ {errors.global}</p>}

          <div>
             <input type="text" name="username" placeholder="Nuevo Usuario (Ej. Juan123)" value={formData.username} onChange={handleChange} className={inputClass("username")} />
             {isSubmitted && errors.username && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.username}</p>}
          </div>

          <div className="flex gap-2 items-start w-full">
            <div className="flex-1 min-w-0">
              <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className={inputClass("telefono")} />
            </div>
            <div className="flex-1 min-w-0">
              <select name="genero" value={formData.genero} onChange={handleChange} className={inputClass("genero")}>
                <option value="">Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
              {isSubmitted && errors.genero && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.genero}</p>}
            </div>
          </div>

          <div className="flex gap-2 items-start w-full">
            <div className="flex-1 min-w-0">
              <select name="departamento" value={formData.departamento} onChange={handleChange} className={inputClass("departamento")}>
                <option value="">Dep.</option>
                {Object.keys(UBICACIONES).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {isSubmitted && errors.departamento && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.departamento}</p>}
            </div>
            <div className="flex-1 min-w-0">
              <select name="ciudad" value={formData.ciudad} onChange={handleChange} disabled={!formData.departamento} className={inputClass("ciudad")}>
                <option value="">Ciudad</option>
                {formData.departamento && UBICACIONES[formData.departamento].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {isSubmitted && errors.ciudad && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.ciudad}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 ml-1 uppercase font-bold">Fecha de Nacimiento</label>
            <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className={inputClass("fecha_nacimiento")} />
            {isSubmitted && errors.fecha_nacimiento && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.fecha_nacimiento}</p>}
          </div>

          <div className="pt-2 sm:pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-200 text-gray-800 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-300 transition text-[11px] sm:text-sm">
              {isSubmitting ? "Guardando..." : "Finalizar Registro"}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
