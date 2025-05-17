// Variables globales para elementos de audio y datos
const sonidoExito = document.getElementById('sonidoExito');
const sonidoClick = document.getElementById('sonidoClick');
const sonidoHover = document.getElementById('sonidoHover');

const gestaltInfo = {
    "figura-fondo": { nombre: "Relación Figura-Fondo", explicacion: "Nuestra percepción organiza el campo visual en una 'figura' que resalta y un 'fondo' que la rodea...", imagen: "assets/gestalt_figura_fondo_placeholder.png" },
    "proximidad": { nombre: "Principio de Proximidad", explicacion: "Tendemos a agrupar perceptualmente los elementos que están cercanos entre sí...", imagen: "assets/gestalt_proximidad_placeholder.png" },
    "similitud": { nombre: "Principio de Similitud", explicacion: "Agrupamos los elementos que son similares en forma, tamaño, color...", imagen: "assets/gestalt_similitud_placeholder.png" },
    "direccion": { nombre: "Principio de Continuidad", explicacion: "Los estímulos que guardan una continuidad de forma o dirección tienden a ser percibidos como una unidad...", imagen: "assets/gestalt_direccion_placeholder.png" },
    "simplicidad": { nombre: "Principio de Simplicidad (Buena Forma)", explicacion: "Organizamos los campos perceptuales con rasgos simples, regulares y estables...", imagen: "assets/gestalt_simplicidad_placeholder.png" },
    "cierre": { nombre: "Principio de Cierre", explicacion: "Nuestra mente tiende a completar las figuras incompletas para darles sentido...", imagen: "assets/gestalt_cierre_placeholder.png" }
};

