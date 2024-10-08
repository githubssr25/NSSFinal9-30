const apiKey = import.meta.env.VITE_API_KEY; // Ensure the API key is correct

export const fetchNearbyStores = async (zipCode) => {
  const url = `/api/nearby_stores?place=${zipCode}&limit=1`; // Use 'place' and 'limit' as in the curl

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-rapidapi-host': 'target-com-shopping-api.p.rapidapi.com', // Ensure both required headers are set
        'x-rapidapi-key': apiKey, // API key
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Error: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.error("Error fetching nearby stores:", error);
    return null; // Handle error gracefully
  }
};


//export const fetchNearbyStores = async (zipCode) => {
//   const url = `/api/nearby_stores?place=${zipCode}&limit=20`;

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'accept': 'application/json',
//         'x-rapidapi-host': 'target-com-shopping-api.p.rapidapi.com',
//         'x-rapidapi-key': apiKey,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("whatis the data we get back", data);
//     const firstStore = data[0]; // First store for "limit=1"
//     const allStores = data.slice(0, 20); // All stores for "limit=20"
//     console.log("just to see the 20 stores", allStores);
    
//     return {
//       firstStore
//     };
//   } catch (error) {
//     console.error("Error fetching nearby stores:", error);
//     return null;
//   }
// };