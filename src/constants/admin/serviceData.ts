export async function getServiceData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/service`, 
      { next:{tags:["service"]}}
    )
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }