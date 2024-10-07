import { useEffect, useState } from 'react';
import {FilteredBudget} from "./FilteredBudget";
import { getBudgetsByUserId } from "../../services/BudgetService"; // Adjust path as needed
import './ViewAllBudgets.css'; // Import the CSS file

export const ViewAllBudgets = () => {
  const user = JSON.parse(localStorage.getItem("NSSProject_user"));
  const customerId = user?.id;

  const [budgets, setBudgets] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');

 // Console log for user and customerId
  console.log('User:', user);
  console.log('Customer ID:', customerId);

  useEffect(() => {
    if (customerId) {
      getBudgetsByUserId(customerId).then((data) => {
        // Log data retrieved from the service
        console.log('Budgets fetched:', data);
        setBudgets(data);
      }).catch((error) => {
        // Log if there's an error fetching the data
        console.error('Error fetching budgets:', error);
      });
    } else {
      console.warn('No customerId found, skipping budget fetch');
    }
  }, [customerId]);


  //wrong 
  // const categoryBasedBudgets = () => {
 
  //   let initialAccumulator = {
  //     category: {},
  //     overallAllocated: 0,
  //     overallSpent: 0,
  //     overallRemaining: 0
  //   }

  //   budgets.reduce((acc, indBudget) => {
  //     const thisObjAmount = indBudget.allocated_amount
  //     const thisObjSpent = indBudget.spent_amount
  //     const thisObjBalance = indBudget.remaining_balance

  //     if(!acc[indBudget.categoryId]){
  //       acc[indBudget.categoryId] = {
  //         category: indBudget.category,
  //         category_description: indBudget.category.category_description,
  //         allocated_amount: thisObjAmount,
  //         spent_amount: thisObjSpent,
  //         remaining_balance: thisObjBalance
  //       },
  //       acc.overallAllocated += thisObjAmount,
  //       acc.overallSpent+= thisObjSpent,
  //       acc.overallRemaining+= thisObjBalance
  //     } else (acc[indBudget.categoryId]){
  //     acc[indBudget.categoryId] = {
  //       category: indBudget.category,
  //       category_description: indBudget.category.category_description,
  //       allocated_amount: acc[indBudget.categoryId].allocated_amount + thisObjAmount,
  //       spent_amount: acc[indBudget.categoryId].spent_amount +thisObjSpent,
  //       remaining_balance: acc[indBudget.categoryId].remaining_balance + thisObjBalance
  //     },
  //     acc.overallAllocated += thisObjAmount,
  //     acc.overallSpent+= thisObjSpent,
  //     acc.overallRemaining+= thisObjBalance
  //   }

  //     return acc;

  //   }, initialAccumulator)
  // }

  //this is right way but we dont need it so i will keep it like this 
  // const categoryBasedBudgets = () => {

  //   let initialAccumulator = {
  //     overallAllocated: 0,
  //     overallSpent: 0,
  //     overallRemaining: 0
  //   };
  
  //   budgets.reduce((acc, indBudget) => {
  //     const thisObjAmount = indBudget.allocated_amount;
  //     const thisObjSpent = indBudget.spent_amount;
  //     const thisObjBalance = indBudget.remaining_balance;
  
  //     // Check if the categoryId exists in the accumulator
  //     if (!acc[indBudget.categoryId]) {
  //       acc[indBudget.categoryId] = {
  //         category: indBudget.category,
  //         category_description: indBudget.category.category_description,
  //         allocated_amount: 0,  // Initialize at 0
  //         spent_amount: 0,       // Initialize at 0
  //         remaining_balance: 0    // Initialize at 0
  //       };
  //     }
  
  //     // Update category values
  //     acc[indBudget.categoryId].allocated_amount += thisObjAmount;
  //     acc[indBudget.categoryId].spent_amount += thisObjSpent;
  //     acc[indBudget.categoryId].remaining_balance += thisObjBalance;
  
  //     // Update overall totals
  //     acc.overallAllocated += thisObjAmount;
  //     acc.overallSpent += thisObjSpent;
  //     acc.overallRemaining += thisObjBalance;
  
  //     return acc;
  
  //   }, initialAccumulator);
  // };
  
  return (
    <div>
        <input 
        type="text"
        placeholder="filter by the budgets characteristics"
        value={filterTerm}
        onChange={(e) => setFilterTerm(e.target.value)}
        />

      <h1> Your Budgets </h1>
      {budgets.length > 0 ? (
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
                    { budgets.map((budget, index) => {
                        return (
                  <tr key={index}>
                <td> {budget.budget_name}</td>
                <td> {budget.category ? budget.category.category_description : "Unknown"} </td>
                <td> {budget.allocated_amount} </td>
                <td> {budget.spent_amount} </td>
                <td> {budget.remaining_balance} </td>
                <td> {budget.days_left} </td>
                  </tr>
                        )
                    })
                }
                </tbody>
              </table>
          ) : (
        <p> no budgets found </p>
      )}


{ filterTerm && (
            <FilteredBudget filterTerm={filterTerm} userId={customerId} budgets={budgets}/>
        )
      }
    </div>
  );
}