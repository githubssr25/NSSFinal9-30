import { Outlet, Route, Routes } from "react-router-dom";
import { NavBar } from "../navbar/navbar";
import { useState } from "react";
import { Welcome } from "../welcome/Welcome";
import {EnterMoneySpent} from "../money/EnterMoneySpent"
import {AddNewBudget} from "../budget/AddNewBudget"
import {DeleteBudget} from "../budget/DeleteBudget"
import {EditBudget} from "../budget/EditBudget"
import {ViewAllBudgets} from "../budget/ViewAllBudgets"
import {ProductInfo} from "../products/ProductInfo"
import {Stores} from "../stores/Stores"
import {LatestNotifications} from "../notifications/LatestNotifications"
//the parent route is / because its route only closes at the end everything within it is a child of it like welcome etc

export const ApplicationViews = () => {

const [finishedEditing, setFinishedEditing] = useState(false);

const markEditingComplete = () => {
    setFinishedEditing(true);
  };

return (
    <Routes>
        <Route
        path="/"
        element={
            <>
            <NavBar finishedEditing={finishedEditing}/>
            <Outlet />
            </>
        }
        >
            <Route index element={<Welcome />} />
            < Route path="/enterMoneySpent" element={<EnterMoneySpent />} />
            < Route path="/addNewBudget" element={<AddNewBudget/>} />
            <Route path="/deleteBudget" element={<DeleteBudget/>} />
            <Route path="/editBudget" element={<EditBudget markEditingComplete={markEditingComplete}/>} />
            <Route path="/viewAllBudgets" element={<ViewAllBudgets/>} />
            <Route path="/productInfo" element={<ProductInfo />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/latestNotifications" element={<LatestNotifications />} />
    </Route>
    </Routes>
);
};


