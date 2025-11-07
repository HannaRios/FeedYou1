import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }

    // Validar username
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener mayúsculas y minúsculas';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simular llamada a API
    setTimeout(() => {
      console.log('Register:', formData);
      // Aquí irá la lógica de registro
      // Si es exitoso, redirigir al test de intereses
      navigate('/interest-test');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="pt-12">
        {/* Título */}
        <h1 
          className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-8"
          style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          FeedYou
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre Completo */}
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Nombre completo"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.fullName 
                  ? 'border-red-500 focus:ring-red-300' 
                  : 'border-gray-300 focus:ring-blue-300'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-300' 
                  : 'border-gray-300 focus:ring-blue-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Nombre de perfil o nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.username 
                  ? 'border-red-500 focus:ring-red-300' 
                  : 'border-gray-300 focus:ring-blue-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-300' 
                  : 'border-gray-300 focus:ring-blue-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:ring-red-300' 
                  : 'border-gray-300 focus:ring-blue-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Términos y condiciones */}
          <p className="text-xs text-gray-500 text-center px-2 leading-relaxed">
            Al registrarte, aceptas nuestros términos y condiciones, 
            Reglas de la comunidad y aceptas nuestra 
            Política de privacidad y de cookies.
          </p>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-blue-300 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registrando...' : 'Registrarte'}
            </button>
            <Link
              to="/login"
              className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition text-center text-sm"
            >
              Volver
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}