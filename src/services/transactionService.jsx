
export const getTransactionsByUserId = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8088/transactions?userId=${userId}&_expand=budget&_expand=category`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return await response.json();
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
};
