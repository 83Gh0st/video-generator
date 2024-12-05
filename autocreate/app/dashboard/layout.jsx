import React from "react";
import Header from "./_components/header";

function DashboardLayout({children}){
    return (
        <div>
        <div>
            <Header/>
            {children}
             </div>
        </div>
    )
}

export default DashboardLayout;