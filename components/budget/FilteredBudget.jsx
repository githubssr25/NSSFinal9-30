import { useEffect, useState } from 'react';
import './FilteredBudget.css'; 

export const FilteredBudget = ({filterTerm, userId, budgets}) => {
const [budgetDisplayed, setBudgetDisplayed] = useState([]);

useEffect(() => {
   const data = filterFunction(filterTerm, budgets);
   if(data){
    setBudgetDisplayed(data);
   }
}, [filterTerm, budgetDisplayed]);

//.map() is for transforming data — it always returns an array of the same length as the original array.
// so dont use a map here we arent transforming data were just filtering it 

//.some(): It checks if at least one element in an array passes the condition. It returns true or false.
// If you're only interested in knowing whether any element matches, use .some().
// .includes(): It checks if an array contains a specific element. It works great when you're dealing with strings and arrays,
//  but it's not designed to handle complex objects or iterate over values.


const filterFunction = (filterTerm, budgets) => {

    const searchTerm = String(filterTerm).toLowerCase();

const ourFilteredValue = budgets.filter((budget) => {

    // const keys = Object.keys(budget);
    const values = Object.values(budget);

    const matchingValues = values.filter((eachValue) => {
        if (eachValue != null) {
            return String(eachValue).toLowerCase().includes(searchTerm);
        }
        return false;
     });

//NOTE COULD ALSO DO THIS 
  // Check if any value matches the search term
//   const hasMatch = values.some((eachValue) => {
//     return String(eachValue).toLowerCase().includes(searchTerm); searchTerm is compared in lowercase
// });

    // If any value matched, we keep this budget in the outer filter
    return matchingValues.length > 0;
});
// THIS IS HOW YOU SET UP FILTERS AND THEIR RETURNS 


//Object.entries(obj).forEach(([key, value]) => {
    // console.log(`Key: ${key}, Value: ${value}`);

return ourFilteredValue;
}


return (
    <div>
        <h1> Your Filtered Budgets </h1>
        {budgetDisplayed.length > 0 && (
            <table>
                <thead>
                    <tr>
                        <th> Budget Name </th>
                        <th> Category </th>
                        <th> Allocated Amount </th>
                        <th> Amount Spent So Far </th>
                        <th> Remaining Balance </th>
                        <th> Days Left Of Budget </th> 
                    </tr>
                </thead>
                <tbody>
                    {budgetDisplayed.map((budget, index) => (
                        <tr key={index}>
                            <td> {budget.budget_name}</td>
                            <td> {budget.category ? budget.category.category_description : "Unknown"}</td>
                            <td> {budget.allocated_amount} </td>
                            <td> {budget.spent_amount} </td>
                            <td> {budget.remaining_balance} </td>
                            <td> {budget.days_left} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);

}