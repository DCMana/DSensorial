// --- "Universo Sensorial Infantil" - Script Principal ---
// Este archivo contiene la lógica JavaScript que controla la interactividad,
// carga de contenido dinámico (como las actividades del simulador) y
// añade funcionalidades de accesibilidad y usabilidad a la web.

// Variables globales para elementos de audio.
// Se inicializan en la función DOMContentLoaded para asegurar que existen en el DOM.
let sonidoExito;
let sonidoClick;
let sonidoHover;

// Variable para almacenar el elemento que tenía el foco antes de abrir un modal.
// Esto es crucial para devolver el foco correctamente al cerrar el modal,
// mejorando la accesibilidad para usuarios de teclado y lectores de pantalla.
let lastFocusedElement;

// --- DATOS EDUCATIVOS ---
// Estas estructuras de datos almacenan la información sobre los principios de Gestalt
// y las actividades de estimulación sensorial por rango de edad.
// Están diseñadas para ser fácilmente extensibles y legibles.

/**
 * Objeto que contiene la información detallada sobre los Principios de la Psicología de la Gestalt.
 * Cada clave es un identificador único para un principio, y el valor es un objeto con:
 * - nombre: El nombre del principio.
 * - explicacion: Una descripción detallada y aplicación en la infancia.
 * - imagen: La ruta al archivo de imagen que ilustra el principio.
 */
const gestaltInfo = {
    "figura-fondo": {
        nombre: "Relación Figura-Fondo",
        explicacion: "Nuestra percepción organiza espontáneamente el campo visual en una 'figura' que destaca y un 'fondo' más difuso que la rodea. Este es uno de los primeros procesos organizativos de la percepción visual. En los niños, la capacidad de discriminar figura-fondo es esencial para tareas como encontrar un juguete específico en una caja llena o identificar letras en una palabra.",
        imagen: "assets/gestalt_figura_fondo.png" // Asegúrate de que esta ruta sea correcta y el archivo exista
    },
    "proximidad": {
        nombre: "Principio de Proximidad",
        explicacion: "Tendemos a agrupar perceptualmente los elementos que están físicamente cercanos entre sí como si formaran una unidad. Para un niño, esto ayuda a ver grupos de objetos (ej. 'tres bloques juntos') en lugar de elementos aislados.",
        imagen: "assets/gestalt_proximidad.png" // Asegúrate de que esta ruta sea correcta y el archivo exista
    },
    "similitud": {
        nombre: "Principio de Similitud",
        explicacion: "Agrupamos los elementos que son similares en características como forma, tamaño, color o textura. Un niño podría agrupar todos los bloques rojos, independientemente de su forma, gracias a este principio.",
        imagen: "assets/gestalt_similitud.png" // Asegúrate de que esta ruta sea correcta y el archivo exista
    },
    "continuidad": {
        nombre: "Principio de Continuidad (o Buena Continuación)",
        explicacion: "Los estímulos que guardan una continuidad de forma, dirección o patrón tienden a ser percibidos como una unidad, incluso si están interrumpidos. Esto ayuda a los niños a seguir líneas o caminos visuales, como el trazo de una letra o el contorno de un dibujo.",
        imagen: "assets/gestalt_continuidad.png" // Asegúrate de que esta ruta sea correcta y el archivo exista
    },
    "simplicidad": {
        nombre: "Principio de Simplicidad (Prägnanz o Buena Forma)",
        explicacion: "Organizamos los campos perceptuales con los rasgos más simples, regulares, simétricos y estables posibles. Nuestra mente prefiere la interpretación más 'económica' y ordenada. Los niños tienden a simplificar formas complejas para entenderlas mejor.",
        imagen: "assets/gestalt_simplicidad.png" // Asegúrate de que esta ruta sea correcta y el archivo exista
    },
    "cierre": {
        nombre: "Principio de Cierre",
        explicacion: "Nuestra mente tiende a completar las figuras incompletas o fragmentadas para darles sentido y percibirlas como totalidades. Un niño puede reconocer un dibujo de un animal aunque falten algunas líneas, gracias a este principio.",
        imagen: "assets/gestalt_cierre.png" // Asegúrate de que esta ruta sea correcta y el archivo exista
    }
};

/**
 * Objeto que mapea rangos de edad a listas de actividades de estimulación sensorial.
 * Cada rango de edad contiene un array de objetos, cada uno describiendo una actividad con:
 * - nombre: El nombre de la actividad.
 * - sentidos: Un array de strings con los sentidos principales que estimula.
 * - desarrollo: Una descripción de las áreas de desarrollo que fomenta.
 */
