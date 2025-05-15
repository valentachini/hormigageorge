const TWITTER_USERNAME = "Georgeclimapron";

async function getTweets() {
  const tweetsContainer = document.getElementById("tweets");
  tweetsContainer.innerHTML = "<p>Actualizando...</p>";

  try {
    const res = await fetch(`https://corsproxy.io/?https://nitter.net/${TWITTER_USERNAME}`);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const tweets = [...doc.querySelectorAll(".timeline-item .tweet-content")]
      .slice(0, 2)
      .map(el => `<p>${el.textContent.trim()}</p>`)
      .join("");

    tweetsContainer.innerHTML = tweets || "<p>No se encontraron tweets.</p>";
  } catch (err) {
    tweetsContainer.innerHTML = "<p>Error al cargar tweets 😢</p>";
    console.error(err);
  }
}

getTweets();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Error al registrar SW:', err));
}