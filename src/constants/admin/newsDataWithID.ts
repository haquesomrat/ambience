import { getNewsData } from "./newsData";

export async function getNewsDataWithId(id: string) {
  const news = await getNewsData(id);// Fetch news data from your data source

  // Move the date manipulation to the server-side
  const dateObj = new Date(news.time);
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // Ensure month has leading zero
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes}`;

  return {
    ...news,
    formattedDate,
    formattedTime,
  };
}