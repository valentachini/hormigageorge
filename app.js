const TWITTER_USERNAME = "Georgeclimapron";

async function getTweets() {
  const tweetsContainer = document.getElementById("tweets");
  tweetsContainer.innerHTML = "<p>Actualizando...</p>";

  try {
    const url = "/api/getTweets";
    console.log("Fetching from backend:", url);

    const res = await fetch(url);
    const text = await res.text();

    console.log("HTML recibido:");
    console.log(text.slice(0, 1000));

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const tweetNodes = [...doc.querySelectorAll(".tweet-content")];
    console.log(`Tweets encontrados: ${tweetNodes.length}`);

    const tweets = tweetNodes
      .slice(0, 2)
      .map(el => `<p>${el.textContent.trim()}</p>`)
      .join("");

    tweetsContainer.innerHTML = tweets || "<p>No se encontraron tweets.</p>";
  } catch (err) {
    tweetsContainer.innerHTML = "<p>Error al cargar tweets 😢</p>";
    console.error("Error capturado:", err);
  }
}


getTweets();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.error('Error al registrar SW:', err));
}