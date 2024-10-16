const apiKey = import.meta.env.VITE_API_KEY; // Ensure API key is loaded from .env

export const searchProducts = async (keyword, storeId, count = 25) => {
  const formattedKeyword = keyword.replace(/\s/g, '%20'); // Manually replace spaces
  console.log("within searchProducts what is value of keyword before we search", keyword, formattedKeyword);
  const url = `https://target-com-shopping-api.p.rapidapi.com/product_search?store_id=${storeId}&keyword=${formattedKeyword}&count=${count}`;


  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-rapidapi-host': 'target-com-shopping-api.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Error: ${response.status} - ${errorDetails}`);
    }

    const resp = await response.json();

    console.log("whati s resp right as we get it back for searchProducts and what was formattedKeyword", resp, formattedKeyword);
    
    // Extract price, location_id, and average rating for each product


    const productResponseBack = resp.data.search.products.map(product => ({
      tcin: product.tcin,
      typeOfItem: product.item.product_classification.item_type.name,
      itemName: product.item.product_description.title,
      price: product.price.current_retail,  // Use the child product's price
      location_id: product.price.location_id,  // Location of the price
      rating: product.ratings_and_reviews?.statistics?.rating?.average || "N/A"  // Rating, if available
    }));

    console.log("is our productResponseBack right after we change it before returning", productResponseBack);

    return productResponseBack;
  } catch (error) {
    console.error("Error searching products:", error);
    return null;
  }
};

// data:search:search_suggestions:
// 0:"womens casual shoes"
// 1:"womens shoes flats"
// 2:"womens shoes sneakers"
// 3:"womens dress shoes"
// 4:"womens shoes slides"
// 5:"womens heels shoes"
// search_recommendations:
// search_response:facet_list:
// visual_facet_list:
// metadata:
// typed_metadata:
// sort_options:
// products:0:
// __typename:"ProductSummary"
// tcin:"85211271"
// original_tcin:"85211271"
// item:
// parent:
// promotions:
// price:
// formatted_current_price:"$29.99"
// formatted_current_price_type:"reg"
// location_id:3991