import Navbar from "../components/Navbar";

export default function Trending() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Tendencias</h2>
        <p className="text-gray-600">
          Aquí se mostrarán las publicaciones más populares del momento.
        </p>
      </div>
    </div>
  );
}
