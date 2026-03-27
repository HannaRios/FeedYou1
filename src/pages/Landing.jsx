import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Instagram, Facebook, Youtube, Heart,
  Palette, Coffee, Music, BookOpen,
  Shirt, Clapperboard, Star, Bell, Share2,
  MessageCircle, Search, Image as ImageIcon
} from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

/* ===== LOGO COMPONENT ===== */
function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative w-12 h-12 lg:w-14 lg:h-14">
        <img
          src="/logo.png"
          alt="FeedYou Logo"
          className="w-full h-full object-contain drop-shadow-lg"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </Link>
  );
}

/* ===== FLOATING ICONS COMPONENT ===== */
const FloatingIcon = ({ icon: Icon, bg, color, delay, className, size = "w-12 h-12 md:w-14 md:h-14 text-white" }) => (
  <div
    className={`absolute rounded-2xl shadow-xl flex items-center justify-center ${size} ${bg} animate-floatSlow z-40 ${className}`}
    style={{ animationDelay: delay }}
  >
    {Icon && <Icon className={`w-6 h-6 md:w-7 md:h-7 ${color || 'text-white'}`} strokeWidth={2.5} />}
  </div>
);

const FloatingHeart = ({ sizeClass, delay, className }) => (
  <div
    className={`absolute animate-float text-[#FF4D5B] z-40 drop-shadow-lg ${className}`}
    style={{ animationDelay: delay }}
  >
    <Heart className={`${sizeClass} fill-current`} />
  </div>
);