const actividadesSensorialesPorEdad = {
    // Se han detallado más las etapas y añadido sentidos propioceptivo/vestibular
    "0-3m": [
        { nombre: "Móviles de alto contraste (blanco/negro) y seguimiento lento", sentidos: ["Vista"], desarrollo: "Fijación visual, seguimiento, detección de contraste" },
        { nombre: "Masajes suaves y contacto piel con piel", sentidos: ["Tacto", "Propiocepción"], desarrollo: "Vínculo, conciencia corporal, relajación" },
        { nombre: "Hablar y cantar suavemente cerca del bebé", sentidos: ["Oído"], desarrollo: "Reconocimiento de voz, calma, inicio de discriminación auditiva" },
        { nombre: "Mecer suavemente en brazos o cuna", sentidos: ["Vestibular"], desarrollo: "Regulación, calma, estimulación del equilibrio" },
        { nombre: "Olores suaves y familiares (leche materna, olor de la madre)", sentidos: ["Olfato"], desarrollo: "Reconocimiento, seguridad" }
        // Asegúrate de que los olores sean seguros y no aplicados directamente al bebé.
    ],
    "4-6m": [
        { nombre: "Juguetes de texturas variadas para agarrar y llevar a la boca (seguros)", sentidos: ["Tacto", "Gusto", "Propiocepción"], desarrollo: "Exploración oral y manual, coordinación ojo-mano-boca" },
        { nombre: "Sonajeros y juguetes que emiten sonidos al moverse", sentidos: ["Oído", "Propiocepción"], desarrollo: "Causa-efecto auditivo-motor, localización de sonido" },
        { nombre: "Libros de tela con colores vivos, espejos irrompibles y solapas", sentidos: ["Vista", "Tacto"], desarrollo: "Discriminación visual, auto-reconocimiento" },
        { nombre: "Tiempo boca abajo sobre diferentes texturas (alfombra, manta suave)", sentidos: ["Tacto", "Propiocepción", "Vestibular"], desarrollo: "Fortalecimiento cuello/espalda, integración sensorial" },
        { nombre: "Introducción gradual de purés de frutas/verduras (un sabor a la vez)", sentidos: ["Gusto", "Olfato"], desarrollo: "Exploración de nuevos sabores y olores" }
        // Siempre supervisar la exploración oral de objetos.
    ],
    "7-12m": [
        { nombre: "Bloques de construcción grandes y encajables simples", sentidos: ["Vista", "Tacto", "Propiocepción"], desarrollo: "Coordinación ojo-mano, planificación motora fina" },
        { nombre: "Gatear sobre diferentes superficies (parqué, alfombra, césped seguro)", sentidos: ["Tacto", "Propiocepción", "Vestibular"], desarrollo: "Exploración espacial, integración bilateral" },
        { nombre: "Juegos de 'cucú-tras' (peek-a-boo)", sentidos: ["Vista", "Oído"], desarrollo: "Permanencia del objeto, interacción social" },
        { nombre: "Instrumentos musicales sencillos (maracas, tambor pequeño)", sentidos: ["Oído", "Tacto", "Propiocepción"], desarrollo: "Ritmo, causa-efecto, expresión" },
        { nombre: "Explorar alimentos con las manos (BLW o trozos seguros)", sentidos: ["Tacto", "Gusto", "Olfato", "Propiocepción"], desarrollo: "Autonomía, texturas, motricidad fina" }
        // Asegurarse de que los trozos de comida sean seguros para la edad.
    ],
    "13-18m": [ // 1-1.5 años
        { nombre: "Pintura de dedos comestible o plastilina casera (supervisado)", sentidos: ["Tacto", "Vista", "Olfato", "Propiocepción"], desarrollo: "Creatividad, motricidad fina, exploración de texturas" },
        { nombre: "Caminar y correr en entornos seguros (empujar un carrito)", sentidos: ["Vestibular", "Propiocepción", "Vista"], desarrollo: "Equilibrio, coordinación motora gruesa" },
        { nombre: "Libros con imágenes más detalladas, nombrar objetos", sentidos: ["Vista", "Oído"], desarrollo: "Vocabulario, atención conjunta" },
        { nombre: "Cajas sensoriales con elementos seguros (pasta seca, arroz, pompones)", sentidos: ["Tacto", "Vista", "Propiocepción"], desarrollo: "Discriminación táctil, juego simbólico" }
        // Supervisión constante para evitar que se lleven objetos pequeños a la boca.
    ],
    "19-24m": [ // 1.5-2 años
        { nombre: "Circuitos de obstáculos simples (cojines, túneles de tela)", sentidos: ["Vestibular", "Propiocepción", "Tacto", "Vista"], desarrollo: "Planificación motora, conciencia espacial, equilibrio" },
        { nombre: "Juegos de imitación con sonidos y gestos", sentidos: ["Oído", "Vista", "Propiocepción"], desarrollo: "Lenguaje, habilidades sociales, esquema corporal" },
        { nombre: "Reconocer objetos por el tacto en una bolsa misteriosa", sentidos: ["Tacto", "Estereognosia"], desarrollo: "Percepción táctil sin ayuda visual" },
        { nombre: "Juegos con agua y arena (trasvases, moldes) supervisado", sentidos: ["Tacto", "Vista", "Propiocepción"], desarrollo: "Conceptos de volumen, texturas, creatividad" }
        // Entornos seguros y limpios para el juego con materiales.
    ],
    "25-36m": [ // 2-3 años
        { nombre: "Construcciones más complejas con bloques, puzles sencillos", sentidos: ["Vista", "Tacto", "Propiocepción"], desarrollo: "Resolución de problemas, motricidad fina avanzada" },
        { nombre: "Juegos de roles y simbólicos (cocinita, disfraces)", sentidos: ["Todos los sentidos integrados"], desarrollo: "Imaginación, lenguaje, habilidades sociales" },
        { nombre: "Identificar olores en botes (frutas, especias suaves, flores seguras)", sentidos: ["Olfato"], desarrollo: "Discriminación olfativa, vocabulario asociado" },
        { nombre: "Actividades de movimiento rítmico (bailar, saltar a la pata coja)", sentidos: ["Vestibular", "Propiocepción", "Oído"], desarrollo: "Coordinación, ritmo, lateralidad" }
        // Adaptar la dificultad de los juegos y asegurar la seguridad en actividades físicas.
    ]
};

// Variable para almacenar los datos de la última simulación realizada.
// Se utiliza para la funcionalidad de exportar a CSV.
let simulacionSensorialActual = {};

