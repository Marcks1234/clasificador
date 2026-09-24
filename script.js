const MODEL_URL = "./modelos_ia/";
let model, maxPredictions;

async function init() {
  const statusBadge = document.getElementById("status-badge");
  
  try {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    statusBadge.innerText = "Modelo listo";
    statusBadge.classList.add("ready");
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
    statusBadge.innerText = "Error al cargar";
    statusBadge.classList.add("error");
  }
}

async function predictImage(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  if (!model) await init();

  const imgElement = document.getElementById("preview");

  imgElement.onload = async () => {
    const prediction = await model.predict(imgElement);
    const container = document.getElementById("label-container");
    container.innerHTML = "";

    // Ordenar resultados de mayor a menor probabilidad
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
      const className = prediction[i].className;
      const porcentaje = (prediction[i].probability * 100).toFixed(1);

      const item = document.createElement("div");
      item.className = "result-item";
      item.innerHTML = `
        <div class="result-header">
          <span class="class-name">${className}</span>
          <span class="percentage">${porcentaje}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${porcentaje}%"></div>
        </div>
      `;
      container.appendChild(item);
    }
  };

  imgElement.src = URL.createObjectURL(files[0]);
  imgElement.style.display = "block";

  event.target.value = "";
}

window.addEventListener("DOMContentLoaded", init);