const SliderPill = ({ colorClass, dotPos, className, delay }) => (
  <div
    className={`absolute h-10 w-36 md:h-12 md:w-44 rounded-full shadow-2xl flex items-center px-2 animate-floatSlow z-50 ${colorClass} ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className={`w-7 h-7 md:w-8 md:h-8 bg-white rounded-full shadow-md ${dotPos === 'right' ? 'ml-auto' : ''}`}></div>
  </div>
);

/* ===== LANDING PAGE MAIN ===== */
export default function FeedYouLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

      {/* ===== BACKGROUNDS ===== */}
      {/* Fondo Original Textura */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: "url('/fondoFeedyou.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      ></div>

      {/* CÍRCULO GIGANTE CUARTO DE BOLA (Corner-anchored Quarter Sphere) */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] lg:w-[1000px] lg:h-[1000px] rounded-full z-10 shadow-[-20px_0_60px_rgba(0,0,0,0.08)] pointer-events-none transform translate-x-[28%] -translate-y-[28%]"
        style={{
          background: 'radial-gradient(ellipse at 40% 40%, #E2FAFD 0%, #EEF5DF 60%, #FCF2DE 100%)',
        }}
      ></div>

      {/* ===== NAVBAR ===== */}
      <header className="relative w-full z-50 pt-8 px-6 lg:px-16 xl:px-24 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <Logo />
        </div>

        <div className="flex gap-4 lg:gap-6 pointer-events-auto">
          <Link to="/login">
            <button className="px-5 lg:px-6 py-2.5 rounded-xl bg-[#D6D8F0] border border-slate-300 text-gray-800 font-semibold text-sm hover:bg-[#c3c6e2] shadow-md transition-colors">
              Iniciar Sesión
            </button>
          </Link>
          <Link to="/register">
            <button className="px-5 lg:px-6 py-2.5 rounded-xl bg-[#FCFDFE] text-gray-800 font-semibold text-sm hover:bg-white shadow-md border border-slate-200 transition-colors">
              Crear Cuenta
            </button>
          </Link>
        </div>
      </header>

      {/* ===== HERO CONTENT ===== */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center relative z-20 px-6 lg:px-10 py-12 lg:py-4 min-h-[calc(100vh-90px)]">

        {/* === COLUMNA IZQUIERDA (Texto balanceado) === */}
        <div className="flex flex-col items-center text-center w-full lg:w-[50%] mb-16 lg:mb-0 animate-fadeInUp">
          <h2 className="text-base md:text-lg text-slate-100 font-serif mb-2 tracking-wide font-medium">Bienvenido a</h2>

          <h1
            className="text-5xl md:text-[5.5rem] font-bold mb-6 leading-none drop-shadow-xl"
            style={{
              background: 'linear-gradient(90deg, #DCEBFC 0%, #F1DDF3 50%, #FBE5CB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '2px white',
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              letterSpacing: '-1.5px'
            }}
          >
            FeedYou
          </h1>

          <p className="text-sm md:text-base leading-[1.8] text-gray-100/100 mb-8 max-w-[500px] mx-auto text-center">
            En FeedYou, el contenido se adapta a tus gustos desde el primer momento. 
            Música, cine, libros, moda o videojuegos: aquí ves solo lo que realmente te interesa. 
            Sin distracciones, sin contenido irrelevante.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="px-6 xl:px-8 py-3 rounded-[12px] bg-[#C1EBF3] text-gray-800 text-sm md:text-base font-semibold shadow-xl hover:bg-[#a5e1ed] transition-colors border border-cyan-100"
          >
            Comienza esta experiencia!
          </button>
        </div>

        {/* === COLUMNA DERECHA (Mockup centrado matemáticamente en la bola) === */}
        <div className="relative w-full lg:w-[50%] flex justify-center lg:justify-end xl:justify-center lg:pr-[5%] xl:pr-0 xl:pl-[15%] items-center animate-fadeIn" style={{ animationDelay: "0.4s" }}>

          <div className="relative w-[280px] h-[580px] z-30">

            {/* --- EL CELULAR (Mismo alto sin deformar) --- */}
            <div className="absolute inset-0 bg-[#313337] rounded-[3.5rem] p-[10px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-4 border-[#5E6061] overflow-hidden">
              <div className="relative bg-[#F9FAFF] rounded-[2.8rem] w-full h-full overflow-hidden flex flex-col text-slate-900 border border-slate-200">

                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                  <div className="w-[85px] h-[20px] bg-[#313337] rounded-b-[14px] relative">
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></div>
                  </div>
                </div>

                {/* Interior UI */}
                <div className="flex-1 flex flex-col pt-10 px-5">

                  {/* Top Header Icons */}
                  <div className="flex justify-between items-center mb-6">
                    <Search className="w-5 h-5 text-[#E6568B] stroke-[3]" />
                    <Bell className="w-5 h-5 text-orange-400 fill-orange-400" />
                  </div>

                  {/* Profile Chip */}
                  <div className="relative bg-[#FFF4E4] rounded-full flex items-center px-1.5 py-1.5 shadow-sm border border-orange-100 w-[60%] ml-4 mb-6">
                    <div className="absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-[#ECCC9E] text-slate-800 font-bold border-[2px] border-white text-[12px]">
                      C
                    </div>
                    <div className="absolute -left-4 bottom-[-4px] w-[14px] h-[14px] rounded-full bg-[#20E0EC] border-2 border-white flex items-center justify-center text-[8px] text-white font-black">+</div>
                    <span className="text-[11px] font-semibold text-slate-600 ml-6">@Cine25</span>
                  </div>

                  {/* Post Content */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-serif text-slate-800 mb-1 ml-1 font-medium">Estrenos de este mes</p>

                    {/* Media Collage Grid con bordes redondeados y separación */}
                    <div className="w-full h-[150px] bg-slate-200 rounded-[14px] overflow-hidden flex gap-[2px] shadow-sm relative z-0 border border-slate-100">
                      <div className="flex-1 bg-[#234B3C] flex flex-col justify-end p-1.5"><span className="text-[8px] font-bold text-white/95 leading-tight">THE WALKING<br />DEAD</span></div>
                      <div className="flex-1 bg-[#1A265B] flex flex-col justify-end p-1.5"><span className="text-[8px] font-bold text-white/95 leading-tight">HARRY<br />POTTER</span></div>
                      <div className="flex-1 bg-[#1E252D] flex flex-col justify-end p-1.5"><span className="text-[8px] font-bold text-white/95 leading-tight">TEEN<br />WOLF</span></div>

                      {/* Hovering slider OVER the images but INSIDE the phone */}
                      <div className="absolute -right-6 top-[20px] w-24 h-8 rounded-full bg-[#EAB564] shadow-md border-[2.5px] border-white flex items-center justify-end px-1.5 z-20">
                        {/* Decorative Yellow slider in mockup */}
                        <div className="w-4 h-4 rounded mt-1 border border-white flex flex-col gap-[2px] items-center justify-center opacity-70">
                          <div className="w-2.5 h-[1px] bg-white"></div>
                          <div className="w-2.5 h-[1px] bg-white"></div>
                        </div>
                        <div className="w-4 h-4 bg-transparent ml-2"></div>
                      </div>
                    </div>

                    {/* Like/Share Actions */}
                    <div className="flex items-center gap-4 mt-2 px-1">
                      <Heart className="w-[14px] h-[14px] text-[#FF495C] fill-[#FF495C]" />
                      <div className="w-4 h-3 bg-slate-300 rounded flex items-center justify-center"><MessageCircle className="w-2 h-2 text-white fill-white" /></div>
                      <Share2 className="w-[12px] h-[12px] text-slate-400" />
                      <div className="flex-1"></div>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* Internal Bottom Bar */}
                <div className="absolute bottom-6 w-[80%] left-[10%] bg-white h-[4rem] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] flex justify-between items-center px-6 z-40 border border-slate-50">
                  <div className="w-6 h-6 bg-transparent" />
                  {/* Plus Button Central */}
                  <div className="w-10 h-10 rounded-full bg-[#20E0EC] flex items-center justify-center text-white text-2xl font-light shadow-md absolute left-1/2 -translate-x-1/2 pb-1">+</div>
                  {/* Robot/User Icon Right */}
                  <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden flex items-center justify-center bg-white">
                    <div className="w-[16px] h-[16px] bg-[#20E0EC] rounded-[4px] flex items-center justify-center"><span className="text-white text-[8px] font-bold">U</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- EXACT FLOATING ELEMENTS AROUND -- WELL SPACED --- */}

            {/* Top Left Cluster */}
            <div className="absolute -left-[30px] lg:-left-[50px] top-[10px] w-12 h-12 bg-[#4CF0E8] rounded-full z-20 shadow-md"></div>
            <FloatingIcon bg="bg-[#FFD147]" icon={MessageCircle} color="text-white" size="w-10 h-10 lg:w-12 lg:h-12 text-white" className="-left-2 lg:-left-4 top-[25px]" delay="0.5s" />
            <div className="absolute -left-6 top-[-10px] w-2.5 h-2.5 bg-pink-500 rounded-full z-40"></div>
            <div className="absolute left-[20px] top-[-15px] w-3 h-3 bg-pink-500 rounded-full z-40"></div>
            <div className="absolute left-[70px] top-[-5px] w-3 h-3 bg-red-400 rounded-full z-40"></div>

            {/* Icons Right Side */}
            <FloatingIcon bg="bg-[#F2A9AD]" icon={Palette} className="-right-[30px] lg:-right-[40px] top-[20px]" delay="1s" />
            <FloatingIcon bg="bg-[#6B57A2]" icon={Shirt} className="-right-[40px] lg:-right-[60px] top-[140px] text-white" delay="0.8s" />
            <div className="absolute -right-[40px] lg:-right-[60px] top-[280px] w-10 h-10 font-serif font-black text-white rounded-[12px] bg-[#EEB867] shadow-xl flex items-center justify-center z-50 animate-floatSlow" style={{ animationDelay: '1.6s' }}>Y</div>
            <FloatingIcon bg="bg-[#F5A272]" icon={BookOpen} size="w-10 h-10 lg:w-12 lg:h-12 text-white" className="-right-[50px] lg:-right-[70px] top-[340px]" delay="0.3s" />

            {/* Icons Left Side */}
            <FloatingIcon bg="bg-[#9F7A69]" icon={Coffee} className="-left-[50px] lg:-left-[70px] top-[150px] text-white" delay="1.2s" size="w-10 h-10 lg:w-12 lg:h-12" />
            <FloatingIcon bg="bg-[#D2BAF4]" icon={Music} className="-left-[40px] lg:-left-[50px] top-[250px] text-white z-50" delay="2.1s" size="w-10 h-10 lg:w-12 lg:h-12" />
            <div className="absolute -left-[60px] lg:-left-[80px] top-[370px] bg-[#89BAEC] w-10 h-10 rounded-[14px] flex items-center justify-center shadow-lg animate-floatSlow z-10" style={{ animationDelay: '1.5s' }}>
              <ImageIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <FloatingIcon bg="bg-[#81E885]" icon={Clapperboard} className="-left-[30px] lg:-left-[40px] bottom-[100px] text-white z-50" size="w-10 h-10 lg:w-12 lg:h-12" delay="2.4s" />

            {/* Pink Slider Left OVERLAP */}
            <div className="absolute -left-[50px] lg:-left-[80px] bottom-[230px] w-36 h-12 rounded-full shadow-[0_10px_20px_rgba(255,100,140,0.3)] flex items-center px-1.5 animate-floatSlow z-50 bg-[#FF8EAC] border-[3px] border-white/10" style={{ animationDelay: "1.4s" }}>
              <div className="w-8 h-8 bg-white rounded-full shadow-sm ml-auto"></div>
            </div>

            {/* Cyan Slider Right OVERLAP */}
            <div className="absolute -right-[30px] lg:-right-[50px] top-[180px] w-40 h-12 rounded-full shadow-[0_10px_20px_rgba(30,220,240,0.3)] flex items-center px-1.5 animate-floatSlow z-50 bg-gradient-to-r from-[#20E0EC] to-[#4BEAF3] border-[3px] border-white/10" style={{ animationDelay: "0.6s" }}>
              <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
            </div>

            {/* Floating Hearts Array (Bottom Right) */}
            <FloatingHeart sizeClass="w-5 h-5 lg:w-6 lg:h-6" delay="0s" className="-right-[10px] lg:-right-[20px] bottom-[230px]" />
            <FloatingHeart sizeClass="w-7 h-7 lg:w-9 lg:h-9" delay="1s" className="right-[10px] lg:right-[30px] bottom-[160px]" />
            <FloatingHeart sizeClass="w-14 h-14 lg:w-16 lg:h-16" delay="2s" className="-right-[20px] lg:-right-[30px] bottom-[80px]" />

          </div>
        </div>
      </main>

      {/* ===== EXACT REPLICA FOOTER ===== */}
      <footer className="relative w-full z-20 font-serif border-t border-gray-600/30 pb-16 pt-12" style={{ backgroundColor: '#2b2c2f', color: '#B9BABB' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-[15px] leading-[1.8]">

          {/* Logo & Social Links */}
          <div className="flex flex-col gap-6">
                    <div className="relative w-12 h-12 lg:w-14 lg:h-14">
                      <img
                        src="/logo.png"
                        alt="FeedYou Logo"
                        className="w-full h-full object-contain drop-shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>


            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/feedyou_hvn?igsh=bWpiYWJ2NmJrMTZk&utm_source=ig_contact_invite" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer transition-colors" />
              </a>

              <a href="https://www.facebook.com/profile.php?id=61577519739122" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>

              <a href="https://www.tiktok.com/@feedyou_use?_r=1&_t=ZS-951nYV9LvwS" target="_blank" rel="noopener noreferrer">
                <SiTiktok className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-white mb-6 tracking-wide text-base">contenido de FeedYou</h3>
            <ul className="space-y-1">
              <li className="hover:text-white cursor-pointer transition-colors">Para ti</li>
              <li className="hover:text-white cursor-pointer transition-colors">Seguidos</li>
              <li className="hover:text-white cursor-pointer transition-colors">Tendencias</li>
              <li className="hover:text-white cursor-pointer transition-colors">Favoritos</li>
              <li className="hover:text-white cursor-pointer transition-colors">Categorías</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="pr-4">
            <h3 className="font-bold text-white mb-6 tracking-wide text-base">Sobre FeedYou</h3>
            <p className="mb-6">El lugar donde el contenido esta hecho a tu medida.</p>
            <p>Creamos experiencias únicas basadas en tus gustos, intereses y estilo de vida.</p>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-white mb-6 tracking-wide text-base">Legal</h3>
            <ul className="space-y-4">
              <li className="hover:text-white cursor-pointer transition-colors">Términos y condiciones.</li>
              <li className="hover:text-white cursor-pointer transition-colors">Política de privacidad.</li>
              <li className="hover:text-white cursor-pointer transition-colors">Preferencias de cookies.</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Footer (Aligned like Mockup) */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 text-sm grid grid-cols-3 items-center">
          <div className="text-left">
            <span className="hover:text-white cursor-pointer">Español | English</span>
          </div>
          <div className="text-center md:pl-8">
            <p>Derechos de autor © 2025<br />FeedYou</p>
          </div>
          <div className="text-right">
            <span className="hover:text-white cursor-pointer">Accesibilidad</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
