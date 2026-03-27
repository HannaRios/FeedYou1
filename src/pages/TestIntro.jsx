import { useNavigate } from "react-router-dom";

export default function TestIntro() {

    const navigate = useNavigate();

    return (
        <div
          className="min-h-screen flex justify-center items-center bg-cover bg-center"
          style={{ backgroundImage: "url('fondoFeedyou.png')" }}
        >
          <div className="w-[90%] sm:w-[80%] md:w-[700px] bg-[#f5f5f5] rounded-[28px] py-10 px-6 sm:py-[60px] sm:px-[65px] text-center shadow-[0_10px_35px_rgba(0,0,0,0.25)] relative z-10">
            {/* Logo */}
            <img src="/logo.png" alt="FeedYou" className="block mx-auto w-[100px] sm:w-[140px] mb-4" />

            {/* Titulo */}
            <h1 className="text-3xl sm:text-[48px] font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#bfb3ff] via-[#f3b6ff] to-[#ffd6a5] font-['Comic_Sans_MS',cursive]" style={{ lineHeight: 1.2 }}>
              Test de intereses
            </h1>

            {/* Texto */}
            <p className="text-sm sm:text-[15px] leading-[1.6] text-[#222] font-[400] mb-[35px]">
              Responde unas breves preguntas y deja que FeedYou
              conozca tus gustos. Este test nos ayuda a personalizar tu
              experiencia, mostrándote solo el contenido que realmente te interesa.
              ¡Empieza y crea tu espacio único!
            </p>

            {/* Botón */}
            <button
              onClick={() => navigate("/interest-test")}
              className="bg-[#c7e3f1] hover:bg-[#a9d3e8] px-8 py-3 rounded-[10px] text-sm sm:text-base cursor-pointer shadow-[0_5px_10px_rgba(0,0,0,0.2)] transition-colors duration-200 font-semibold text-gray-800"
            >
              Continuar
            </button>
          </div>
        </div>
    );
}