// --- INICIALIZACIÓN GENERAL ---
// Espera a que el DOM (la estructura HTML) esté completamente cargado
// antes de intentar acceder a los elementos y configurar los listeners.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Universo Sensorial Infantil: Documento cargado y scripts listos.");

    // Inicializar elementos de audio con manejo de errores
    // Se asume que estos elementos <audio> existen en el HTML con los IDs especificados.
    try {
        sonidoExito = document.getElementById('sonidoExito');
        sonidoClick = document.getElementById('sonidoClick');
        sonidoHover = document.getElementById('sonidoHover');
        // Intentar cargar los audios para una respuesta más rápida al interactuar.
        [sonidoExito, sonidoClick, sonidoHover].forEach(sound => sound && sound.load());
    } catch (e) {
        console.error("Error inicializando elementos de audio:", e);
        // La app continuará funcionando sin sonidos si hay un error.
    }

    // Configurar las diferentes partes interactivas de la página.
    setupMenuHamburguesa();
    setupSmoothScrolling();
    setupModales(); // Configura la lógica para abrir/cerrar modales
    setupAcordeones(); // Configura el comportamiento de los acordeones.
    setupSonidosUI(); // Añade sonidos a botones y tarjetas
    setupSimuladorSensorial(); // Configura el simulador, incluyendo la carga inicial de actividades.
    setupScrollAnimations(); // Configura las animaciones de entrada de secciones al hacer scroll.
    setActiveLinkScroll(); // Actualiza el enlace activo en el menú mientras se hace scroll.

    // Mostrar el año actual en el pie de página (si el elemento existe).
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});

// --- FUNCIONES DE CONFIGURACIÓN (SETUP) ---

/**
 * Configura el comportamiento del menú de navegación móvil (hamburguesa).
 * Maneja el clic en el botón de toggle y el cierre al seleccionar un enlace.
 */
function setupMenuHamburguesa() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const mainNavList = document.getElementById('main-nav-list');

    // Verifica que los elementos necesarios existan en el DOM.
    if (menuToggle && mainNav && mainNavList) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('is-active'); // Alterna la clase 'is-active' en el nav.
            menuToggle.setAttribute('aria-expanded', isActive.toString()); // Actualiza el estado ARIA.
            menuToggle.setAttribute('aria-label', isActive ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'); // Actualiza la etiqueta ARIA.

            // Alterna los iconos del botón (bars <-> times) usando Font Awesome.
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-times', isActive);

            playSound(sonidoClick); // Reproduce sonido al hacer clic.
        });

        // Cierra el menú al hacer clic en un enlace de navegación (útil en móviles).
        mainNavList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-active')) {
                    mainNav.classList.remove('is-active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    } else {
        console.warn("Elementos del menú hamburguesa (toggle, nav o list) no encontrados.");
    }
}

/**
 * Configura el scroll suave al hacer clic en enlaces de ancla (ej. href="#sectionId").
 * Calcula el desplazamiento para tener en cuenta la altura del header fijo.
 */
function setupSmoothScrolling() {
    document.querySelectorAll('#main-nav-list a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Evita el comportamiento de salto instantáneo por defecto.
            playSound(sonidoClick); // Reproduce sonido al hacer clic.

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const header = document.querySelector('header');
                // Obtiene la altura del header o usa un valor por defecto si no está fijo.
                const headerOffset = header ? header.offsetHeight : 70; // Ajustar este valor si el header no es fijo o tiene otra altura.
                // Calcula la posición del elemento objetivo teniendo en cuenta el scroll actual.
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                // Calcula la posición final del scroll restando la altura del header y un margen extra.
                const offsetPosition = elementPosition - headerOffset - 20; // 20px extra de margen superior para mejor visualización.

                // Realiza el scroll suave a la posición calculada.
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                // El cierre del menú móvil ya está manejado en setupMenuHamburguesa.
            }
        });
    });
}

/**
 * Configura el comportamiento de los modales: abrir al hacer clic en un trigger,
 * cerrar con el botón de cerrar, al hacer clic fuera del contenido o al presionar Escape.
 * También maneja la carga de contenido dinámico para el modal de Gestalt.
 */
function setupModales() {
    // Selecciona todos los elementos que tienen la clase 'modal-trigger'.
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    modalTriggers.forEach(trigger => {
        // Añade listener para el evento 'click'.
        trigger.addEventListener('click', function() {
            const modalId = this.dataset.modalTarget; // Obtiene el ID del modal objetivo desde el atributo data.
            const modal = document.getElementById(modalId);

            if (modal) {
                // Si es el modal de Gestalt, carga el contenido específico antes de abrir.
                if (modalId === 'modal-gestalt' && this.dataset.gestaltKey) {
                    populateGestaltModal(modal, this.dataset.gestaltKey);
                }
                // Abre el modal, pasando el trigger para devolver el foco después.
                openModal(modal, this);
            } else {
                console.error(`Modal con ID "${modalId}" no encontrado.`);
            }
        });

        // Añade listener para eventos de teclado (Enter/Space) en triggers que sean focuseables.
        // Permite a los usuarios de teclado abrir modales con estas teclas.
        if (trigger.hasAttribute('tabindex') && trigger.getAttribute('tabindex') === '0') {
             trigger.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault(); // Previene el scroll de la página con la barra espaciadora.
                    this.click(); // Simula un clic en el elemento para activar el listener de clic.
                }
            });
        }
    });

    // Configura los botones de cerrar dentro de cada modal.
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', function() {
            // Cierra el modal al que pertenece este botón.
            closeModal(this.closest('.modal'));
        });
    });

    // Configura el cierre del modal al hacer clic en el fondo oscuro fuera del contenido.
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) { // Solo si el clic es directamente en el fondo del modal.
                closeModal(this);
            }
        });
    });

    // Configura el cierre del modal al presionar la tecla Escape.
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Busca el modal visible actualmente (si lo hay).
            const visibleModal = document.querySelector('.modal.is-visible');
            if (visibleModal) {
                closeModal(visibleModal);
            }
        }
    });
}

