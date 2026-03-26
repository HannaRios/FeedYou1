import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { registrarUsuario } from "../services/userService";
import { useAuth } from "../context/AuthContext";

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

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", username: "", telefono: "", genero: "",
    departamento: "", ciudad: "", fechaNacimiento: "", password: "", confirmPassword: "",
  });
  
  console.log("Datos enviados:", formData);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const validateForm = () => {
    const newErrors = {};

    // Nombre
    if (!formData.fullName.trim()) newErrors.fullName = "El nombre es requerido";
    
    // Email
    if (!formData.email) newErrors.email = "Correo requerido";
    
    // Usuario
    if (!formData.username) newErrors.username = "Usuario requerido";

    // Ubicación y otros
    if (!formData.genero) newErrors.genero = "Selecciona género";
    if (!formData.departamento) newErrors.departamento = "Requerido";
    if (!formData.ciudad) newErrors.ciudad = "Requerido";
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "Requerido";

    // --- VALIDACIÓN DE CONTRASEÑA ---
    const pass = formData.password;
    if (!pass) {
      newErrors.password = "La contraseña es requerida";
    } else if (pass.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    } else if (!/[A-Z]/.test(pass)) {
      newErrors.password = "Falta una MAYÚSCULA";
    } else if (!/[0-9]/.test(pass)) {
      newErrors.password = "Falta al menos un número";
    } else if (!/[!@#$%^&*.\-_,;]/.test(pass)) {
      newErrors.password = "Falta carácter especial (!@#$)";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "No coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const response = await registrarUsuario(formData);
      
      login({ email: formData.email, nombre: formData.fullName });
      navigate("/test-intro");

    } catch (err) {
      
      console.error("Error detallado:", err);

      if (err.response && (err.response.status === 400 || err.response.status === 409)) {
      
        setErrors({ email: "Este correo o usuario ya existe" });
      } else {
        setErrors({ email: "Error de conexión con el servidor" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) => `
    w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
    ${isSubmitted && errors[fieldName] ? "border-red-500 shadow-sm" : "border-gray-300 focus:ring-blue-300"}
  `;

  return (
    <AuthLayout>
      <div className="pt-8 pb-8">
        <h1 className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-6" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          FeedYou
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {/* Nombre */}
          <div>
            <input type="text" name="fullName" placeholder="Nombre completo" value={formData.fullName} onChange={handleChange} className={inputClass("fullName")} />
            {isSubmitted && errors.fullName && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.fullName}</p>}
          </div>

          <div className="flex gap-2 items-start">
            <div className="flex-[2]">
              <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className={inputClass("email")} />
              {isSubmitted && errors.email && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.email}</p>}
            </div>
            <div className="flex-1">
              <input type="text" name="username" placeholder="Usuario" value={formData.username} onChange={handleChange} className={inputClass("username")} />
              {isSubmitted && errors.username && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.username}</p>}
            </div>
          </div>

          {/* Teléfono y Género */}
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className={inputClass("telefono")} />
            </div>
            <div className="flex-1">
              <select name="genero" value={formData.genero} onChange={handleChange} className={inputClass("genero")}>
                <option value="">Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                
                <option value="Otro">Otro</option>
              </select>
              {isSubmitted && errors.genero && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.genero}</p>}
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <select name="departamento" value={formData.departamento} onChange={handleChange} className={inputClass("departamento")}>
                <option value="">Departamento</option>
                {Object.keys(UBICACIONES).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {isSubmitted && errors.departamento && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.departamento}</p>}
            </div>
            <div className="flex-1">
              <select name="ciudad" value={formData.ciudad} onChange={handleChange} disabled={!formData.departamento} className={inputClass("ciudad")}>
                <option value="">Ciudad</option>
                {formData.departamento && UBICACIONES[formData.departamento].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {isSubmitted && errors.ciudad && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.ciudad}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 ml-1 uppercase font-bold">Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className={inputClass("fechaNacimiento")} />
            {isSubmitted && errors.fechaNacimiento && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.fechaNacimiento}</p>}
          </div>

          {/* Contraseñas */}
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className={inputClass("password")} />
              {isSubmitted && errors.password && <p className="text-[9px] text-red-500 ml-1 mt-0.5 font-bold italic leading-tight">⚠ {errors.password}</p>}
            </div>
            <div className="flex-1">
              <input type="password" name="confirmPassword" placeholder="Confirmar" value={formData.confirmPassword} onChange={handleChange} className={inputClass("confirmPassword")} />
              {isSubmitted && errors.confirmPassword && <p className="text-[10px] text-red-500 ml-1 mt-0.5 font-bold">⚠ {errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-blue-300 transition text-sm">
              {isSubmitting ? "Registrando..." : "Registrarte"}
            </button>
            <Link to="/login" className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition text-center text-sm">Volver</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}