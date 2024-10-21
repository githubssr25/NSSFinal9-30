import { useState, useEffect } from "react";
import "./AddNewBudget.css"; 

import { createBudget, getCategories } from "../../services/BudgetService"; 

export const AddNewBudget = () => {

    const user = JSON.parse(localStorage.getItem("NSSProject_user"));
    const customerId = user?.id; // This retrieves the customerId if the user is logged in

    const [categories, setCategories] = useState([]);  
    const [newBudget, setNewBudget] = useState({});
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");  
        useEffect(() => {
            getCategories().then((data) => {
                setCategories(data);  // Set the fetched categories in state
            });
        }, []);

const addBudget = async () => {
    const budgetItem = {
        userId: customerId,
        categoryId: selectedCategoryId,
        allocated_amount: newBudget.allocated_amount,
        spent_amount: 0,
        remaining_balance: newBudget.allocated_amount,
        days_left: newBudget.days_left,
        budget_name: newBudget.budget_name
    }
    createBudget(budgetItem).then((data) => {
        if(data && data.id) {
            console.log("budget created successfully", data);
            setNewBudget(data);
            setSuccessfulCreation(true);
        } else {
            console.log("error: budge creation failed");        
        }

    })
}

const handleSubmit = async (event) => {
    event.preventDefault(); 
    addBudget();
}

const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);  // Update state with selected category ID
};


const updateBudget = (event) => {
    const copy = {...newBudget};
    copy[event.target.id] = event.target.value;
    setNewBudget(copy);
}

    return (
      <main>
        <h2> Create New Budget </h2>
        <form className = "flex-form" onSubmit={handleSubmit}>
          <label> choose a category for the budget you are creating</label>
            <select name="categoryId" 
            value={selectedCategoryId} 
            onChange={handleCategoryChange}
            required>
              <optgroup label="Categories">
              {categories.map((category) => {
                return (
                <option  key={category.id} value={category.id}>  {category.category_description} </option>
                );
             })}
              </optgroup>
            </select>
    
            <fieldset className="allocatedAndBudgetName">
                <input
                onChange = {updateBudget}
                type="number"
                id="allocated_amount"
                placeholder="What is the allocated amount for this"
                required
                />
                 <input
                onChange = {updateBudget}
                type="text"
                id="budget_name"
                placeholder="What is the budget name for this"
                required
                />
            </fieldset>
            <fieldset className="daysLeft">
                 <input
                 onChange = {updateBudget}
                 type="number"
                 id="days_left"
                 placeholder="How many days is this budget for"
                 required
                 />
             </fieldset>
             <button type="submit">Create Budget</button>  
        </form>
        { successfulCreation && (
            <section>
                <label> Your new successfully created budget</label>
                <ul>
                    {Object.entries(newBudget).map(([key, value], index) => {
                        if(key === "categoryId") {
                            const category = categories.find(cat => parseInt(cat.id) === parseInt(value));
                            return (
                                <li key={index}>
                                     Category: {category ? category.category_description : "Unknown Category"}
                                </li>
                            )
                        }
                        if(key === "allocated_amount" || key==="budget_name" || key === "days_left"){
                            return (
                                <li key={index}>
                                    <ul> {key} : {value} </ul>
                                </li>
                            )
                        }

                    
                        return null; 
                      
                    })}
                </ul>
            </section>

        )

        }
      </main>
    );
}