/**
 * Rellena el contenido del modal de Gestalt con la información específica
 * basada en la clave del principio seleccionada.
 * @param {HTMLElement} modal - El elemento del modal de Gestalt.
 * @param {string} gestaltKey - La clave del principio Gestalt (ej. "figura-fondo").
 */
function populateGestaltModal(modal, gestaltKey) {
    const info = gestaltInfo[gestaltKey]; // Obtiene los datos del principio del objeto gestaltInfo.
    const nombreEl = modal.querySelector('#modalGestaltNombre');
    const explicacionEl = modal.querySelector('#modalGestaltExplicacion');
    const imgEl = modal.querySelector('#modalGestaltImagen');
    const imgCaptionEl = modal.querySelector('#modalGestaltImagenCaption'); // Elemento figcaption para accesibilidad
    const titleEl = modal.querySelector('#modal-gestalt-title'); // Título principal del modal


    // Verifica que la información exista y los elementos del DOM estén presentes.
    if (info && nombreEl && explicacionEl && imgEl && titleEl) {
        // Actualiza el texto y atributos ARIA del título y otros elementos.
        titleEl.setAttribute('aria-label', `Información sobre el principio Gestalt: ${info.nombre}`);
        nombreEl.textContent = info.nombre;
        // Utiliza innerHTML si la explicación contiene etiquetas HTML (como <strong> o <br>).
        explicacionEl.innerHTML = info.explicacion;
        // Actualiza la imagen y su texto alternativo.
        imgEl.src = info.imagen || 'assets/placeholder_image.png'; // Fallback a una imagen por defecto si la ruta no existe.
        imgEl.alt = `Ejemplo visual del Principio de ${info.nombre}`;
        // Actualiza la leyenda de la imagen (caption) si el elemento existe.
        if (imgCaptionEl) {
             // Hace que la leyenda sea solo para lectores de pantalla si no es necesaria visualmente.
            imgCaptionEl.textContent = `Ilustración del Principio de ${info.nombre}`;
        }
    } else {
        // Muestra un mensaje de error si no se encuentra la información o los elementos.
        console.error(`Información para Gestalt key "${gestaltKey}" o elementos del modal no encontrados.`);
        nombreEl.textContent = "Error al cargar";
        explicacionEl.textContent = "No se pudo cargar la información para este principio. Por favor, inténtelo de nuevo.";
        imgEl.src = 'assets/placeholder_image.png'; // Asegura que al menos se muestre el placeholder.
        imgEl.alt = 'Error al cargar imagen';
        if (imgCaptionEl) imgCaptionEl.textContent = 'Error al cargar la ilustración.';
    }
}


/**
 * Configura el comportamiento de los elementos de acordeón.
 * Al hacer clic en un encabezado, expande/contrae el contenido asociado
 * y cierra los demás acordeones en el mismo contenedor.
 * CORRECCIÓN: Se añade la altura del padding al scrollHeight para asegurar que todo el contenido sea visible.
 */
function setupAcordeones() {
    document.querySelectorAll(".accordion-header").forEach(header => {
        const content = header.nextElementSibling; // El contenido del acordeón es el siguiente hermano del encabezado.

        // Verifica que exista un contenido válido para el encabezado.
        if (!content || !content.classList.contains('accordion-content')) {
            console.warn("Contenido de acordeón no encontrado para:", header);
            return;
        }

        // Asegura que el encabezado tenga el atributo aria-controls apuntando al ID del contenido.
        // Esto es importante para la accesibilidad.
        const contentId = content.id;
        if (contentId) {
            header.setAttribute('aria-controls', contentId);
            // Inicializa el estado ARIA: contraído por defecto y el contenido oculto.
            header.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
        } else {
             console.warn("El contenido del acordeón no tiene un ID, ARIA controls no se puede configurar correctamente para:", header);
        }


        // Añade listener para el evento 'click' en el encabezado.
        header.addEventListener("click", function() {
            playSound(sonidoClick); // Reproduce sonido al hacer clic.

            const item = this.parentElement; // El contenedor principal del acordeón (el '.accordion-item').
            // Alterna la clase 'active' en el contenedor principal.
            const isActive = item.classList.toggle('active');

            // Actualiza el estado ARIA y la clase 'active' en el encabezado.
            this.setAttribute('aria-expanded', isActive.toString());
            this.classList.toggle('active', isActive);

            // Actualiza el estado ARIA y la clase 'active' en el contenido para CSS.
            content.setAttribute('aria-hidden', (!isActive).toString());
            content.classList.toggle('active', isActive); // La clase 'active' en el CSS aplica padding.

            if (isActive) {
                // Si este acordeón se está abriendo:
                // Cierra cualquier otro acordeón abierto dentro del mismo contenedor padre.
                const parentContainer = this.closest('.accordion-container');
                if (parentContainer) {
                    parentContainer.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                        if (activeItem !== item) { // Asegura no cerrar el acordeón que acabamos de abrir.
                            activeItem.classList.remove('active');
                            const activeHeader = activeItem.querySelector('.accordion-header');
                            const activeContent = activeItem.querySelector('.accordion-content');
                            if (activeHeader) {
                                activeHeader.classList.remove('active');
                                activeHeader.setAttribute('aria-expanded', 'false');
                            }
                            if (activeContent) {
                                activeContent.classList.remove('active');
                                activeContent.setAttribute('aria-hidden', 'true');
                                activeContent.style.maxHeight = null; // Elimina la altura máxima para permitir la transición de cierre.
                            }
                        }
                    });
                }
                // **CORRECCIÓN APLICADA AQUÍ:**
                // Establece la altura máxima del contenido actual para permitir la transición de apertura.
                // Sumamos 32px (correspondientes a 1rem padding-top + 1rem padding-bottom definidos en CSS)
                // a scrollHeight para asegurar que todo el contenido Y el padding sean visibles.
                content.style.maxHeight = (content.scrollHeight + 32) + "px";


            } else {
                // Si este acordeón se está cerrando:
                // Elimina la altura máxima para permitir la transición de cierre (la transición CSS se encargará de ir a 0).
                content.style.maxHeight = null;
            }
        });

        // Añade sonido al pasar el ratón por encima del encabezado del acordeón.
        header.addEventListener("mouseenter", () => playSound(sonidoHover, 0.1)); // Volumen más bajo para hover.
    });
}

