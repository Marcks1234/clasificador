// Ruta hacia la carpeta con los archivos de Teachable Machine
const MODEL_URL = "./modelos_ia/";

let model, maxPredictions;

// Inicializa y carga el modelo de Inteligencia Artificial
async function init() {
  const statusElement = document.getElementById("status-message");
  
  try {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    statusElement.innerText = "Modelo cargado y listo para clasificar.";
    statusElement.style.color = "#27ae60";
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
    statusElement.innerText = "Error al cargar los archivos del modelo.";
    statusElement.style.color = "#e74c3c";
  }
}

// Procesa la imagen seleccionada y ejecuta la predicción
async function predictImage(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  if (!model) await init();

  const imgElement = document.getElementById("preview");
  imgElement.src = URL.createObjectURL(files[0]);
  imgElement.style.display = "block";

  imgElement.onload = async () => {
    const prediction = await model.predict(imgElement);
    const container = document.getElementById("label-container");
    container.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
      const className = prediction[i].className;
      const porcentaje = (prediction[i].probability * 100).toFixed(2);

      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `<span>${className}</span> <span>${porcentaje}%</span>`;
      container.appendChild(div);
    }
  };
}

// Cargar el modelo automáticamente al iniciar la página
window.addEventListener("DOMContentLoaded", init);