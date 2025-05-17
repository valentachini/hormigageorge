let georgeAwake = false;

const refreshButton = document.getElementById("refresh");
const powerButton = document.getElementById("power");
const tweetsContainer = document.getElementById("tweets");
const antIcon = document.getElementById("antIcon"); 
const zzz = document.getElementById("zzz");

zzz.classList.remove("hidden");
tweetsContainer.style.display = "none";

async function getTweets() {
  if (!tweetsContainer || !georgeAwake) return;

  tweetsContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
      <span>Invocando a George...</span>
      <span class="spinner"></span>
    </div>
  `;

  try {
    const res = await fetch("/api/getTweets");
    const data = await res.json();

    if (data.tweetsData?.status === 429) {
      tweetsContainer.innerHTML = "<p>🙃 Twitter dice: ¡Calmate, Hormi! Esperá un poco.</p>";
      return;
    }

    if (!data.tweets || data.tweets.length === 0) {
      throw new Error("No se encontraron tweets");
    }
    function formatTweet(text) {
    const formatted = text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    return formatted;
}
    const tweetsHTML = data.tweets
      .slice(0, 2)
      .map(t => `<p>${formatTweet(t)}</p>`)
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

    powerButton.innerText = georgeAwake ? "Apagar a George" : "Encender a George";
    refreshButton.disabled = !georgeAwake;

    if (georgeAwake) {
      zzz.classList.add("hidden");
      antIcon?.classList.add("walking");
      tweetsContainer.style.display = "block";
      getTweets();
    } else {
      zzz.classList.remove("hidden");
      antIcon?.classList.remove("walking");
      tweetsContainer.style.display = "none";
    }
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Error al registrar SW:', err));
}
