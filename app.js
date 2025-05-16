async function getTweets() {
  const tweetsContainer = document.getElementById("tweets");

  if (!tweetsContainer) {
    console.warn("Contenedor de tweets no encontrado.");
    return;
  }

  tweetsContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
      <span>Actualizando...</span>
      <span class="spinner" style="width: 1em; height: 1em; border: 2px solid #ccc; border-top: 2px solid #333; border-radius: 50%; animation: spin 0.7s linear infinite;"></span>
    </div>
  `;

  try {
    const res = await fetch("/api/getTweets");
    const data = await res.json();

    console.log("Tweets recibidos:", data);

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

// Ejecutar al cargar
getTweets();

// Botón inteligente con delay
const refreshButton = document.getElementById("refresh");

if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    refreshButton.disabled = true;
    refreshButton.innerText = "Actualizando... 🔄";

    getTweets().finally(() => {
      setTimeout(() => {
        refreshButton.disabled = false;
        refreshButton.innerText = "Actualizar";
      }, 10000); 
    });
  });
} else {
  console.warn("Botón #refresh no encontrado.");
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Error al registrar SW:', err));
}
