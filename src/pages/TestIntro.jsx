import { useNavigate } from "react-router-dom";

export default function TestIntro() {

    const navigate = useNavigate();

    return (
        <div
        style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: "url('fondoFeedyou.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        <div
            style={{
            width: "700px",
            background: "#f5f5f5",
            borderRadius: "28px",
            padding: "60px 65px",
            textAlign: "center",
            boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
            }}
        >

            {/* Logo */}
            <img
            src="/logo.png"
            alt="FeedYou"
            style={{
                display: "block",
                margin: "0 auto",
                width: "140px",
                marginBottom: "15px",
                
            }}
            />

            {/* Titulo */}
            <h1
            style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "10px",
                background: "linear-gradient(90deg, #bfb3ff, #f3b6ff, #ffd6a5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "Comic Sans MS, cursive",
            }}
            >
            Test de intereses
            </h1>

            {/* Texto */}
            <p
            style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#555",
                marginBottom: "35px",
                color: "#222",   // más negro
                fontWeight: "400", // hace que se vea más grueso (semi-negrilla)
            }}
            >
            Responde unas breves preguntas y deja que FeedYou
            conozca tus gustos. Este test nos ayuda a personalizar tu
            experiencia, mostrándote solo el contenido que realmente te interesa.
            ¡Empieza y crea tu espacio único!
            </p>

            {/* Botón */}
            <button
            onClick={() => navigate("/interest-test")}
            style={{
                background: "#c7e3f1",
                border: "none",
                padding: "12px 40px",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
                transition: "0.2s",
            }}
            onMouseOver={(e) =>
                (e.target.style.background = "#a9d3e8")
            }
            onMouseOut={(e) =>
                (e.target.style.background = "#c7e3f1")
            }
            >
            Continuar
            </button>

        </div>
        </div>
    );
}
