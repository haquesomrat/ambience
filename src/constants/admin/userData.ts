import { revalidateUser } from "../revalidate/route";

export async function getUserData() {
revalidateUser()
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/user`,{
      next:{tags:['user']}
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; 
  }
  }