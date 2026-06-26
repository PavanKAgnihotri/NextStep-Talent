export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Explore the World with NextTalent
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          Discover breathtaking destinations and create unforgettable memories
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
          Start Exploring
        </button>
      </div>
    </section>
  );
}
