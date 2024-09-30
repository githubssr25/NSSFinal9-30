

export const getUserByEmail = async (email) => {
    const response = await fetch(`http://localhost:8088/users?email=${email}`);
    const users = await response.json();
    return users; // this will be an array of users that matches the email 
}