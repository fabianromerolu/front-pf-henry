"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-custume-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-custume-red taviraj mb-4 lowercase">
            contacto
          </h1>
          <p className="text-custume-gray montserrat text-xl max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ti.
            Contáctanos y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
              <h2 className="text-3xl font-bold text-custume-blue taviraj mb-6 lowercase">
                nuestras sedes
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-custume-blue pl-6">
                  <h3 className="text-2xl font-bold text-custume-blue taviraj mb-2 lowercase">
                    ciudad de méxico
                  </h3>
                  <div className="space-y-2 text-custume-gray montserrat">
                    <p className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 mt-1 flex-shrink-0 text-custume-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Av. Paseo de la Reforma 222, Juárez, Cuauhtémoc, 06600
                      Ciudad de México, CDMX
                    </p>
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0 text-custume-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +52 55 1234 5678
                    </p>
                  </div>
                </div>

                <div className="border-l-4 border-light-blue pl-6">
                  <h3 className="text-2xl font-bold text-custume-blue taviraj mb-2 lowercase">
                    guadalajara
                  </h3>
                  <div className="space-y-2 text-custume-gray montserrat">
                    <p className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 mt-1 flex-shrink-0 text-custume-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Av. Américas 1500, Colón Industrial, 44940 Guadalajara,
                      Jalisco
                    </p>
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0 text-custume-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +52 33 8765 4321
                    </p>
                  </div>
                </div>

                <div className="border-l-4 border-light-blue pl-6">
                  <h3 className="text-2xl font-bold text-custume-blue taviraj mb-2 lowercase">
                    monterrey
                  </h3>
                  <div className="space-y-2 text-custume-gray montserrat">
                    <p className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 mt-1 flex-shrink-0 text-custume-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Av. Constitución 2001, Valle del Campestre, 66265 San
                      Pedro Garza García, N.L.
                    </p>
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0 text-custume-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      +52 81 2468 1357
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-custume-blue taviraj mb-6 lowercase">
                información general
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-light-blue/30 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-custume-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-custume-blue montserrat">
                      Correo electrónico
                    </p>
                    <a
                      href="mailto:contacto@volantia.com"
                      className="text-custume-gray montserrat hover:text-custume-blue transition-colors"
                    >
                      contacto@volantia.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-light-blue/30 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-custume-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-custume-blue montserrat">
                      Atención al cliente
                    </p>
                    <p className="text-custume-gray montserrat">
                      +52 800 123 4567
                    </p>
                    <p className="text-sm text-custume-gray montserrat">
                      Lun - Vie: 9:00 AM - 7:00 PM
                    </p>
                    <p className="text-sm text-custume-gray montserrat">
                      Sáb: 9:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-light-blue/30 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-custume-blue"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-custume-blue montserrat">
                      Soporte técnico
                    </p>
                    <a
                      href="mailto:soporte@volantia.com"
                      className="text-custume-gray montserrat hover:text-custume-blue transition-colors"
                    >
                      soporte@volantia.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-custume-blue taviraj mb-6 lowercase">
                síguenos
              </h2>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-light-blue/30 p-4 rounded-full hover:bg-custume-blue hover:text-white transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-light-blue/30 p-4 rounded-full hover:bg-custume-blue hover:text-white transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-light-blue/30 p-4 rounded-full hover:bg-custume-blue hover:text-white transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
