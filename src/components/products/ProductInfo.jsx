import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts} from "../../services/productService";



export const ProductInfo = ({storeInfo, productString}) => {

    console.log("value of props in productInfo", storeInfo, productString);

const [storeObject, setStoreObject] = useState('');
const [productName, setProductName] = useState(productString); // Directly use prop
const [storeId, setStoreId] = useState(parseInt(storeInfo.store_id)); // Directly use storeInfo
const [products, setProducts] = useState([]); // Products array


  useEffect(() => {
    const fetchData = async () => {
      if (productName && storeId) {
        // Ensure storeId isn't 0 and productName exists
        console.log("Fetching product info for:", productName, storeId);
        await getProductInfo(productName, storeId);
      }
    };
    
    fetchData(); // Call the async function
    
  }, [productString, storeId]); // Dependencies include productName and storeId


    // Keep track of when state actually changes for debugging purposes
    useEffect(() => {
        console.log("Products state updated:", products);
      }, [products]);

  const getProductInfo = async (productName, storeId) => {
    console.log("in getProductInfo what is productName and storeId", productName, storeId);
    
    const productResponse = await searchProducts(productName, parseInt(storeId)); // Await the result
    console.log("what is productResponse", productResponse);
    setProducts(productResponse); // Set products state after data is fetched
  };
    

// const getProductInfo = async (productName, storeId) => {
//     console.log("in getProductInfo what is productNae and storeId", productName, storeId)
//     // IF YOU HAPPENED TO CALL THIS WHEN DOING ON CHANGE FOR STORE NAME THEN THIS IS EVENT.TARGET.VALUE YOU WOULDG ET
//     // console.log("ID: ", event.target.id);    // Logs: st0re_name
//     // console.log("Value: ", event.target.value); // Logs: the value typed in by the user
//     searchProducts(productName, parseInt(storeId)).then((productResponse) => {
//         console.log("what is productResponse", productResponse);
//         setProducts(productResponse);
//     });
// }

return (

    <>
    <article>
       
      {products && products.length > 0 && (
        <section className="product-results">
          <h3>Product Results</h3>
          {products.map((product, index) => (
            <article key={index} className="product-item">
              <header>
                <h4>{product.name}</h4>
                <span>Price: {product.price}</span>
              </header>
              <section className="product-details">
                <p>tcin of product: {product.tcin}</p>
                <p>Rating: {product.rating}</p>
                <p>Type Of Item: {product.typeOfItem}</p>
                <p>Item Name: {product.itemName}</p>
                <p>Price: {product.price}</p>
                <p>Rating: {product.rating}</p>
              </section>
            </article>
          ))}
        </section>
      )}

    </article>
    </>




)





}