const actividadesSensorialesPorEdad = {
    "0-6m": [
        { nombre: "Móviles coloridos y sonajeros", sentidos: ["Vista", "Oído"], desarrollo: "Seguimiento visual, localización auditiva" },
        { nombre: "Masajes suaves con diferentes texturas", sentidos: ["Tacto"], desarrollo: "Conciencia corporal, relajación, vínculo" },
        { nombre: "Tiempo boca abajo con estímulos visuales", sentidos: ["Vista", "Tacto", "Propiocepción"], desarrollo: "Fortalecimiento, exploración visual" },
        { nombre: "Hablarle y cantarle mirándole", sentidos: ["Oído", "Vista"], desarrollo: "Vínculo, reconocimiento voz/rostro" }
    ],
    "6-12m": [
        { nombre: "Bloques de texturas y encajables simples", sentidos: ["Tacto", "Vista"], desarrollo: "Manipulación fina, coordinación ojo-mano" },
        { nombre: "Explorar alimentos seguros con manos (BLW)", sentidos: ["Tacto", "Gusto", "Olfato"], desarrollo: "Texturas, sabores, olores" },
        { nombre: "Gatear sobre diferentes superficies", sentidos: ["Tacto", "Propiocepción"], desarrollo: "Percepción espacial, texturas" },
        { nombre: "Libros de tela con sonidos y solapas", sentidos: ["Vista", "Oído", "Tacto"], desarrollo: "Multisensorial, causa-efecto" }
    ],
    "1-2a": [
        { nombre: "Pintura de dedos o plastilina casera", sentidos: ["Tacto", "Vista", "Olfato"], desarrollo: "Creatividad, texturas, motricidad fina" },
        { nombre: "Caminar descalzo (arena, césped seguro)", sentidos: ["Tacto", "Propiocepción"], desarrollo: "Equilibrio, percepción texturas" },
        { nombre: "Instrumentos musicales sencillos", sentidos: ["Oído", "Tacto"], desarrollo: "Ritmo, causa-efecto auditivo" },
        { nombre: "Probar y oler frutas variadas", sentidos: ["Gusto", "Olfato", "Tacto"], desarrollo: "Discriminación sabores/olores" }
    ],
    "2-3a": [
        { nombre: "Circuitos con túneles y cojines", sentidos: ["Tacto", "Propiocepción", "Vista"], desarrollo: "Planificación motora, percepción espacial" },
        { nombre: "Bolsa misteriosa (reconocer por tacto)", sentidos: ["Tacto"], desarrollo: "Estereognosia" },
        { nombre: "Juegos de olores (botes especias, flores)", sentidos: ["Olfato"], desarrollo: "Discriminación olfativa" },
        { nombre: "Jugar con agua a temperaturas (supervisado)", sentidos: ["Tacto"], desarrollo: "Percepción térmica" }
    ]
};
let simulacionSensorialActual = {};

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('is-active');
            menuToggle.setAttribute('aria-expanded', isActive.toString());
            mainNav.setAttribute('aria-hidden', (!isActive).toString());
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
            playSound(sonidoClick);
        });

        // Cerrar menú al hacer clic en un enlace
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-active')) {
                    mainNav.classList.remove('is-active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.setAttribute('aria-hidden', 'true');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // Smooth scrolling para enlaces de nav (revisado)
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            playSound(sonidoClick);
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Considerar el header fijo para el offset
                const headerOffset = document.querySelector('header').offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    
    // --- MODALES ---
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (modal) {
                // Si es un modal de Gestalt, cargar contenido específico
                if (modalId === 'modal-gestalt' && this.dataset.gestaltKey) {
                    const gestaltKey = this.dataset.gestaltKey;
                    const info = gestaltInfo[gestaltKey];
                    if (info) {
                        modal.querySelector('#modalGestaltNombre').textContent = info.nombre;
                        modal.querySelector('#modalGestaltExplicacion').textContent = info.explicacion;
                        const imgEl = modal.querySelector('#modalGestaltImagen');
                        imgEl.src = info.imagen;
                        imgEl.alt = `Ejemplo de ${info.nombre}`;
                    }
                }
                // (Podrías añadir lógica similar para otros modales si su contenido es dinámico)
                openModal(modal);
            }
        });
    });

    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.is-visible').forEach(modal => {
                closeModal(modal);
            });
        }
    });

    // --- ACORDEONES ---
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", function() {
            playSound(sonidoClick);
            const content = this.nextElementSibling;
            const item = this.parentElement;
            const isActive = item.classList.toggle('active');
            this.classList.toggle('active', isActive); // Para el icono +/-

            // Cerrar otros acordeones en el mismo contenedor
            if (isActive) {
                const parentContainer = this.closest('.accordion-container');
                if (parentContainer) {
                    parentContainer.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                        if (activeItem !== item) {
                            activeItem.classList.remove('active');
                            activeItem.querySelector('.accordion-header').classList.remove('active');
                            const activeContent = activeItem.querySelector('.accordion-content');
                            activeContent.style.maxHeight = null;
                            activeContent.style.paddingTop = "0";
                            activeContent.style.paddingBottom = "0";
                        }
                    });
                }
            }

            if (item.classList.contains('active')) {
                content.style.paddingTop = "1rem";
                content.style.paddingBottom = "1rem";
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
                content.style.paddingTop = "0";
                content.style.paddingBottom = "0";
            }
        });
        header.addEventListener("mouseenter", () => playSound(sonidoHover, 0.2));
    });
  
    // Sonidos para botones de acción y tabs
    document.querySelectorAll('.action-button, .tab-button, .action-button-inline').forEach(button => {
        button.addEventListener("mouseenter", () => playSound(sonidoHover, 0.2));
    });

    // Simulador Sensorial: Carga inicial y listener
    const edadSelectSensorial = document.getElementById('sim-edad-sensorial');
    if(edadSelectSensorial) {
        edadSelectSensorial.addEventListener('change', cargarActividadesSimuladorSensorial);
        cargarActividadesSimuladorSensorial(); 
    }

    // Tabs Evolución: Listener para botones
    document.querySelectorAll('#evolucion .tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const contentId = this.getAttribute('onclick').match(/'([^']+)'/)[1]; // Asumiendo que el onclick sigue ahí
            showEvolutionContent(contentId, this);
        });
    });

    // Active link en nav según scroll
    const sections = document.querySelectorAll("main section[id]");
    const navLi = document.querySelectorAll("nav ul li a");
    window.addEventListener("scroll", () => {
        let current = "";
        const headerHeight = document.querySelector('header').offsetHeight || 70;
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - headerHeight - 50; // 50px de offset adicional
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLi.forEach((a) => {
            a.classList.remove("active-link");
            if (a.getAttribute("href") === `#${current}`) {
                a.classList.add("active-link");
            }
        });
    });

}); // Fin de DOMContentLoaded

function openModal(modal) {
    if (!modal) return;
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
    // Enfocar el modal o su primer elemento enfocable para accesibilidad
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
    document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
    playSound(sonidoClick);
    setTimeout(() => modal.classList.add('is-visible'), 10); // Para la transición de opacidad
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restaurar scroll
    playSound(sonidoClick);
    // Devolver el foco al elemento que abrió el modal si es posible/necesario
    // (requiere guardar la referencia al trigger)
    setTimeout(() => modal.style.display = "none", 300); // Esperar que termine la transición
}

// Las siguientes funciones deben estar en el scope global si son llamadas por `onclick`
// o asegurarse que los event listeners se añadan en DOMContentLoaded

