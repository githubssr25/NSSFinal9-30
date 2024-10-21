export const getCategories = async () => {
    const response = await fetch("http://localhost:8089/categories");
    return response.json();
};

export const createBudget = async (budget) => {
    const response = await fetch("http://localhost:8089/budgets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(budget)
    });
    return response.json();
};

export const getBudgetsByUserId = async(userId) => {
    return fetch(`http://localhost:8089/budgets?userId=${userId}&_expand=user&_expand=category`)
    .then((response) => response.json())
}


export const enterMoneySpentForBudget = async (budget) => {
    return fetch(`http://localhost:8089/budgets/${budget.id}`, {
        method: "PUT",
        headers: {
            "content-Type" : "application/json",
        },
        body: JSON.stringify(budget),
    }).then((res) => res.json());
}

export const editBudget = async (budget) => {
    return fetch(`http://localhost:8089/budgets/${parseInt(budget.id)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(budget),
    }).then((res) => res.json());
}

export const deleteBudgetById = async (budgetId) => {
    return fetch(`http://localhost:8089/budgets/${budgetId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => response.ok);  
};

