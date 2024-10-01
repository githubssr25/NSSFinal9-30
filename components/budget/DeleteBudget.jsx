

import { useState, useEffect } from 'react';
import { getBudgetsByUserId} from '../../services/BudgetService'; // Assuming you already have deleteBudgetById function

export const DeleteBudget = () => {
    const user = JSON.parse(localStorage.getItem("NSSProject_user"));
    const customerId = user?.id; // This retrieves the customerId if the user is logged in

    // Define the states you'll need
    const [budgets, setBudgets] = useState([]);

    // Fetch budgets on component mount
    useEffect(() => {
        getBudgetsByUserId(customerId).then((data) => {
            setBudgets(data); // Set the fetched budgets in state
        });
    }, [customerId]);

    return (
        <>
            <h1>Delete Budget</h1>
            <div className="budget-grid"> {/* Flexbox container */}
                <section className="budget-section">
                    <article>
                        <h2>Budget 1</h2>
                        <p>Category: Groceries</p>
                        <p>Allocated Amount: $500</p>
                        <button>Delete</button>
                    </article>
                </section>
    
                <section className="budget-section">
                    <article>
                        <h2>Budget 2</h2>
                        <p>Category: Rent</p>
                        <p>Allocated Amount: $1200</p>
                        <button>Delete</button>
                    </article>
                </section>
            </div>
        </>
    );

};