function cargarActividadesSimuladorSensorial() {
    const edadSelectSensorial = document.getElementById('sim-edad-sensorial');
    const actividadesContainerSensorial = document.getElementById('sim-actividades-sensorial-checkboxes');
    if (!edadSelectSensorial || !actividadesContainerSensorial) return;

    const edadSeleccionada = edadSelectSensorial.value;
    const actividades = actividadesSensorialesPorEdad[edadSeleccionada];
    actividadesContainerSensorial.innerHTML = ''; 

    if (actividades) {
      actividades.forEach((act, index) => {
        const checkboxId = `act-sensorial-${index}`;
        const label = document.createElement('label');
        label.htmlFor = checkboxId;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.value = act.nombre; 
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${act.nombre}`));
        actividadesContainerSensorial.appendChild(label);
      });
    }
}
window.cargarActividadesSimuladorSensorial = cargarActividadesSimuladorSensorial;


window.iniciarSimuladorSensorial = function() {
    const resultadoDiv = document.getElementById("resultadoSimulacionSensorial");
    const edad = document.getElementById("sim-edad-sensorial").value;
    const nombreSimulado = "Peque Explorador";

    const actividadesSeleccionadasNombres = [];
    document.querySelectorAll('#sim-actividades-sensorial-checkboxes input[type="checkbox"]:checked').forEach(cb => {
        actividadesSeleccionadasNombres.push(cb.value);
    });

    let mensajeResultado = `<p><strong>Simulación para ${nombreSimulado} (${edad}):</strong></p>`;
    
    if (actividadesSeleccionadasNombres.length === 0) {
        mensajeResultado += "<p class='sim-warning'>⚠️ No se seleccionaron actividades. ¡La exploración sensorial enriquece el desarrollo!</p>";
    } else {
        mensajeResultado += `<p>Con la estimulación mediante: ${actividadesSeleccionadasNombres.join(', ')}, se están potenciando:</p><ul>`;
        
        const sentidosEstimulados = new Set();
        const desarrollosFomentados = new Set();
        const actividadesData = actividadesSensorialesPorEdad[edad] || [];
        
        actividadesSeleccionadasNombres.forEach(nombreAct => {
            const actData = actividadesData.find(a => a.nombre === nombreAct);
            if (actData) {
                actData.sentidos.forEach(s => sentidosEstimulados.add(s));
                desarrollosFomentados.add(actData.desarrollo);
            }
        });

        if (sentidosEstimulados.size > 0) {
            mensajeResultado += `<li><strong>Sentidos Principales:</strong> ${Array.from(sentidosEstimulados).join(', ')}.</li>`;
        }
        if (desarrollosFomentados.size > 0) {
            mensajeResultado += `<li><strong>Desarrollo Perceptivo Fomentado:</strong> ${Array.from(desarrollosFomentados).join('; ')}.</li>`;
        }
        mensajeResultado += "</ul>";
        mensajeResultado += "<p class='sim-summary-sensorial'>¡Excelente! Una rica variedad de estímulos sensoriales promueve una mejor comprensión del mundo.</p>";
    }
    mensajeResultado += "<p class='sim-disclaimer-sensorial'><em>Esta es una simulación general. La observación individual y la adaptación de actividades son clave.</em></p>";

    resultadoDiv.innerHTML = mensajeResultado;
    playSound(sonidoExito);
    document.getElementById('btnExportarSensorial').style.display = 'inline-block';

    simulacionSensorialActual = {
        nombre: nombreSimulado,
        edad: edad,
        actividades: actividadesSeleccionadasNombres.join('; '),
        sentidos: Array.from(sentidosEstimulados).join(', '),
        desarrolloFomentado: Array.from(desarrollosFomentados).join('; ')
    };
}

window.exportarResultadosSensorial = function() {
    if (!simulacionSensorialActual.nombre) {
        alert("Primero debes iniciar una simulación sensorial.");
        return;
    }
    playSound(sonidoClick);
    const csvHeader = "Nombre,Edad,Actividades Seleccionadas,Sentidos Estimulados,Desarrollo Fomentado\n";
    const csvRow = `"${simulacionSensorialActual.nombre || ''}","${simulacionSensorialActual.edad || ''}","${simulacionSensorialActual.actividades || ''}","${simulacionSensorialActual.sentidos || ''}","${simulacionSensorialActual.desarrolloFomentado || ''}"\n`;
    const csvData = csvHeader + csvRow;
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "resultados_simulacion_sensorial.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

window.showEvolutionContent = function(contentId, clickedButton) {
  playSound(sonidoClick);
  document.querySelectorAll('.evolution-content').forEach(content => {
    content.classList.remove('active');
  });
  document.querySelectorAll('#evolucion .tab-button').forEach(button => {
    button.classList.remove('active');
  });

  const targetContent = document.getElementById(contentId);
  if (targetContent) targetContent.classList.add('active');
  if (clickedButton) clickedButton.classList.add('active');
}

function playSound(audioElement, volume = 0.3) { // Volumen más bajo por defecto para sonidos de UI
  if (audioElement && typeof audioElement.play === 'function') {
    audioElement.currentTime = 0; 
    audioElement.volume = volume;
    audioElement.play().catch(error => console.warn("Advertencia al reproducir sonido:", error.name, error.message));
  }
}
