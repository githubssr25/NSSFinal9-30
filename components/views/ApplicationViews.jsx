import { Outlet, Route, Routes } from "react-router-dom";
import { NavBar } from "../navbar/navbar";
import { Welcome } from "../welcome/Welcome";
import {EnterMoneySpent} from "../money/EnterMoneySpent"
import {AddNewBudget} from "../budget/AddNewBudget"
import {DeleteBudget} from "../budget/DeleteBudget"
import {EditBudget} from "../budget/EditBudget"
import {ViewAllBudgets} from "../budget/ViewAllBudgets"

export const ApplicationViews = () => {





return (
    <Routes>
        <Route
        path="/"
        element={
            <>
            <NavBar />
            <Outlet />
            </>
        }
        >
            <Route index element={<Welcome />} />
            < Route path="/enterMoneySpent" element={<EnterMoneySpent />} />
            < Route path="/addNewBudget" element={<AddNewBudget/>} />
            <Route path="/deleteBudget" element={<DeleteBudget/>} />
            <Route path="/editBudget" element={<EditBudget/>} />
            <Route path="/viewAllBudgets" element={<ViewAllBudgets/>} />
    </Route>
    </Routes>
);
};