/**
 * Añade sonidos de interfaz de usuario (hover) a elementos interactivos.
 * El sonido de clic se gestiona en las funciones específicas (modales, acordeones).
 */
function setupSonidosUI() {
    document.querySelectorAll('.action-button, .action-button-inline, .card.modal-trigger').forEach(button => {
        // Añade sonido al pasar el ratón por encima.
        button.addEventListener("mouseenter", () => playSound(sonidoHover, 0.1)); // Volumen más bajo para hover.
        // El sonido de clic ya se maneja en las funciones específicas de modal/acordeón/scroll.
    });
}

/**
 * Configura la funcionalidad del simulador de plan de estimulación sensorial.
 * Carga dinámicamente las actividades según la edad seleccionada y configura los botones.
 */
function setupSimuladorSensorial() {
    const edadSelectSensorial = document.getElementById('sim-edad-sensorial');
    const btnIniciar = document.getElementById('btnIniciarSimulacion');
    const btnExportar = document.getElementById('btnExportarSensorial');

    // Verifica que los elementos necesarios existan.
    if(edadSelectSensorial) {
        // Al cambiar la edad, vuelve a cargar la lista de actividades.
        edadSelectSensorial.addEventListener('change', cargarActividadesSimuladorSensorial);
        cargarActividadesSimuladorSensorial(); // Carga las actividades iniciales al cargar la página.
    } else {
        console.warn("Selector de edad del simulador no encontrado.");
    }

    // Asigna los listeners de eventos a los botones (en lugar de usar onclick en HTML).
    // Esto asume que has eliminado los atributos 'onclick' del HTML.
    if (btnIniciar) {
      btnIniciar.addEventListener('click', iniciarSimuladorSensorial);
    } else {
        console.warn("Botón 'Iniciar Simulación' no encontrado.");
    }

    if(btnExportar) {
      btnExportar.addEventListener('click', exportarResultadosSensorial);
    } else {
         console.warn("Botón 'Exportar Resultados' no encontrado.");
    }
}

/**
 * Configura animaciones de entrada para secciones o elementos cuando
 * se vuelven visibles en el viewport usando Intersection Observer.
 */
function setupScrollAnimations() {
    // Selecciona todos los elementos que tienen clases de animación de entrada.
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .anim-pop-in');
    if (!animatedElements.length) return; // No hace nada si no hay elementos para animar.

    // Crea un nuevo Intersection Observer.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el elemento entra en el viewport, añade la clase que activa la animación CSS.
                entry.target.classList.add('is-visible-anim');
                // Opcional: para que la animación solo ocurra una vez, descomenta la siguiente línea:
                // observer.unobserve(entry.target);
            } else {
                // Opcional: para que la animación se repita al scrollear arriba y abajo, descomenta la siguiente línea:
                // entry.target.classList.remove('is-visible-anim');
            }
        });
    }, { threshold: 0.1 }); // El observer se activa cuando al menos el 10% del elemento es visible.

    // Empieza a observar cada uno de los elementos animados.
    animatedElements.forEach(el => observer.observe(el));
}


/**
 * Configura la actualización automática del enlace activo en el menú de navegación
 * principal basándose en qué sección de la página es visible en el viewport.
 * Utiliza Intersection Observer para mayor eficiencia.
 */
