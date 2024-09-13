export async function getPostData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/post`, {
      next: { tags: ["posts"] },
    });
    return res.json();
  }

  