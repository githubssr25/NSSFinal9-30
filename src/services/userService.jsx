

export const getUserByEmail = async (email) => {
    return fetch(`http://localhost:8088/users?email=${email}`)
    .then((res) => res.json());
}

export const createUser = async (newUser) => {
    const response = await fetch("http://localhost:8088/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });
    const createdUser = await response.json();
    return createdUser;
  };