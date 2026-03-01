"use client";
import React, { useContext, useEffect, useState } from "react";
import "../../../styles/styles.css";
import { useParams, useRouter } from "next/navigation";
import { userContext } from "../../../context/userContext";

export default function PointInventory() {
  const [inventories, setInventories] = useState([]);
  const router = useRouter();
  // const [loading, setLoading] = useState(true);
  const params = useParams();
  const { facility, stock, loading } = useContext(userContext);

  console.log("inside", stock);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="p-30">
      <section className="inventory-grid m-b-20 ">
        <div className="inv-card">
          <span>Total Doses</span>
          <strong>4,200</strong>
        </div>
        <div className="inv-card warning">
          <span>Expiring Soon</span>
          <strong>120</strong>
        </div>
      </section>

      <section className="invetory-container bg-white p-10">
        <header className="inventory-header">
          <h2>Vaccine Inventory</h2>
          {/* <button
            class="btn-primary"
            onClick={() => router.push("/admin/inventory/add-inventory")}
          >
            + Add New Batch
          </button> */}
        </header>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>Vaccines</th>
              <th>Batch Number</th>
              <th>Manufacturer</th>
              <th>quantity</th>
              <th>Storage Temp</th>
              <th>Man. Date</th>
              <th>Exp. Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stock?.slice(0, 7).map((inv, i) => (
              <tr key={i}>
                <td className="text-l">
                  <strong>{inv.name}</strong>
                </td>
                <td className="text-l">{inv.batch_number}</td>

                <td className="text-l">{inv.manufacturer}</td>

                <td className="text-l">{inv.quantity}</td>
                <td>{inv.storage_condition}</td>
                <td>{inv.manufacturer_date?.slice(0, 10)}</td>
                <td>{inv.expiry_date?.slice(0, 10)}</td>
                <td className="text-l">
                  {inv.quantity <= 20 ? (
                    <span className="badge danger">Low Stock</span>
                  ) : (
                    <span className="badge success">Available</span>
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
