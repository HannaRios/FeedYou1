import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

// 🔵 Indicador de estado
const StatusDot = ({ color }) => {
  const colors = {
    baneado: 'bg-slate-900',
    activo: 'bg-emerald-400',
    online: 'bg-emerald-500',
    pendiente: 'bg-amber-400',
  };
  return <div className={`w-2 h-2 rounded-full ${colors[color] || 'bg-slate-300'}`}></div>;
};

// 📊 Tarjeta de estadísticas
const StatCard = ({ title, value, colorClass }) => (
  <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 hover:shadow-md">
    <h3 className="text-slate-400 text-[10px] font-bold uppercase mb-2">{title}</h3>
    <p className={`text-5xl font-light ${colorClass}`}>{value}</p>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [tabActual, setTabActual] = useState('inicio');
  const [usuarios, setUsuarios] = useState([]);
  const [denuncias, setDenuncias] = useState([]);
  const [moderacion, setModeracion] = useState([]);
  const [dataRegistros, setDataRegistros] = useState([]);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:4000";
  const COLORES_GRAFICA = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  // 🔄 Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [resU, resD, resM, resReg, resCat] = await Promise.all([
        fetch(`${API_URL}/api/usuarios/lista`),
        fetch(`${API_URL}/api/usuarios/admin/denuncias`),
        fetch(`${API_URL}/api/usuarios/admin/moderacion-pendientes`),
        fetch(`${API_URL}/api/usuarios/stats/registros`),
        fetch(`${API_URL}/api/usuarios/stats/categorias`)
      ]);

      const dataU = await resU.json();
      setUsuarios(Array.isArray(dataU) ? dataU : []);

      if (resD.ok) setDenuncias(await resD.json());
      if (resM.ok) setModeracion(await resM.json());
      if (resReg.ok) setDataRegistros(await resReg.json());
      if (resCat.ok) setDataCategorias(await resCat.json());

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [tabActual]);

  // 🧨 Eliminar post
  const handleEliminarPost = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar?',
      icon: 'warning',
      showCancelButton: true
    });

    if (confirm.isConfirmed) {
      await fetch(`${API_URL}/api/usuarios/admin/eliminar-publicacion/${id}`, { method: 'DELETE' });
      cargarDatos();
    }
  };

  // ❌ Descartar denuncia
  const handleDescartarDenuncia = async (id) => {
    await fetch(`${API_URL}/api/usuarios/admin/descartar-denuncia/${id}`, { method: 'PUT' });
    cargarDatos();
  };

  // 🔄 Ban / activar usuario
  const handleAccionUsuario = async (email, estado) => {
    const nuevoEstado = estado === 'baneado' ? 'activo' : 'baneado';

    await fetch(`${API_URL}/api/usuarios/actualizar-estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nuevoEstado }),
    });

    cargarDatos();
  };

  return (
    <div className="flex h-screen bg-[#fcfcfd]">

      {/* SIDEBAR */}
      <aside className="w-72 p-6 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1]">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        {['inicio', 'usuarios', 'moderacion', 'denuncias', 'Soporte'].map(tab => (
          <button
            key={tab}
            onClick={() => setTabActual(tab)}
            className="block w-full text-left py-2"
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* INICIO */}
        {tabActual === 'inicio' && (
          <>
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Usuarios" value={usuarios.length} colorClass="text-indigo-500" />
              <StatCard title="Baneados" value={usuarios.filter(u => u.estado === 'baneado').length} colorClass="text-red-500" />
              <StatCard title="Denuncias" value={denuncias.length} colorClass="text-yellow-500" />
              <StatCard title="Moderación" value={moderacion.length} colorClass="text-green-500" />
            </div>

            {/* GRÁFICA */}
            <div className="mt-10 h-80">
              <ResponsiveContainer>
                <LineChart data={dataRegistros}>
                  <Line dataKey="cantidad" stroke="#6366f1" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* USUARIOS */}
        {tabActual === 'usuarios' && (
          <table className="w-full mt-6">
            <thead>
              <tr>
                <th>Email</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.email}>
                  <td>{u.email}</td>
                  <td>{u.estado}</td>
                  <td>
                    <button onClick={() => handleAccionUsuario(u.email, u.estado)}>
                      Cambiar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* DENUNCIAS */}
        {tabActual === 'denuncias' && (
          <div>
            {denuncias.map(d => (
              <div key={d.id_denuncia}>
                {d.motivo}
                <button onClick={() => handleDescartarDenuncia(d.id_denuncia)}>Descartar</button>
              </div>
            ))}
          </div>
        )}

        {/* MODERACIÓN */}
        {tabActual === 'moderacion' && (
          <div>
            {moderacion.map(m => (
              <div key={m.id_publicacion}>
                {m.contenido}
                <button onClick={() => handleEliminarPost(m.id_publicacion)}>Eliminar</button>
              </div>
            ))}
          </div>
        )}

        {/* SOPORTE */}
        {tabActual === 'Soporte' && (
          <div className="mt-10 text-center">
            <h2>Soporte</h2>
            <p>feedyou.hvn@gmail.com</p>
          </div>
        )}

      </main>
    </div>
  );
}