// Variables globales para elementos de audio y datos
const sonidoExito = document.getElementById('sonidoExito');
const sonidoClick = document.getElementById('sonidoClick');
const sonidoHover = document.getElementById('sonidoHover');

const gestaltInfo = {
    "figura-fondo": { /* ... (datos como antes) ... */ },
    // ... (resto de principios Gestalt)
};
const gestaltInfo = {
    "figura-fondo": {
      nombre: "Relación Figura-Fondo",
      explicacion: "Nuestra percepción organiza el campo visual en una 'figura' que resalta y un 'fondo' que la rodea. La figura suele ser más pequeña, definida y significativa, mientras que el fondo es más vago. En imágenes ambiguas, la figura y el fondo pueden alternarse.",
      imagen: "assets/gestalt_figura_fondo_placeholder.png"
    },
    "proximidad": {
      nombre: "Principio de Proximidad",
      explicacion: "Tendemos a agrupar perceptualmente los elementos que están cercanos entre sí en el espacio o en el tiempo. Los objetos próximos se ven como una unidad.",
      imagen: "assets/gestalt_proximidad_placeholder.png"
    },
    "similitud": {
      nombre: "Principio de Similitud",
      explicacion: "Agrupamos los elementos que son similares en forma, tamaño, color u otra característica. Lo similar tiende a ser percibido como parte del mismo conjunto.",
      imagen: "assets/gestalt_similitud_placeholder.png"
    },
     "direccion": {
      nombre: "Principio de Continuidad (o Dirección Común)",
      explicacion: "Los estímulos que guardan una continuidad de forma o que parecen seguir un mismo patrón o dirección tienden a ser percibidos como una unidad o figura integrada.",
      imagen: "assets/gestalt_direccion_placeholder.png"
    },
    "simplicidad": {
      nombre: "Principio de Simplicidad (Ley de la Prägnanz o Buena Forma)",
      explicacion: "El individuo organiza sus campos perceptuales con rasgos simples, regulares, estables y equilibrados. Tendemos a percibir las formas de la manera más simple, ordenada y 'buena' posible.",
      imagen: "assets/gestalt_simplicidad_placeholder.png"
    },
    "cierre": {
      nombre: "Principio de Cierre",
      explicacion: "Nuestra mente tiende a completar las figuras incompletas, añadiendo los elementos faltantes para percibir una forma cerrada y con sentido, basándose en patrones previamente conocidos.",
      imagen: "assets/gestalt_cierre_placeholder.png"
    }
};


const actividadesSensorialesPorEdad = { /* ... (datos como antes) ... */ };
const actividadesSensorialesPorEdad = {
    "0-6m": [
        { nombre: "Móviles coloridos y sonajeros", sentidos: ["Vista", "Oído"], desarrollo: "Seguimiento visual, localización auditiva" },
        { nombre: "Masajes suaves con diferentes texturas", sentidos: ["Tacto"], desarrollo: "Conciencia corporal, relajación, vínculo" },
        { nombre: "Tiempo boca abajo (Tummy Time) con estímulos visuales", sentidos: ["Vista", "Tacto", "Propiocepción"], desarrollo: "Fortalecimiento postural, exploración visual" },
        { nombre: "Hablarle y cantarle mirándole a la cara", sentidos: ["Oído", "Vista"], desarrollo: "Vínculo afectivo, reconocimiento de voz y rostro" }
    ],
    "6-12m": [
        { nombre: "Jugar con bloques de texturas y encajables simples", sentidos: ["Tacto", "Vista"], desarrollo: "Manipulación fina, coordinación ojo-mano, formas" },
        { nombre: "Explorar alimentos seguros con las manos (BLW)", sentidos: ["Tacto", "Gusto", "Olfato"], desarrollo: "Descubrimiento de texturas, sabores, olores" },
        { nombre: "Gatear sobre diferentes superficies (alfombra, madera, césped)", sentidos: ["Tacto", "Propiocepción"], desarrollo: "Percepción espacial, discriminación de texturas" },
        { nombre: "Libros de tela con sonidos, texturas y solapas", sentidos: ["Vista", "Oído", "Tacto"], desarrollo: "Estimulación multisensorial, causa-efecto" }
    ],
    "1-2a": [
        { nombre: "Pintura de dedos o jugar con plastilina casera", sentidos: ["Tacto", "Vista", "Olfato"], desarrollo: "Creatividad, experimentación con texturas, motricidad fina" },
        { nombre: "Caminar descalzo por arena, césped (entorno seguro)", sentidos: ["Tacto", "Propiocepción"], desarrollo: "Mejora del equilibrio, percepción de texturas variadas" },
        { nombre: "Juegos con instrumentos musicales sencillos (maracas, xilófono)", sentidos: ["Oído", "Tacto"], desarrollo: "Percepción rítmica, relación causa-efecto auditiva" },
        { nombre: "Probar y oler frutas con diferentes características", sentidos: ["Gusto", "Olfato", "Tacto"], desarrollo: "Discriminación de sabores, olores y texturas" }
    ],
    "2-3a": [
        { nombre: "Circuitos motores con túneles, cojines y aros", sentidos: ["Tacto", "Propiocepción", "Vista"], desarrollo: "Planificación motora, conciencia corporal, percepción espacial" },
        { nombre: "Bolsa misteriosa: reconocer objetos solo por el tacto", sentidos: ["Tacto"], desarrollo: "Estereognosia (reconocimiento de formas por el tacto)" },
        { nombre: "Juegos de identificar olores (botes con especias, flores, esencias)", sentidos: ["Olfato"], desarrollo: "Discriminación y memoria olfativa" },
        { nombre: "Jugar con agua a diferentes temperaturas (templada, fresca - supervisado)", sentidos: ["Tacto"], desarrollo: "Percepción térmica, experimentación" }
    ]
};


