let georgeAwake = false;

const refreshButton = document.getElementById("refresh");
const powerButton = document.getElementById("power");
const tweetsContainer = document.getElementById("tweets");
const antIcon = document.getElementById("antIcon");
const zzz = document.getElementById("zzz");

async function getTweets() {
  if (!tweetsContainer || !georgeAwake) return;

  tweetsContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
      <span>Invocando a George...</span>
      <span class="spinner" style="width: 1em; height: 1em; border: 2px solid #ccc; border-top: 2px solid #333; border-radius: 50%; animation: spin 0.7s linear infinite;"></span>
    </div>
  `;

  try {
    const res = await fetch("/api/getTweets");
    const data = await res.json();

    console.log("Tweets recibidos:", data);

    if (data.tweetsData?.status === 429) {
      tweetsContainer.innerHTML = "<p>🙃 Twitter dice: ¡Calmate, Hormi! Esperá un poco.</p>";
      return;
    }

    if (!data.tweets || data.tweets.length === 0) {
      throw new Error("No se encontraron tweets");
    }

    const tweetsHTML = data.tweets
      .slice(0, 2)
      .map(t => `<p>${t}</p>`)
      .join("");

    tweetsContainer.innerHTML = tweetsHTML;
  } catch (err) {
    tweetsContainer.innerHTML = "<p>Error al cargar tweets 😢</p>";
    console.error("Error:", err);
  }
}

if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    if (!georgeAwake) return;

    refreshButton.disabled = true;
    refreshButton.innerText = "Actualizando...";

    getTweets().finally(() => {
      setTimeout(() => {
        refreshButton.disabled = false;
        refreshButton.innerText = "Actualizar";
      }, 10000);
    });
  });
}

if (powerButton) {
  powerButton.addEventListener("click", () => {
    georgeAwake = !georgeAwake;

    powerButton.innerText = georgeAwake ? "Apagar a George" : "Despertar a George";
    refreshButton.disabled = !georgeAwake;

    tweetsContainer.style.display = georgeAwake ? "block" : "none";

    if (georgeAwake) {
      antIcon.classList.add("walking");
      zzz.classList.remove("active");
      getTweets();
    } else {
      antIcon.classList.remove("walking");
      zzz.classList.add("active");
      tweetsContainer.style.display = "none";
    }
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Error al registrar SW:', err));
}
