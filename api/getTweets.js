export default async function handler(req, res) {
  const TWITTER_USERNAME = "Georgeclimapron";
  const url = `https://nitter.poast.org/${TWITTER_USERNAME}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();
    res.status(200).send(html);
  } catch (err) {
    console.error("Error al obtener tweets:", err);
    res.status(500).json({ error: "No se pudo obtener el contenido" });
  }
}
