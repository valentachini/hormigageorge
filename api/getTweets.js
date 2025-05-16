export default async function handler(req, res) {
  const BEARER_TOKEN = process.env.TWITTER_BEARER;

  console.log("¿Token disponible?", !!BEARER_TOKEN);

  if (!BEARER_TOKEN || !BEARER_TOKEN.startsWith("AAAAAAAA")) {
    console.error("TWITTER_BEARER no está definido o es inválido");
    return res.status(500).json({
      error: "Token no disponible o malformado"
    });
  }

  try {
    
    const userRes = await fetch("https://api.twitter.com/2/users/by/username/Georgeclimapron", {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });

    const userData = await userRes.json();
    console.log("👤 Respuesta de Twitter (usuario):", userData);

    const userId = userData.data?.id;

    if (!userId) {
      return res.status(500).json({
        error: "No se pudo obtener el ID del usuario",
        userData
      });
    }

    
    const tweetsRes = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=text&exclude=replies`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });

    const tweetsData = await tweetsRes.json();
    console.log("Respuesta de Twitter (tweets):", tweetsData);

    const tweets = tweetsData.data?.map(t => t.text) || [];

    if (tweets.length === 0) {
      return res.status(500).json({
        error: "No se encontraron tweets",
        tweetsData
      });
    }

    return res.status(200).json({ tweets });

  } catch (err) {
    console.error("ERROR capturado:", err);

    return res.status(500).json({
      error: "Fallo al obtener tweets",
      details: err.message || "Sin mensaje",
      stack: err.stack || "Sin stack"
    });
  }
}