function setActiveLinkScroll() {
    // Selecciona todas las secciones que tienen un ID (potenciales destinos del menú).
    const sections = document.querySelectorAll("main section[id]");
    // Selecciona todos los enlaces de navegación en el menú principal.
    const navLinks = document.querySelectorAll("#main-nav-list a");

    // Verifica que haya secciones y enlaces de menú.
    if (sections.length > 0 && navLinks.length > 0) {
        // Obtiene la altura del encabezado para ajustar el área de detección del observer.
        // Esto evita que el enlace activo cambie demasiado pronto o tarde debido al header fijo.
        const headerHeight = document.querySelector('header')?.offsetHeight || 70;

        // Función callback que se ejecuta cuando una sección cruza el umbral del observer.
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Si la sección está intersectando (es visible),
                    // remueve la clase 'active-link' de todos los enlaces
                    navLinks.forEach((link) => {
                        link.classList.remove("active-link");
                    });
                    // y añade la clase 'active-link' al enlace que coincide con el ID de la sección visible.
                    const activeLink = document.querySelector(`#main-nav-list a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add("active-link");
                    }
                }
            });
        };

        // Opciones para el Intersection Observer.
        // rootMargin: Define el área del viewport (raíz) que activa el observer.
        // Se ajusta para que el observer considere la parte superior de la sección justo debajo del header fijo.
        // La detección ocurre cuando la parte superior de la sección entra en el viewport después del header.
        // El margen inferior se calcula para que solo la parte superior (ej. 30%) de la sección sea relevante,
        // ayudando a que el enlace cambie a la *siguiente* sección antes de que la actual desaparezca completamente.
        const observerOptions = {
            // El margen superior es negativo (-headerHeight) para "encoger" el área de detección desde arriba.
            rootMargin: `-${headerHeight}px 0px -${window.innerHeight - headerHeight - (window.innerHeight * 0.3)}px 0px`,
            threshold: 0 // Umbral de 0: se activa en cuanto el primer pixel del elemento cruza el área definida por rootMargin.
        };

        // Crea el Intersection Observer con el callback y las opciones.
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Comienza a observar cada sección.
        sections.forEach(section => observer.observe(section));
    } else {
        console.warn("Elementos para 'setActiveLinkScroll' (secciones con ID o enlaces de navegación) no encontrados.");
    }
}


// --- FUNCIONES DE UTILIDAD (MODALES, SIMULADOR, AUDIO) ---

/**
 * Abre un elemento modal especificado.
 * Controla la visibilidad, accesibilidad (ARIA, foco) y scroll del body.
 * @param {HTMLElement} modal - El elemento modal a abrir.
 * @param {HTMLElement} [triggerElement] - El elemento que activó el modal (para devolver el foco).
 */
function openModal(modal, triggerElement) {
    if (!modal) return; // Sale si el modal no es válido.

    // Guarda el elemento que tenía el foco antes de abrir el modal.
    lastFocusedElement = triggerElement || document.activeElement;

    // Muestra el modal usando flexbox (para centrar) y asegura que esté visible para animaciones.
    modal.style.display = "flex";
    // Fuerza un "reflow" (redibujo del navegador) para asegurar que el cambio de display: none a flex
    // se procese antes de añadir la clase de animación.
    void modal.offsetWidth;

    // Asegura que las clases de animación estén limpias antes de añadir 'is-visible'.
    modal.classList.remove('is-hiding');
    modal.classList.add('is-visible');

    // Actualiza el estado ARIA para indicar que el modal está visible.
    modal.setAttribute('aria-hidden', 'false');

    // Mueve el foco al primer elemento interactivo dentro del modal.
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusableElement = modal.querySelector(focusableElements);
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }

    // Activa la "trampa de foco" para mantener el foco dentro del modal.
    trapFocus(modal);

    // Evita el scroll del body mientras el modal está abierto.
    document.body.style.overflow = 'hidden';

    // Reproduce el sonido de clic al abrir el modal.
    playSound(sonidoClick);
}

/**
 * Cierra un elemento modal especificado.
 * Controla la visibilidad, accesibilidad, scroll del body y devuelve el foco.
 * @param {HTMLElement} modal - El elemento modal a cerrar.
 */
function closeModal(modal) {
    // Sale si el modal no es válido o ya está oculto.
    if (!modal || !modal.classList.contains('is-visible')) return;

    // Añade la clase para la animación de salida y remueve la de visibilidad.
    modal.classList.add('is-hiding');
    modal.classList.remove('is-visible');

    // Actualiza el estado ARIA para indicar que el modal está oculto.
    modal.setAttribute('aria-hidden', 'true');

    // Restaura el scroll del body.
    document.body.style.overflow = '';

    // Reproduce el sonido de clic al cerrar el modal.
    playSound(sonidoClick);

    // Devuelve el foco al elemento que abrió el modal (si se guardó).
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null; // Limpia la variable para el próximo modal.
    }

    // Oculta completamente el modal después de que termine la animación de salida.
    modal.addEventListener('animationend', function handler() {
        // Solo oculta si la clase de salida ('is-hiding') todavía está presente
        // (evita problemas si la animación se detiene o reinicia inesperadamente).
        if (modal.classList.contains('is-hiding')) {
            modal.style.display = "none";
            modal.classList.remove('is-hiding');
             // Remueve el listener para evitar que se dispare múltiples veces.
             modal.removeEventListener('animationend', handler);
        }
    });
}

/**
 * Limita el foco del teclado a los elementos dentro de un contenedor específico (ej. un modal).
 * Esto mejora la accesibilidad, evitando que los usuarios de teclado salgan del contenedor.
 * @param {HTMLElement} element - El elemento contenedor dentro del cual se debe atrapar el foco.
 */
function trapFocus(element) {
    // Define un selector CSS para encontrar todos los elementos focuseables.
    const focusableElementsString = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    // Encuentra todos los elementos focuseables dentro del contenedor y los convierte en un array.
    let focusableElements = Array.from(element.querySelectorAll(focusableElementsString));

    // Filtra los elementos que puedan no ser visibles o no tener dimensiones
    focusableElements = focusableElements.filter(el => el.offsetParent !== null);

    // Si no hay elementos focuseables, no hay nada que atrapar.
    if (focusableElements.length === 0) return;

    // Identifica el primer y último elemento focuseable.
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Añade un listener para el evento 'keydown' en el contenedor del modal.
    element.addEventListener('keydown', function(e) {
        // Verifica si la tecla presionada es Tab (keyCode 9).
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        // Si no es la tecla Tab, no hacemos nada y permitimos el comportamiento por defecto.
        if (!isTabPressed) return;

        // Lógica para Shift + Tab (navegación hacia atrás).
        if (e.shiftKey) {
            // Si el foco está en el primer elemento y se presiona Shift + Tab,
            // movemos el foco manualmente al último elemento y prevenimos el comportamiento por defecto.
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // Lógica para solo Tab (navegación hacia adelante).
            // Si el foco está en el último elemento y se presiona Tab,
            // movemos el foco manualmente al primer elemento y prevenimos el comportamiento por defecto.
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
}


/**
 * Carga dinámicamente la lista de actividades de estimulación sensorial en
 * el simulador basándose en la etapa de edad seleccionada en el dropdown.
 * Genera checkboxes para cada actividad disponible.
 */
function cargarActividadesSimuladorSensorial() {
    const edadSelectSensorial = document.getElementById('sim-edad-sensorial');
    const actividadesContainerSensorial = document.getElementById('sim-actividades-sensorial-checkboxes');

    // Verifica que los elementos necesarios existan.
    if (!edadSelectSensorial || !actividadesContainerSensorial) {
        console.error("Elementos del simulador (select edad o container checkboxes) no encontrados.");
        return;
    }

    const edadSeleccionada = edadSelectSensorial.value;
    // Obtiene la lista de actividades para la edad seleccionada de la estructura de datos.
    const actividades = actividadesSensorialesPorEdad[edadSeleccionada];
    // Limpia el contenedor de checkboxes existentes.
    actividadesContainerSensorial.innerHTML = '';

    // Si hay actividades para esta edad, las genera.
    if (actividades && actividades.length > 0) {
      actividades.forEach((act, index) => {
        // Crea un ID único para cada checkbox.
        const checkboxId = `act-sensorial-${edadSeleccionada.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
        // Crea un div contenedor para el checkbox y la etiqueta (útil para estilos o flexbox/grid).
        const div = document.createElement('div');
        div.classList.add('checkbox-item');

        // Crea el elemento input (checkbox).
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.value = act.nombre; // Almacena el nombre de la actividad en el valor.
        // Guarda los sentidos y el desarrollo en atributos data para fácil acceso.
        checkbox.dataset.sentidos = act.sentidos.join(','); // Une el array de sentidos con comas.
        checkbox.dataset.desarrollo = act.desarrollo;

        // Crea la etiqueta (label) asociada al checkbox.
        const label = document.createElement('label');
        label.htmlFor = checkboxId; // Asocia la etiqueta con el checkbox por su ID.
        label.appendChild(document.createTextNode(act.nombre)); // El texto de la etiqueta es el nombre de la actividad.

        // Añade el checkbox y la etiqueta al div contenedor.
        div.appendChild(checkbox);
        div.appendChild(label);
        // Añade el div contenedor al área de actividades del simulador.
        actividadesContainerSensorial.appendChild(div);
      });
    } else {
        // Si no hay actividades definidas para la edad seleccionada, muestra un mensaje.
        actividadesContainerSensorial.innerHTML = '<p><em>No hay actividades específicas listadas para esta etapa o no se pudieron cargar.</em></p>';
    }
}

