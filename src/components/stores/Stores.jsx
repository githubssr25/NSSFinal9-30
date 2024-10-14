

import { useState, useEffect } from 'react';
import { fetchNearbyStores } from "../../services/storesService"; // Import the service function
import {ProductInfo} from "../products/ProductInfo"


export const Stores = () => {
  const [zipCode, setZipCode] = useState(""); // Store user input zip code
  const [storeData, setStoreData] = useState([]); // Store the API response
  const [productString, setProductString] = useState('');

  const handleFetchStores = async () => {
    console.log("whati s value of productString right after setting it", productString);
    const storesResponse = await fetchNearbyStores(parseInt(zipCode)); // Call service function
    if (storesResponse) {
      console.log(
        "what is value of storesResponse and data right after getting response from fetchNearbyStores",
        storesResponse,
        storesResponse.data
      );
      if (storesResponse.data && storesResponse.data.nearby_stores) {
        const ourStores = storesResponse.data.nearby_stores.stores; // Extract the stores array
        console.log("Stores data after extraction", ourStores);
        setStoreData(ourStores); // Set the state to the extracted stores array
      }
    }
  };


  return (
    <div>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label 
        htmlFor="zipCodeInput" 
        style={{ fontSize: "1.2rem" }}
      >
        Enter ZIP Code:
      </label>
      <input
        id="zipCodeInput"
        type="text"
        placeholder="e.g., 12345"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center" }}>
      <label htmlFor="productInput" style={{ fontSize: "1.2rem" }}>
        Search For Specific Product
      </label>
      <input
        id="productInput"
        type="text"
        placeholder="e.g., Ice Cream"
        value={productString}
        onChange={(e) => setProductString(e.target.value)}
      />
    </div>

    {/* Conditionally render the button only if both fields have values */}
    {zipCode && productString && (
      <button onClick={handleFetchStores}>Search Stores and Products</button>
    )}

    {storeData.length > 0 && (
      <div>
        <h3>Nearby Stores:</h3>
        <ul>
          {storeData.map((store, index) => (
            <li key={index}>
              StoreID: {parseInt(store.store_id)} Location: {store.location_name} Phone Number: {store.main_voice_phone_number}
            </li>
          ))}
        </ul>
      </div>
    )}

      {storeData.length > 0 && productString && (
        <div>
          <h3>Stores.jsx rendering</h3>
          <ul>
            {storeData.map((store, index) => (
              <li key={index}>
                <ProductInfo storeInfo={store} productString={productString} />
              
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

  //this is data structure btw
  //{data: {
  // nearby_stores: {
  //   stores: Array(20),
  //   count: 20
  // }}}

//    <h3>Nearby Stores:</h3>
{/* <ul>
{storeData.map((store, index) => (
  <li key={index}>
    StoreID: {parseInt(store.store_id)} Location:{" "}
    {store.location_name} Phone Number:{" "}
    {store.main_voice_phone_number}
  </li>
))}
</ul> */}