import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth} from "../context/AuthContext";
import "../App.css";

const API = import.meta.env.VITE_API_URL;

export default function InterestTest() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [subcategoriasSeleccionadas, setSubcategoriasSeleccionadas] = useState([]);
  const [tieneIntereses, setTieneIntereses] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
  if (!user) return;

  fetch(`${API}/api/test/preferencias/${user.email}`)
    .then(res => res.json())
    .then(data => {

      const categorias = [...new Set(data.map(p => p.id_categoria))];
      const subcategorias = data.map(p => p.id_subcategoria);

      setCategoriasSeleccionadas(categorias);
      setSubcategoriasSeleccionadas(subcategorias);

      setTieneIntereses(data.length > 0);
    });

}, [user]);


  // cargar categorias
  useEffect(() => {

    fetch(`${API}/api/categorias`)
      .then(res => res.json())
      .then(data => setCategorias(data));

  }, []);

  // cargar subcategorias segun categorias elegidas
useEffect(() => {

  if(categoriasSeleccionadas.length === 0) return;

  Promise.all(

    categoriasSeleccionadas.map(id =>
      fetch(`${API}/api/categorias/${id}/subcategorias`)
        .then(res => res.json())
        .then(subs =>
          subs.map(sub => ({
            id_subcategoria: sub.id,
            nombre_subcategoria: sub.nombre,
            id_categoria: id
          }))
        )
    )

  ).then(results => {

    const todas = results.flat();

    const unicas = Array.from(
      new Map(todas.map(s => [s.id_subcategoria, s])).values()
    );

    setSubcategorias(unicas);

  });

}, [categoriasSeleccionadas]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }


  function toggleCategoria(id){

    if(categoriasSeleccionadas.includes(id)){

      setCategoriasSeleccionadas(
        categoriasSeleccionadas.filter(c => c !== id)
      );

    }else{

      setCategoriasSeleccionadas([...categoriasSeleccionadas, id]);

    }

  }


  function toggleSubcategoria(id){

    if(subcategoriasSeleccionadas.includes(id)){

      setSubcategoriasSeleccionadas(
        subcategoriasSeleccionadas.filter(s => s !== id)
      );

    }else{

      setSubcategoriasSeleccionadas([...subcategoriasSeleccionadas, id]);

    }

  }


  async function guardar(){

    if (!user) {
      console.log("Usuario no encontrado");
      return;
    }

    const preferencias = subcategoriasSeleccionadas.map(id_subcategoria => {

      const sub = subcategorias.find(
        s => s.id_subcategoria === id_subcategoria
      );

      if (!sub) return null;

      return {

        email:user.email,
        id_categoria:sub.id_categoria,
        id_subcategoria

      };

    }).filter(Boolean);

    await fetch(`${API}/api/test/guardar-preferencias`,{

      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({

        email:user.email,
        preferencias

      })

    });

    navigate("/feed");

  }


  return (

    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{backgroundImage:"url('/fondoFeedyou.png')"}}
    >

      <div className="bg-[#ffffff] rounded-[28px] shadow-[0_10px_35px_rgba(0,0,0,0.25)] w-[90%] sm:w-[80%] md:w-[700px] py-10 px-6 sm:py-[60px] sm:px-[65px] relative overflow-hidden">
      
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-50 sm:opacity-100">
          <div className="absolute bottom-[-40px] left-[-40px] w-20 h-20 sm:w-40 sm:h-40 bg-blue-200 rounded-full "></div>
          <div className="absolute bottom-10 left-[20%] sm:left-32 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-200 rounded-full "></div>
          <div className="absolute bottom-0 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-purple-200 rounded-full "></div>
          <div className="absolute bottom-8 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-orange-200 rounded-full "></div>
      </div>

        {/* LOGO */}

        <img
          src="/logo.png"
          className="absolute top-4 sm:top-[30px] left-4 sm:left-[35px] w-8 sm:w-12"
        />

      {/* BOTÓN VOLVER */}
      {step === 1 ? (
        <button
          onClick={() => navigate("/register")}
          className="absolute top-4 sm:top-[30px] right-4 sm:right-[35px] bg-gray-200 p-1.5 sm:p-2 rounded-lg hover:bg-gray-300 z-20"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      ) : (
        <button
          onClick={() => setStep(1)}
          className="absolute top-4 sm:top-[30px] right-4 sm:right-[35px] bg-gray-200 p-1.5 sm:p-2 rounded-lg hover:bg-gray-300 z-20"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

        {/* TITULO */}

        <h1
          className="text-center text-3xl sm:text-[48px] font-extrabold mt-8 sm:mt-0 mb-4 sm:mb-6
          text-transparent bg-clip-text
          bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5]"
          style={{ fontFamily:"Comic Sans MS, cursive", lineHeight: 1.2 }}
        >
          ¿Qué te interesa?
        </h1>


        {/* PASO 1 */}

        {step === 1 && (

          <>

            <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-4 text-center text-sm sm:text-[15px] mb-4 sm:mb-6 w-full sm:w-[80%] mx-auto relative z-10 shadow-sm">

              Selecciona tus categorías favoritas

            </div>


            <div className="space-y-2.5 sm:space-y-4 max-w-[320px] mx-auto relative z-10">

              {categorias.map(cat => (

            <button
              key={cat.id}
              onClick={()=>toggleCategoria(cat.id)}
              className="flex items-center gap-3 text-left"
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center
                  ${categoriasSeleccionadas.includes(cat.id)
                    ? "border-purple-500"
                    : "border-gray-400"
                  }
                `}
              >
                {categoriasSeleccionadas.includes(cat.id) && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                )}
              </div>

              <span className="text-gray-800 text-sm sm:text-[15px]">
                {cat.nombre}
              </span>
            </button>

              ))}

            </div>


            {/* BOTONES */}

            <div className="flex justify-center mt-6 sm:mt-10 relative z-10">

              <button
                onClick={()=>setStep(2)}
                disabled={categoriasSeleccionadas.length === 0}
                className="flex items-center gap-2
                bg-gradient-to-r from-purple-400 to-pink-400 hover:opacity-100
                text-white px-8 py-2.5 sm:py-3 rounded-[10px] text-sm sm:text-base opacity-95 shadow-[0_5px_10px_rgba(0,0,0,0.2)]"
              >

                Siguiente
              </button>
            </div>
          </>
        )}


        {/* PASO 2 */}

        {step === 2 && (

          <>

            <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-4 text-sm sm:text-[15px] text-center mb-4 sm:mb-6 w-full sm:w-[80%] mx-auto relative z-10 shadow-sm">

              Selecciona tus subcategorías favoritas

            </div>


            <div className="space-y-2.5 sm:space-y-4 max-w-[500px] mx-auto max-h-[250px] sm:max-h-[320px] overflow-y-auto pr-4 relative z-10">

              {subcategorias.map(sub => (

                <button
                  key={sub.id_subcategoria}
                  onClick={()=>toggleSubcategoria(sub.id_subcategoria)}
                  className="flex items-center gap-3 text-left"
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center
                      ${subcategoriasSeleccionadas.includes(sub.id_subcategoria)
                        ? "border-purple-500"
                        : "border-gray-400"
                      }
                    `}
                  >
                    {subcategoriasSeleccionadas.includes(sub.id_subcategoria) && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </div>

                  <span className="text-gray-800 text-sm sm:text-[15px]">
                    {sub.nombre_subcategoria}
                  </span>

                </button>

              ))}

            </div>


            <div className="flex justify-center mt-6 sm:mt-10 relative z-10">

              <button
                onClick={guardar}
                disabled={subcategoriasSeleccionadas.length === 0}
                className="flex items-center gap-2
                bg-gradient-to-r from-purple-400 to-pink-400 hover:opacity-100
                text-white px-8 py-2.5 sm:py-3 rounded-[10px] text-sm sm:text-base
                disabled:opacity-85 shadow-[0_5px_10px_rgba(0,0,0,0.2)]"
              >

                {tieneIntereses ? "Actualizar intereses" : "Generar Feed"} <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />

              </button>

            </div>

          </>

        )}

      </div>

    </div>

  );

}
