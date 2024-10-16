import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts} from "../../services/productService";
import "./ProductInfo.css"; // Import CSS file


export const ProductInfo = ({storeInfo, productString}) => {

    console.log("value of props in productInfo", storeInfo, productString);

const [storeObject, setStoreObject] = useState('');
const [storeId, setStoreId] = useState(parseInt(storeInfo.store_id)); // Directly use storeInfo
const [products, setProducts] = useState([]); // Products array

useEffect(() => {
  const fetchData = async () => {
    if (productString && storeId) {
      console.log("Fetching product info for:", productString, storeId);
      await getProductInfo(productString, storeId);  // Use productString directly
    }
  };
    fetchData(); // Call the async function
  }, [productString, storeId]); // Dependencies include productName and storeId


    // Keep track of when state actually changes for debugging purposes
    useEffect(() => {
        console.log("Products state updated:", products);
      }, [products]);

      const getProductInfo = async (searchQuery, storeId) => {
        console.log("In getProductInfo, query and storeId:", searchQuery, storeId);
        
        const productResponse = await searchProducts(searchQuery, storeId);
        console.log("Product response:", productResponse);
        setProducts(productResponse);  // Update products with fetched data
      };
    

// const getProductInfo = async (productName, storeId) => {
//     console.log("in getProductInfo what is productNae and storeId", productName, storeId)
//     IF YOU HAPPENED TO CALL THIS WHEN DOING ON CHANGE FOR STORE NAME THEN THIS IS EVENT.TARGET.VALUE YOU WOULDG ET
//     console.log("ID: ", event.target.id);    // Logs: st0re_name
//     console.log("Value: ", event.target.value); // Logs: the value typed in by the user
//     searchProducts(productName, parseInt(storeId)).then((productResponse) => {
//         console.log("what is productResponse", productResponse);
//         setProducts(productResponse);
//     });
// }

return (
  <article className="product-container">
    {products.length > 0 ? (
      <section className="product-results">
        <h3 className="results-heading">Product Results</h3>
        <div className="product-grid">
          {products.map((product, index) => (
            <div key={product.tcin} className="product-card">
              <h4 className="product-title">{product.itemName}</h4>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Rating:</strong> {product.rating}</p>
              <p><strong>Item Type:</strong> {product.typeOfItem}</p>
              <p><strong>TCIN:</strong> {product.tcin}</p>
            </div>
          ))}
        </div>
      </section>
    ) : (
      <p className="no-results">No products found. Try a different search!</p>
    )}
  </article>
);
};