import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
// Importación de componentes de Recharts
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar, Cell 
    } from 'recharts';

    const StatusDot = ({ color }) => {
    const colors = {
        baneado: 'bg-slate-900',
        activo: 'bg-emerald-400',
        online: 'bg-emerald-500',
        pendiente: 'bg-amber-400',
    };
    return <div className={`w-2 h-2 rounded-full ${colors[color] || 'bg-slate-300'}`}></div>;
    };

    const StatCard = ({ title, value, colorClass }) => (
    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 transition-all hover:shadow-md group">
        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-slate-600 transition-colors">{title}</h3>
        <p className={`text-5xl font-light tracking-tighter ${colorClass}`}>{value}</p>
    </div>
    );

    export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tabActual, setTabActual] = useState('inicio');
    const [usuarios, setUsuarios] = useState([]);
    const [denuncias, setDenuncias] = useState([]);
    const [moderacion, setModeracion] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para las gráficas
    const [dataRegistros, setDataRegistros] = useState([]);
    const [dataCategorias, setDataCategorias] = useState([]);

    const [formData, setFormData] = useState({
        nombre: "",
        username: "",
        email: "",
        bio: "",
        telefono: "",
        ciudad: "",
        foto_perfil: ""
    });

    const API_URL = "http://localhost:4000";
    
    // Función segura para obtener la imagen, a prueba de barras invertidas o espacios
    const getSecureImageUrl = (path) => {
        if (!path) return "/avatar-default.png";
        if (path.startsWith("http")) return path;
        const cleanPath = path.toString().replace(/\\/g, '/').replace(/^\/+/, '');
        return `${API_URL}/${cleanPath}`;
    };
    const COLORES_GRAFICA = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    const cargarDatos = async () => {
        try {
        setLoading(true);
        
        // Llamadas en paralelo para mejor rendimiento
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
        
        // Carga de estadísticas para gráficas
        if (resReg.ok) setDataRegistros(await resReg.json());
        if (resCat.ok) setDataCategorias(await resCat.json());

        } catch (error) {
        console.error("Error al cargar datos:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [tabActual]);

    // --- ACCIONES DE MODERACIÓN ---
    const handleEliminarPost = async (id_publicacion) => {
        Swal.fire({
        title: '¿Eliminar publicación?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e11d48',
        confirmButtonText: 'Sí, eliminar',
        borderRadius: '25px'
        }).then(async (result) => {
        if (result.isConfirmed) {
            try {
            const res = await fetch(`${API_URL}/api/usuarios/admin/eliminar-publicacion/${id_publicacion}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire({ title: 'Eliminado', icon: 'success', borderRadius: '25px' });
                cargarDatos();
            }
            } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
        });
    };

    const handleDescartarDenuncia = async (id_denuncia) => {
        try {
        const res = await fetch(`${API_URL}/api/usuarios/admin/descartar-denuncia/${id_denuncia}`, { method: 'PUT' });
        if (res.ok) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Denuncia descartada', showConfirmButton: false, timer: 1500 });
            cargarDatos();
        }
        } catch (error) {
        Swal.fire('Error', 'No se pudo procesar', 'error');
        }
    };

    const handleAccionUsuario = async (email, estadoActual) => {
        const nuevoEstado = estadoActual === 'baneado' ? 'activo' : 'baneado';
        Swal.fire({
        title: `¿Confirmar acción?`,
        text: `Vas a cambiar el estado de ${email}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        borderRadius: '25px',
        }).then(async (result) => {
        if (result.isConfirmed) {
            try {
            const res = await fetch(`${API_URL}/api/usuarios/actualizar-estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, nuevoEstado }),
            });
            if (res.ok) {
                Swal.fire({ title: 'Éxito', icon: 'success', timer: 1000, showConfirmButton: false, borderRadius: '25px' });
                cargarDatos();
            }
            } catch (error) {
            Swal.fire('Error', 'Fallo de conexión', 'error');
            }
        }
        });
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-[#fcfcfd] overflow-hidden font-sans text-slate-600">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 h-auto lg:h-screen flex flex-col p-4 lg:p-8 bg-gradient-to-b from-[#e2e8f0] via-[#fbcfe8] to-[#cbd5e1] border-b lg:border-r border-white/20 shadow-2xl z-50 overflow-hidden">
            <div className="flex flex-col items-center mb-6 lg:mb-12 hidden lg:flex">
            <div className="relative">
                <img src="/logoAdmin.png" alt="Logo" className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white/40 object-contain" />
                <span className="absolute -bottom-1 right-0 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full font-bold border border-white">ADMIN</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold italic text-slate-800 tracking-tighter" style={{ fontFamily: 'Comic Sans MS, cursive' }}>FeedYou</h2>
            </div>
            
            <nav className="flex flex-row lg:flex-col flex-nowrap space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-y-auto pr-2 pb-2 lg:pb-0 scrollbar-hide">
            {[
                { id: 'inicio', label: 'Inicio' },
                { id: 'usuarios', label: 'Gestión de Usuarios' },
                { id: 'moderacion', label: 'Moderación de Contenido' },
                { id: 'denuncias', label: 'Denuncias y Reportes' }
            ].map((item) => (
                <button key={item.id} onClick={() => setTabActual(item.id)}
                className={`whitespace-nowrap lg:w-full text-center lg:text-left px-4 lg:px-6 py-2 lg:py-3.5 rounded-xl lg:rounded-[20px] text-xs lg:text-sm transition-all duration-300 ${tabActual === item.id ? 'bg-white text-slate-900 shadow-md font-medium' : 'text-slate-600 hover:bg-white/30'}`}>
                {item.label}
                </button>
            ))}
            </nav>
        </aside>

        <main className="flex-1 overflow-y-auto relative bg-[#fcfcfd]">
            <div className="sticky top-0 z-40 bg-[#fcfcfd] px-4 lg:px-14 pt-6 lg:pt-10 pb-4">
            <header className="flex flex-col lg:flex-row justify-between items-center bg-white p-4 lg:p-6 rounded-2xl lg:rounded-[30px] border border-slate-100 shadow-lg gap-4">
                <div className="flex flex-col text-center lg:text-left">
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase mb-1">Panel Operativo</span>
                <h1 className="text-xl lg:text-2xl font-semibold text-slate-800 capitalize leading-none">{tabActual === 'inicio' ? 'Resumen General' : tabActual.replace('-', ' ')}</h1>
                </div>
                <div className="flex items-center gap-3 lg:gap-5">
                <div className="text-right leading-tight">
                    <p className="text-sm font-semibold text-slate-800">Administrador</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-indigo-100 overflow-hidden shadow-sm bg-slate-50 group">
                    <img 
                      src={`${API_URL}/uploads/perfiles/default.png`} 
                      alt="Perfil" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform bg-white" 
                      onError={(e) => { e.target.onerror = null; e.target.src = "/avatar-default.png"; }}
                    />
                </div>
                </div>
            </header>
            </div>

            <div className="px-4 lg:px-14 pb-20 relative z-0">
            
            {/* VISTA: INICIO (Con Gráficas) */}
            {tabActual === 'inicio' && (
                <div className="animate-in fade-in duration-700">
                {/* Cards de Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Usuarios Totales" value={usuarios.length} colorClass="text-indigo-500" />
                    <StatCard title="Baneados" value={usuarios.filter(u => u.estado === 'baneado').length} colorClass="text-slate-900" />
                    <StatCard title="Denuncias Activas" value={denuncias.filter(d => d.estado_denuncia === 'pendiente').length} colorClass="text-rose-500" />
                    <StatCard title="En Moderación" value={moderacion.length} colorClass="text-amber-500" />
                </div>

                {/* Sección de Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Gráfica de Crecimiento */}
                    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Crecimiento de Usuarios</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataRegistros}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                            <Line type="monotone" dataKey="cantidad" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                    </div>

                    {/* Gráfica de Categorías */}
                    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-50">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Categorías Populares</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataCategorias} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="categoria" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11}} width={90} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="total" radius={[0, 10, 10, 0]} barSize={18}>
                            {dataCategorias.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORES_GRAFICA[index % COLORES_GRAFICA.length]} />
                            ))}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                </div>
                </div>
            )}

            {/* VISTA: GESTIÓN DE USUARIOS */}
            {tabActual === 'usuarios' && (
                <div className="bg-white rounded-[40px] p-6 lg:p-10 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">Gestión de Cuentas</h2>
                    <div className="bg-slate-50 px-4 py-2 rounded-full text-xs text-slate-500 font-medium border border-slate-100">Total: {usuarios.length}</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-widest px-4">
                        <th className="pb-4 px-6">Estado</th>
                        <th className="pb-4 px-6">Nombre</th>
                        <th className="pb-4 px-6">Email</th>
                        <th className="pb-4 px-6 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                        <tr key={u.email} className="bg-slate-50/50 hover:bg-slate-100/50 transition-colors group rounded-2xl">
                            <td className="py-5 px-6 rounded-l-2xl">
                            <div className="flex items-center gap-3">
                                <StatusDot color={u.estado === 'baneado' ? 'baneado' : 'activo'} />
                                <span className={`text-[10px] font-bold uppercase ${u.estado === 'baneado' ? 'text-slate-900' : 'text-emerald-500'}`}>{u.estado}</span>
                            </div>
                            </td>
                            <td className="py-5 px-6 text-slate-700 font-medium">{u.nombre}</td>
                            <td className="py-5 px-6 text-slate-400 font-mono text-xs">{u.email}</td>
                            <td className="py-5 px-6 text-center rounded-r-2xl">
                            <button onClick={() => handleAccionUsuario(u.email, u.estado)} className={`px-6 py-2 rounded-full text-[10px] font-bold text-white uppercase shadow-sm active:scale-95 transition-transform ${u.estado === 'baneado' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-800 hover:bg-slate-900'}`}>
                                {u.estado === 'baneado' ? 'Activar' : 'Bloquear'}
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}

            {/* VISTA: DENUNCIAS */}
            {tabActual === 'denuncias' && (
                <div className="bg-white rounded-[40px] p-6 lg:p-10 border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-10">Denuncias Recibidas</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <th className="px-6 pb-4">Denunciante</th>
                        <th className="px-6 pb-4">Acusado</th>
                        <th className="px-6 pb-4">Motivo</th>
                        <th className="px-6 pb-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {denuncias.map((d) => (
                        <tr key={d.id_denuncia} className="bg-rose-50/30 hover:bg-rose-50/60 transition-colors rounded-2xl">
                            <td className="py-5 px-6 font-medium text-slate-700 rounded-l-2xl">{d.denunciante}</td>
                            <td className="py-5 px-6 text-rose-500 font-bold">{d.acusado}</td>
                            <td className="py-5 px-6 text-xs font-bold uppercase text-slate-600">{d.motivo}</td>
                            <td className="py-5 px-6 text-[10px] font-bold uppercase text-rose-600 rounded-r-2xl">{d.estado_denuncia}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}

            {/* VISTA: MODERACIÓN */}
            {tabActual === 'moderacion' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                {moderacion.map((item) => (
                    <div key={item.id_publicacion} className="bg-white rounded-[30px] overflow-hidden border border-slate-100 shadow-sm flex flex-col">
                    <div className="h-48 bg-slate-100 relative">
                        {item.imagen_url ? (
                        <img 
                            src={item.imagen_url.startsWith('http') ? item.imagen_url : `${API_URL}${item.imagen_url}`} 
                            className="w-full h-full object-cover" 
                            alt="Post reportado" 
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x200?text=Imagen+no+disponible"; }}
                        />
                        ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-xs p-4 italic text-center">
                            "{item.contenido || "Sin descripción"}"
                        </div>
                        )}
                        <div className="absolute top-4 left-4 bg-rose-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase shadow-lg z-10">
                        Motivo: {item.motivo}
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <p className="text-xs text-slate-400 mb-1">Autor: <span className="text-slate-800 font-bold">{item.autor}</span></p>
                        <p className="text-xs text-slate-500 line-clamp-2 italic mb-4">
                        {item.contenido ? `"${item.contenido}"` : "Sin texto descriptivo."}
                        </p>
                        <div className="flex gap-2 mt-auto">
                        <button onClick={() => handleEliminarPost(item.id_publicacion)} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase hover:bg-rose-600 transition-all active:scale-95">Eliminar Post</button>
                        <button onClick={() => handleDescartarDenuncia(item.id_denuncia)} className="flex-1 border border-slate-200 py-2.5 rounded-xl text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-50 transition-all active:scale-95">Descartar</button>
                        </div>
                    </div>
                    </div>
                ))}
                {moderacion.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No hay contenido pendiente de moderación 🎉</p>
                    </div>
                )}
                </div>
            )}

            </div>
        </main>
        </div>
    );
}