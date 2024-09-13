export async function getAboutData() {
    try {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/about`,
        {
          next: { tags: ["about"] },
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