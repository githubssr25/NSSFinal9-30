

export const getUserByEmail = async (email) => {
    return fetch(`http://localhost:8088/users?email=${email}`)
    .then((res) => res.json());
}