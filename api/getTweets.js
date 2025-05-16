export default async function handler(req, res) {
  const BEARER_TOKEN = process.env.TWITTER_BEARER;

  try {
    const userRes = await fetch("https://api.twitter.com/2/users/by/username/Georgeclimapron", {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });

    const userData = await userRes.json();
    const userId = userData.data?.id;

    if (!userId) {
      throw new Error("No se pudo obtener el ID del usuario.");
    }

    const tweetsRes = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=text`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });

    const tweetsData = await tweetsRes.json();
    const tweets = tweetsData.data?.map(t => t.text) || [];

    res.status(200).json({ tweets });
  } catch (err) {
    console.error("Error al obtener tweets:", err);
    res.status(500).json({ error: "No se pudo obtener el contenido" });
  }
}
