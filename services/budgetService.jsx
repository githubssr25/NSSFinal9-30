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

export const getBudgetsByUserId = async(userId) => {
    return fetch(`http://localhost:8088/budgets?userId=${userId}&_expand=user&_expand=category`)
    .then((response) => response.json())
}

// need to specify which budget you are updating
export const enterMoneySpentForBudget = async (budget) => {
    return fetch(`http://localhost:8088/budgets/${budget.id}`, {
        method: "PUT",
        headers: {
            "content-Type" : "application/json",
        },
        body: JSON.stringify(budget),
    }).then((res) => res.json());
}

export const editBudget = async (budget) => {
    return fetch(`http://localhost:8088/budgets/${parseInt(budget.id)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(budget),
    }).then((res) => res.json());
}


//If the foreign key in your budgets table is userId, you would typically expand it using _expand=user.
// Similarly, for categoryId, you would use _expand=category.
// Even though your database calls them users and categories, the _expand works with the
// singular form of the model when expanding foreign keys.