let simulacionSensorialActual = {};

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      playSound(sonidoClick);
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Modales (Gestalt y Alteraciones)
  setupModal("gestaltModal", ".card[data-gestalt]", (card) => {
    const gestaltKey = card.dataset.gestalt;
    const info = gestaltInfo[gestaltKey];
    if (info) {
      document.getElementById("modalGestaltNombre").textContent = info.nombre;
      document.getElementById("modalGestaltExplicacion").textContent = info.explicacion;
      document.getElementById("modalGestaltImagen").src = info.imagen;
      document.getElementById("modalGestaltImagen").alt = `Ejemplo de ${info.nombre}`;
      return true; // Indica que el modal debe abrirse
    }
    return false;
  });

  setupModal("alteracionModal", ".action-button-inline[data-modal-type]", (button) => {
    const type = button.dataset.modalType;
    return loadAlteracionContent(type); // loadAlteracionContent decidirá si se abre
  });


  // Acordeones
  document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", function() {
      playSound(sonidoClick);
      const content = this.nextElementSibling;
      const isActive = content.classList.toggle('active');
      
      // Cerrar otros acordeones en el mismo contenedor (padre del .accordion-item)
      if (isActive) {
          const parentContainer = this.closest('.stimulation-accordion'); // O la clase contenedora de los acordeones
          if (parentContainer) {
            parentContainer.querySelectorAll('.accordion-content.active').forEach(activeContent => {
              if (activeContent !== content) {
                  activeContent.classList.remove('active');
                  activeContent.style.maxHeight = null;
                  activeContent.style.paddingTop = "0";
                  activeContent.style.paddingBottom = "0";
              }
            });
          }
      }

      if (content.classList.contains('active')) {
        content.style.paddingTop = "1.5rem"; // Padding cuando está activo
        content.style.paddingBottom = "1.5rem";
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
        content.style.paddingTop = "0"; // Quitar padding al cerrar
        content.style.paddingBottom = "0";
      }
    });
    header.addEventListener("mouseenter", () => playSound(sonidoHover, 0.3));
  });
  
  // Sonidos para botones de acción y tabs
  document.querySelectorAll('.action-button, .tab-button').forEach(button => {
      button.addEventListener("mouseenter", () => playSound(sonidoHover, 0.3));
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
        const contentId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        showEvolutionContent(contentId, this);
    });
  });
}); // Fin de DOMContentLoaded


function setupModal(modalId, triggerSelector, contentSetterCallback) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const triggers = document.querySelectorAll(triggerSelector);
    const closeButton = modal.querySelector(`.close-button[data-modal-id="${modalId}"]`);

    triggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            if (contentSetterCallback(trigger)) { // Llama al callback para setear contenido
                modal.style.display = "block";
                playSound(sonidoClick);
            }
        });
    });

    if (closeButton) {
        closeButton.onclick = () => {
            modal.style.display = "none";
            playSound(sonidoClick);
        }
    }
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}


