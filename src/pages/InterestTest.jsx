import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";

// Componente del logo
function Logo({ size = "md" }) {
  const sizes = { sm: 40, md: 60, lg: 90 };

  return (
    <div className="flex items-center justify-center">
      <img
        src="/logo.png"
        alt="FeedYou Logo"
        width={sizes[size]}
        height={sizes[size]}
      />
    </div>
  );
}

export default function InterestTest() {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  const questions = [
    {
      title: "¿Qué te interesa?",
      subtitle: "¿Cuál fue tu primera conexión con este universo?",
      options: [
        "Libros y novelas",
        "Cine y películas",
        "Series y TV",
        "Música y conciertos",
        "Videojuegos",
        "Moda y estilo",
      ],
    },
    {
      title: "¿Qué tipo de contenido prefieres?",
      subtitle: "Selecciona tus géneros favoritos (máximo 3)",
      options: [
        "Acción y Aventura",
        "Comedia",
        "Drama",
        "Ciencia Ficción",
        "Romance",
        "Terror y Suspenso",
        "Fantasía",
        "Documental",
      ],
    },
    {
      title: "¿Con qué frecuencia consumes contenido?",
      subtitle: "Esto nos ayuda a personalizar tu feed",
      options: [
        "Varias veces al día",
        "Una vez al día",
        "Varias veces a la semana",
        "Una vez a la semana",
        "Ocasionalmente",
      ],
    },
  ];

  const handleOptionSelect = (option) => {
    const currentQuestion = `question_${step}`;
    const currentAnswers = selectedInterests[currentQuestion] || [];

    if (step === 1) {
      if (currentAnswers.includes(option)) {
        setSelectedInterests({
          ...selectedInterests,
          [currentQuestion]: currentAnswers.filter((o) => o !== option),
        });
      } else {
        if (currentAnswers.length >= 3) {
          alert("Solo puedes seleccionar hasta 3 opciones.");
          return;
        }
        setSelectedInterests({
          ...selectedInterests,
          [currentQuestion]: [...currentAnswers, option],
        });
      }
    } else {
      setSelectedInterests({
        ...selectedInterests,
        [currentQuestion]: [option],
      });
    }
  };

  const handleNext = () => {
    const currentQuestion = `question_${step}`;
    const answers = selectedInterests[currentQuestion] || [];

    if (step === 1 && answers.length < 3) {
      alert("Por favor selecciona 3 opciones antes de continuar.");
      return;
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.email) {
        alert("No hay usuario logueado.");
        return;
      }

      const optionToIdsMap = {
        "Libros y novelas": { id_categoria: 1, id_subcategoria: 1 },
        "Cine y películas": { id_categoria: 1, id_subcategoria: 2 },
        "Series y TV": { id_categoria: 1, id_subcategoria: 3 },
        "Música y conciertos": { id_categoria: 1, id_subcategoria: 4 },
        "Videojuegos": { id_categoria: 2, id_subcategoria: 5 },
        "Moda y estilo": { id_categoria: 3, id_subcategoria: 6 },
      };

      const selectedMain = selectedInterests["question_0"] || [];

      const categories = selectedMain
        .map((option) => optionToIdsMap[option])
        .filter(Boolean);

      if (categories.length === 0) {
        alert("No se pudieron mapear las preferencias.");
        return;
      }

      await fetch("http://localhost:4000/api/feed/interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          categories: categories,
        }),
      });

      setShowLoading(true);
    } catch (error) {
      console.error("Error guardando intereses:", error);
    }
  };

  const handleGoToFeed = () => {
    navigate("/feed");
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleGoToFeed} />;
  }

  const currentAnswers = selectedInterests[`question_${step}`] || [];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/fondoFeedyou.png')" }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-6">
          Test de Intereses
        </h2>

        <div className="mb-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            {questions[step].title}
          </h3>
          <p className="text-gray-600 text-sm">
            {questions[step].subtitle}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {questions[step].options.map((option, idx) => {
            const isSelected = currentAnswers.includes(option);
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-5 py-3 rounded-lg border transition-all ${
                  isSelected
                    ? "border-blue-300 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-5 py-3 rounded-lg bg-gray-200"
          >
            <ChevronLeft className="w-5 h-5 inline" /> Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={currentAnswers.length === 0}
            className="flex-1 px-5 py-3 rounded-lg bg-purple-300"
          >
            {step === questions.length - 1 ? "Finalizar" : "Siguiente"}
            {step < questions.length - 1 && (
              <ChevronRight className="w-5 h-5 inline ml-2" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
