export async function getSliderData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/slider`, {
      next: { tags: ["slider"] },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
  
    return res.json();
  }