function loadAlteracionContent(type) {
    const tituloEl = document.getElementById("modalAlteracionTitulo");
    const contenidoEl = document.getElementById("modalAlteracionContenido");
    let titulo = "";
    let contenidoHTML = "";

    if (type === "auditiva") {
        titulo = "Ayudas y Comunicación en Deficiencia Auditiva";
        contenidoHTML = `
            <h4>Sistemas de Comunicación:</h4>
            <ul>
                <li><strong>Sistemas Bimodales:</strong> Usan palabra hablada y signos simultáneamente.</li>
                <li><strong>Palabra Complementada (Cued Speech):</strong> Gestos manuales cerca de la boca para clarificar fonemas visualmente similares en la lectura labial.</li>
                <li><strong>Dactilología:</strong> Deletreo manual de palabras, letra por letra.</li>
                <li><strong>Lectura Labiofacial:</strong> Interpretar el habla observando los movimientos de los labios y la expresión facial.</li>
                <li><strong>Lengua de Signos Española (LSE):</strong> Lengua completa con su propia gramática y vocabulario, usada por la comunidad sorda.</li>
            </ul>
            <h4>Ayudas Técnicas Principales:</h4>
            <ul>
                <li><strong>Audífonos:</strong> Amplifican los sonidos. Vitales para hipoacusias.</li>
                <li><strong>Implante Coclear:</strong> Dispositivo electrónico que estimula directamente el nervio auditivo. Para sorderas neurosensoriales profundas.</li>
                <li><strong>Sistemas de Frecuencia Modulada (FM):</strong> Micrófono para el hablante y receptor para el oyente, mejorando la señal de voz sobre el ruido de fondo. Útil en aulas.</li>
                <li><strong>Sistemas de Reconocimiento del Habla:</strong> Software que transcribe la voz a texto.</li>
                <li><strong>Ayudas para el Hogar:</strong> Timbres luminosos o vibratorios, despertadores vibratorios.</li>
                <li><strong>Comunicación a Distancia:</strong> SMS, videollamadas con intérprete o lectura labial, SVisual.</li>
                <li><strong>Accesibilidad en Medios:</strong> Subtitulado, intérpretes de LSE en TV.</li>
            </ul>
            <p><em>La elección de ayudas y sistemas depende del grado de pérdida, edad, y preferencias individuales.</em></p>
        `;
    } else if (type === "visual") {
        titulo = "Ayudas y Adaptaciones en Deficiencia Visual";
        contenidoHTML = `
            <h4>Sistemas de Lectoescritura:</h4>
            <ul>
                <li><strong>Sistema Braille:</strong> Sistema táctil de lectoescritura basado en 6 puntos en relieve. Esencial para personas ciegas.</li>
                <li><strong>Lectoescritura en Tinta Ampliada:</strong> Para personas con resto visual, usando caracteres grandes, buen contraste y espaciado.</li>
            </ul>
            <h4>Ayudas Técnicas:</h4>
            <ul>
                <li><strong>Ópticas:</strong> Gafas especiales, lupas (manuales, de pie, electrónicas), telescopios.</li>
                <li><strong>No Ópticas:</strong> Atriles, lámparas de buena iluminación, filtros de luz para reducir deslumbramiento, tiposcopios (guías de lectura).</li>
                <li><strong>Tecnológicas (Tiflotecnología):</strong>
                    <ul>
                        <li>Lectores de pantalla (JAWS, NVDA) que verbalizan el contenido del ordenador.</li>
                        <li>Software de magnificación de pantalla.</li>
                        <li>Líneas Braille (dispositivos que muestran texto del ordenador en Braille).</li>
                        <li>Escáneres con software OCR (Reconocimiento Óptico de Caracteres) para convertir texto impreso a digital/voz.</li>
                        <li>Agendas y teléfonos parlantes o con interfaces accesibles.</li>
                    </ul>
                </li>
                <li><strong>Para la Movilidad y Vida Diaria:</strong> Bastón blanco (largo, verde para baja visión), perros guía, aplicaciones de GPS adaptadas.</li>
            </ul>
            <p><em>Una buena iluminación, contrastes adecuados y organización del espacio son cruciales.</em></p>
        `;
    } else {
        return false; // No cargar modal si el tipo no es reconocido
    }

    tituloEl.textContent = titulo;
    contenidoEl.innerHTML = contenidoHTML;
    return true; // Indica que el modal debe abrirse
}
window.openAlteracionModal = loadAlteracionContent; // Hacer accesible desde HTML


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

// --- Funciones Globales (accesibles desde onclick en HTML) ---
window.iniciarSimuladorSensorial = function() {
    const resultadoDiv = document.getElementById("resultadoSimulacionSensorial");
    const edad = document.getElementById("sim-edad-sensorial").value;
    const nombreSimulado = "Peque Explorador Sensorial";

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

function playSound(audioElement, volume = 0.5) {
  if (audioElement && typeof audioElement.play === 'function') {
    audioElement.currentTime = 0; 
    audioElement.volume = volume;
    audioElement.play().catch(error => console.warn("Advertencia al reproducir sonido:", error.name, error.message)); // Usar warn para no ser tan intrusivo
  }
}