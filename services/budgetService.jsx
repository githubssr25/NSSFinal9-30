export const getCategories = async () => {
    const response = await fetch("http://localhost:8088/categories");
    return response.json();
};

export const createBudget = async (budget) => {
    const response = await fetch("http://localhost:8088/budgets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(budget)
    });
    return response.json();
};