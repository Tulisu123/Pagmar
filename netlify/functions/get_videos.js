export async function handler(event, context) {
  const API_KEY = process.env.VITE_PEXELS_API_KEY;
  const NUMBER_OF_VIDEOS = 25;

  const response = await fetch(`https://api.pexels.com/videos/search?query=nature&per_page=${NUMBER_OF_VIDEOS}&size=medium&orientation=landscape`, {
    headers: {
      Authorization: API_KEY
    }
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data.videos),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  };
}
