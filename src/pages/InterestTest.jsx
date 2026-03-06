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

      <div className="bg-[#ffffff] rounded-[30px] shadow-[0_10px_35px_rgba(0,0,0,0.25)] w-[800px] p-12 relative overflow-hidden">
      
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-blue-200 rounded-full "></div>
          <div className="absolute bottom-10 left-32 w-16 h-16 bg-yellow-200 rounded-full "></div>
          <div className="absolute bottom-0 right-10 w-20 h-20 bg-purple-200 rounded-full "></div>
          <div className="absolute bottom-8 right-0 w-24 h-24 bg-orange-200 rounded-full "></div>
      </div>

        {/* LOGO */}

        <img
          src="/logo.png"
          className="absolute top-7 left-7 w-12"
        />

      {/* BOTÓN VOLVER */}
      {step === 1 ? (
        <button
          onClick={() => navigate("/register")}
          className="absolute top-7 right-7 bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
        >
          <ChevronLeft />
        </button>
      ) : (
        <button
          onClick={() => setStep(1)}
          className="absolute top-7 right-7 bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
        >
          <ChevronLeft />
        </button>
      )}

        {/* TITULO */}

        <h1
          className="text-center text-5xl font-extrabold mb-6
          text-transparent bg-clip-text
          bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5]"
          style={{ fontFamily:"Comic Sans MS, cursive" }}
        >
          ¿Qué te interesa?
        </h1>


        {/* PASO 1 */}

        {step === 1 && (

          <>

            <div className="bg-white border border-gray-400 rounded-lg p-4 text-center mb-8 w-[80%] mx-auto">

              Selecciona tus categorías favoritas

            </div>


            <div className="space-y-4 max-w-[320px] mx-auto">

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

              <span className="text-gray-800">
                {cat.nombre}
              </span>
            </button>

              ))}

            </div>


            {/* BOTONES */}

            <div className="flex justify-center mt-10">

              <button
                onClick={()=>setStep(2)}
                disabled={categoriasSeleccionadas.length === 0}
                className="flex items-center gap-2
                bg-gradient-to-r from-purple-400 to-pink-400
                text-white px-6 py-3 rounded-lg opacity-95"
              >

                Siguiente
              </button>
            </div>
          </>
        )}


        {/* PASO 2 */}

        {step === 2 && (

          <>

            <div className="border rounded-xl p-4 text-center mb-6">

              Selecciona tus subcategorías favoritas

            </div>


            <div className="space-y-4 max-w-[500px] mx-auto max-h-[320px] overflow-y-auto pr-4">

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

                  <span className="text-gray-800">
                    {sub.nombre_subcategoria}
                  </span>

                </button>

              ))}

            </div>


            <div className="flex justify-center mt-10">

              <button
                onClick={guardar}
                disabled={subcategoriasSeleccionadas.length === 0}
                className="flex items-center gap-2
                bg-gradient-to-r from-purple-400 to-pink-400
                text-white px-6 py-3 rounded-lg
                disabled:opacity-85"
              >

                {tieneIntereses ? "Actualizar intereses" : "Generar Feed"} <ChevronRight/>

              </button>

            </div>

          </>

        )}

      </div>

    </div>

  );

}
