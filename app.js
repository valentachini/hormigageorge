async function getTweets() {
  const tweetsContainer = document.getElementById("tweets");
  tweetsContainer.innerHTML = "<p>Actualizando...</p>";

  try {
    const res = await fetch("/api/getTweets");
    const data = await res.json();

    console.log("🧠 Tweets recibidos:", data);

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
    console.error("❌ Error:", err);
  }
}

getTweets();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Error al registrar SW:', err));
}
