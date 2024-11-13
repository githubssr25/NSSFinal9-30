import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTransactionsByUserId } from "../../services/transactionService";

export const TransactionHistory = () => {
    const { userId } = useParams();
    const [groupedTransactions, setGroupedTransactions] = useState({});

    useEffect(() => {
        getTransactionsByUserId(userId).then((data) => {
            const transactionsByBudget = data.reduce((acc, transaction) => {
                const budgetId = transaction.budgetId;
                if (!acc[budgetId]) {
                    acc[budgetId] = [];
                }
                acc[budgetId].push(transaction);
                return acc;
            }, {});
            setGroupedTransactions(transactionsByBudget);
        });
    }, [userId]);

    return (
        <div>
            <h2>Transaction History</h2>
            {Object.keys(groupedTransactions).map((budgetId) => (
                <div key={budgetId} className="budget-section">
                    <h3>Budget Name: {groupedTransactions[budgetId][0]?.budget?.budget_name || "Unnamed Budget"}</h3>
                    <ul>
                        {groupedTransactions[budgetId].map((transaction) => (
                            <li key={transaction.id}>
                                <p><strong>Date:</strong> {transaction.transaction_date}</p>
                                <p><strong>Category:</strong> {transaction.category?.category_description || "No Category"}</p>
                                <p><strong>Amount:</strong> ${transaction.amount}</p>
                                <p><strong>Description:</strong> {transaction.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
