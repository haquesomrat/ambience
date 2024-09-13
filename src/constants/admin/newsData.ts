export async function getNewsData(id:string = "") {
    try {
      const res = await fetch(
        `/api/news/${id}`,
        {
          next: { tags: ["news"] },
        }
      );
      // The return value is *not* serialized
      // You can return Date, Map, Set, etc.
  
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
      }
  
      return res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  