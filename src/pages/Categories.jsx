import Navbar from "../components/Navbar";

export default function Categories() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Categorías</h2>
        <p className="text-gray-600">
          Explora publicaciones por temas que te interesen.
        </p>
      </div>
    </div>
  );
}
