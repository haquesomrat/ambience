export async function getFAQData() {
  try {
    const res = await fetch(`/api/faq`, {
      next: { tags: ["faq"] },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}