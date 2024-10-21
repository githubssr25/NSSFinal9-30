
export const getAllCategories = async () => {
    return fetch(`http://localhost:8089/categories`)
    .then((res) => res.json());
}