/**
 * Inicia la simulación del plan de estimulación sensorial.
 * Lee las actividades seleccionadas, analiza los sentidos y áreas de desarrollo que potencian,
 * y muestra un resumen en el área de resultados.
 */
function iniciarSimuladorSensorial() {
    const resultadoDiv = document.getElementById("resultadoSimulacionSensorial");
    const edadSelect = document.getElementById("sim-edad-sensorial");

    // Verifica que los elementos de resultado y selector de edad existan.
    if (!resultadoDiv || !edadSelect) {
        console.error("Elementos del simulador para iniciar (div resultado o select edad) no encontrados.");
        return;
    }

    // Obtiene el texto de la opción de edad seleccionada.
    const edad = edadSelect.options[edadSelect.selectedIndex].text;
    const nombreSimulado = "Peque Explorador/a"; // Nombre genérico para el informe.

    // Recopila todas las actividades seleccionadas.
    const actividadesSeleccionadas = [];
    document.querySelectorAll('#sim-actividades-sensorial-checkboxes input[type="checkbox"]:checked').forEach(cb => {
        actividadesSeleccionadas.push({
            nombre: cb.value, // El nombre está en el valor del checkbox.
            sentidos: cb.dataset.sentidos.split(','), // Separa los sentidos guardados en el atributo data.
            desarrollo: cb.dataset.desarrollo // Obtiene el desarrollo del atributo data.
        });
    });

    // Inicializa el mensaje de resultado.
    let mensajeResultado = `<h4>Plan de Estimulación para ${nombreSimulado} (${edad}):</h4>`;

    // Si no se seleccionó ninguna actividad, muestra un mensaje de advertencia.
    if (actividadesSeleccionadas.length === 0) {
        mensajeResultado += "<p class='sim-warning'>⚠️ No se seleccionaron actividades. ¡La exploración sensorial es una aventura diaria que enriquece el desarrollo!</p>";
        simulacionSensorialActual = {}; // Reinicia los datos de la simulación actual.
    } else {
        // Si hay actividades seleccionadas, construye el resumen.
        mensajeResultado += `<p>Con las siguientes actividades seleccionadas:</p><ul>`;
        actividadesSeleccionadas.forEach(act => {
            mensajeResultado += `<li><strong>${act.nombre}</strong></li>`;
        });
        mensajeResultado += "</ul>";

        // Usa Sets para almacenar los sentidos y desarrollos únicos sin duplicados.
        const sentidosEstimulados = new Set();
        const desarrollosFomentados = new Set();

        // Itera sobre las actividades seleccionadas para recopilar todos los sentidos y desarrollos únicos.
        actividadesSeleccionadas.forEach(act => {
            act.sentidos.forEach(s => sentidosEstimulados.add(s.trim())); // Añade cada sentido (eliminando espacios).
            desarrollosFomentados.add(act.desarrollo.trim()); // Añade cada desarrollo (eliminando espacios).
        });

        // Añade el resumen de sentidos y desarrollos potenciados al mensaje.
        mensajeResultado += `<h5>Se están potenciando principalmente:</h5><ul>`;
        if (sentidosEstimulados.size > 0) {
            mensajeResultado += `<li><strong>Sentidos Clave:</strong> ${Array.from(sentidosEstimulados).join(', ')}.</li>`; // Convierte el Set a Array y lo une.
        }
        if (desarrollosFomentados.size > 0) {
            mensajeResultado += `<li><strong>Áreas de Desarrollo Favorecidas:</strong> ${Array.from(desarrollosFomentados).join('; ')}.</li>`; // Convierte el Set a Array y lo une.
        }
        mensajeResultado += "</ul>";
        mensajeResultado += "<p class='sim-summary-sensorial'>¡Excelente! Una rica variedad de estímulos sensoriales, ofrecidos en un contexto lúdico y afectivo, promueve una mejor comprensión del mundo y un desarrollo integral.</p>";

        // Almacena los datos de la simulación para la función de exportar.
        simulacionSensorialActual = {
            nombre: nombreSimulado,
            edad: edad,
            // Une los nombres de las actividades y los sentidos/desarrollos para el CSV.
            actividades: actividadesSeleccionadas.map(a => a.nombre).join('; '),
            sentidos: Array.from(sentidosEstimulados).join(', '),
            desarrolloFomentado: Array.from(desarrollosFomentados).join('; ')
        };
    }

    // Añade una nota de descargo de responsabilidad al final del resultado.
    mensajeResultado += "<p class='sim-disclaimer-sensorial'><em>Esta simulación es una guía general. La observación individual del niño/a, la adaptación de actividades a sus intereses y necesidades, y la creación de un entorno seguro y estimulante son siempre la clave. ¡El juego es el lenguaje principal del aprendizaje en la infancia!</em></p>";

    // Muestra el mensaje de resultado en el div correspondiente.
    resultadoDiv.innerHTML = mensajeResultado;

    // Reproduce sonido de éxito.
    playSound(sonidoExito);

    // Muestra u oculta el botón de exportar según si hay actividades seleccionadas.
    const btnExportar = document.getElementById('btnExportarSensorial');
    if(btnExportar) {
        btnExportar.style.display = actividadesSeleccionadas.length > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Exporta los resultados de la última simulación a un archivo CSV.
 * Los datos se obtienen de la variable `simulacionSensorialActual`.
 */
function exportarResultadosSensorial() {
    // Verifica si hay datos de simulación para exportar.
    if (!simulacionSensorialActual.nombre) {
        alert("Primero debe iniciar una simulación sensorial con actividades seleccionadas para poder exportar los resultados.");
        return;
    }

    playSound(sonidoClick); // Reproduce sonido al iniciar la descarga.

    // Define la cabecera del archivo CSV.
    const csvHeader = "Nombre Simulacion,Etapa Edad,Actividades Seleccionadas,Sentidos Estimulados,Desarrollo Fomentado\n";

    // Función auxiliar para escapar campos que puedan contener comas o comillas,
    // lo cual es necesario para un formato CSV correcto.
    const escapeCSV = (field) => {
        if (field == null) return ""; // Maneja valores nulos o indefinidos.
        // Convierte a string, envuelve el campo entre comillas y escapa cualquier comilla doble dentro.
        return `"${(field.toString()).replace(/"/g, '""')}"`;
    };

    // Construye la fila de datos usando la función de escape.
    const csvRow = [
        escapeCSV(simulacionSensorialActual.nombre),
        escapeCSV(simulacionSensorialActual.edad),
        escapeCSV(simulacionSensorialActual.actividades),
        escapeCSV(simulacionSensorialActual.sentidos),
        escapeCSV(simulacionSensorialActual.desarrolloFomentado)
    ].join(',') + '\n'; // Une los campos con comas y añade un salto de línea al final.

    // Combina la cabecera y la fila de datos.
    const csvData = csvHeader + csvRow;

    // Crea un objeto Blob con los datos CSV.
    // '\uFEFF' es el Byte Order Mark (BOM) para UTF-8, ayuda a Excel a interpretar correctamente los caracteres especiales.
    const blob = new Blob([`\uFEFF${csvData}`], { type: 'text/csv;charset=utf-8;' });

    // Crea una URL para el Blob.
    const url = URL.createObjectURL(blob);

    // Crea un elemento de enlace <a> para iniciar la descarga.
    const a = document.createElement("a");
    a.style.display = "none"; // Lo oculta.
    a.href = url; // Establece la URL del Blob como destino.
    a.download = "resultados_simulacion_sensorial.csv"; // Establece el nombre del archivo de descarga.

    // Añade el enlace al body, simula un clic y lo elimina.
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Libera la URL creada para el Blob para liberar memoria.
    URL.revokeObjectURL(url);
}

/**
 * Intenta reproducir un elemento de audio.
 * Incluye manejo básico para reiniciar el audio si ya está sonando
 * y control de volumen.
 * @param {HTMLAudioElement} audioElement - El elemento de audio a reproducir.
 * @param {number} [volume=0.15] - El volumen de reproducción (entre 0 y 1).
 */
function playSound(audioElement, volume = 0.15) {
  // Verifica que el elemento de audio exista y tenga el método play.
  if (audioElement && typeof audioElement.play === 'function') {
    try {
        // Detiene el audio si ya está sonando y lo reinicia al principio.
        audioElement.pause();
        audioElement.currentTime = 0;
        // Establece el volumen.
        audioElement.volume = volume;
        // Intenta reproducir el audio.
        audioElement.play().catch(error => {
            // Captura y descarta errores comunes de reproducción automática que no requieren acción visible.
            // console.warn("Error al intentar reproducir sonido:", error.name, error.message);
        });
    } catch (error) {
         console.error("Error inesperado al reproducir sonido:", error);
    }
  }
}

// Fin del script.