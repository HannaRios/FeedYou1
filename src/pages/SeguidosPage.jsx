import Navbar from "../components/Navbar";

export default function SeguidosPage() {
    return (
        <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex justify-center py-24">
            <div className="text-center max-w-md">
            <div className="text-5xl mb-4">👥</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                Seguidos
            </h2>
            <p className="text-gray-600">
                Aquí verás publicaciones de las personas que sigues.
                <br />
                <span className="text-sm text-gray-400">
                (Próximamente)
                </span>
            </p>
            </div>
        </div>
        </div>
    );
    }
