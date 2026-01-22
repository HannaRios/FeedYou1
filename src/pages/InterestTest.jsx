import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen'; 

// Componente del logo
function Logo({ size = 'md' }) {
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

// Componente principal del test
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
        "Moda y estilo"
      ]
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
        "Documental"
      ]
    },
    {
      title: "¿Con qué frecuencia consumes contenido?",
      subtitle: "Esto nos ayuda a personalizar tu feed",
      options: [
        "Varias veces al día",
        "Una vez al día",
        "Varias veces a la semana",
        "Una vez a la semana",
        "Ocasionalmente"
      ]
    }
  ];

  const handleOptionSelect = (option) => {
    const currentQuestion = `question_${step}`;
    const currentAnswers = selectedInterests[currentQuestion] || [];

    if (step === 1) {
      // Máximo 3 opciones
      if (currentAnswers.includes(option)) {
        setSelectedInterests({
          ...selectedInterests,
          [currentQuestion]: currentAnswers.filter(o => o !== option)
        });
      } else {
        if (currentAnswers.length >= 3) {
          alert("Solo puedes seleccionar hasta 3 opciones.");
          return;
        }
        setSelectedInterests({
          ...selectedInterests,
          [currentQuestion]: [...currentAnswers, option]
        });
      }
    } else {
      setSelectedInterests({
        ...selectedInterests,
        [currentQuestion]: [option]
      });
    }
  };

  // Navegar entre pasos
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

  // Finalizar test
  const handleFinish = () => {
    setShowLoading(true);
  };

  const handleGoToFeed = () => {
    navigate('/feed', { state: { testAnswers: selectedInterests } });
  };

  // Mostrar pantalla de carga
  if (showLoading) {
    return <LoadingScreen onComplete={handleGoToFeed} />;
  }

  const currentAnswers = selectedInterests[`question_${step}`] || [];

  // Render principal
  return (
      <div
    className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6"
    style={{ backgroundImage: "url('/fondoFeedyou.png')" }}>
      
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        <h2
          className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-6"
          style={{ fontFamily: 'Comic Sans MS, cursive' }}
        >
          Test de Intereses
        </h2>

        <div className="mb-6 text-center">
          <h3
            className="text-2xl font-semibold text-gray-800 mb-2"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            {questions[step].title}
          </h3>
          <p className="text-gray-600 text-sm">{questions[step].subtitle}</p>
        </div>

        {/* Opciones */}
        <div className="space-y-3 mb-8">
          {questions[step].options.map((option, idx) => {
            const isSelected = currentAnswers.includes(option);
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-5 py-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-400 bg-blue-400' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {step + 1} de {questions.length}</span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition ${
              step === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" /> Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={currentAnswers.length === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition ${
              currentAnswers.length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] text-gray-800 hover:opacity-90'
            }`}
          >
            {step === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
            {step < questions.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
