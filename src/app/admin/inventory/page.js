"use client";
import React, { useContext, useEffect, useState } from "react";
import "../../styles/styles.css";
import { useRouter } from "next/navigation";
import { userContext } from "../../context/userContext";

export default function Page() {
  const router = useRouter();
  
  const {inventories,totalVaccine,loading}=useContext(userContext)



 

  console.log(totalVaccine);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="p-l-r-30 scroll-container">
      <section className="inventory-grid m-b-20 m-t-20 p-xl-sticky">
        <div className="inv-card ">
          <p>Total Vaccines:  <strong>{totalVaccine.toLocaleString()}</strong></p>
         
        </div>
        <div className="inv-card warning">
          <span>Expiring Soon:  <strong>120</strong></span>
         
        </div>
      </section>

      <section className="invetory-container bg-white p-10">
        <header className="inventory-header">
          <h2>Vaccine Inventory</h2>
          <button
            className="btn-primary"
            onClick={() => router.push("/admin/inventory/add-inventory")}
          >
            + Add New Batch
          </button>
        </header>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>Vaccine</th>
              <th>Manufacturer</th>
              <th>Batch Number</th>
              <th>quantity</th>
              <th>Storage Temp</th>
              <th>Man. Date</th>
              <th>Exp. Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="inv-body">
            {Object.values(inventories)
              ?.slice(0, 7)
              .map((inv) => (
                <tr key={inv.id}>
                  <td className="text-l">
                    <strong>{inv.vaccine_name}</strong>
                  </td>
                  <td className="text-l">{inv.vaccine_man}</td>
                  <td className="text-l">{inv.batch_number}</td>
                  <td className="text-l">{inv.quantity}</td>
                  <td>{inv.storage_condition}</td>
                  <td>{inv.manufacturer_date?.slice(0, 10)}</td>
                  <td>{inv.expiry_date?.slice(0, 10)}</td>
                  <td className="text-l">
                    {inv.quantity <= 20 ? (
                      <span className="badge danger">Low Stock</span>
                    ) : (
                      <span className="badge success">{inv.status}</span>
                    )}
                    {/* <span className="badge success">{inv.status}</span> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
