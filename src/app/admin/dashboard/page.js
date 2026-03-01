"use client";
import { useState, useEffect, useReducer, useContext } from "react";
import React from "react";
import "../../styles/allocationstyles.css";
import "../../styles/styles.css";
import { useRouter } from "next/navigation";
import { userContext } from "../../context/userContext";
import getDate from '../../utils/date'
import getDay from '../../utils/day'

export default function Page() {
  const router = useRouter();

  const [selected, setSelected] = useState(0);
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [daysToExpiry, setDaysToExpiry] = useState(null);
  const [totalFacicities, setTotalFacilities] = useState(0);
  const [tatolInventory, setTotalInventory] = useState(0);
  const [user, setUser] = useState("");

  const {
    allocations,
    requests,
    healthPoints,
    pendingRequests,
    totalVaccine,
    inventories,
    loading,
  } = useContext(userContext);
  const getDaysToExpiry = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const [form, setForm] = useState({
    inventory_id: "",
    facility_id: "",
    quantity: "",
    notes: "",
  });

  console.log(pendingRequests);
  // Fetch data

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/create-allocation", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.message) {
      alert("Allocation successful");
      location.reload();
    } else {
      alert(data.error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleVaccineSelection = (id) => {
    const selectedQuantity = inventories.find((i) => i?.id == id);

    if (selectedQuantity) {
      setSelected(selectedQuantity?.quantity || 0);
      setSelectedExpiry(selectedQuantity?.expiry_date);

      const days = getDaysToExpiry(selectedQuantity?.expiry_date);
      setDaysToExpiry(days);
    }

    setForm({ ...form, inventory_id: id });
  };

  return (
    <main
      style={{ height: "70vh" }}
      className="scroll-container w-full flex fxd-c"
    >
      <section className="p-l-r-30 p-t-20">
        <section className="stats">
          <div className="card">
            <h3>Total Vaccines</h3>
            <p>{totalVaccine?.toLocaleString()}</p>
          </div>

          <div className="card">
            <h3>Active Health Facilities</h3>
            <p>{healthPoints?.length}</p>
          </div>

          <div className="card">
            <h3>Dispensed Today</h3>
            <p>340</p>
          </div>

          <div className="card warning">
            <h3>Low Stock Points</h3>
            <p>3</p>
          </div>
           <div className="card warning">
            <h3>Pending Requests</h3>
            <p>{pendingRequests.length}</p>
          </div>
        </section>

        <section className="quick-actions flex fxd-c ">
          {/* <h3  className="text-r">Quick Actions</h3> */}
          <div className="actions flex justify-c-end">
            <button onClick={()=>router.push('/admin/create-facilities')} className="bg-none b-1 outline-none color-black p-l-r-10 border-grey border-r-5">
              ➕ Create Facility
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              💉 + Dispense Vaccine
            </button>
            {/* <a href="/admin/reports">📄 View Reports</a> */}
          </div>
          <h3 className="m-t-30  reduce-gap-b10">Latest Pending Requests</h3>
          <section className="m-t-20 vaccine-container">
            {loading ? (
              <section className="point-loading">
                <div className="wrapper">
                  <div className="line  line1"></div>
                  <div className="line line2"></div>
                  <div className="line line3"></div>
                  <div className="line line4"></div>
                </div>
              </section>
            ) : (
              <section className="overflow-x-auto">
                <table className="allocation-table">
                  <thead>
                    <tr>
                      <th>Health Facility</th>
                      <th>Vaccine </th>
                      <th>Quantity Requested</th>
                      <th>Date of Request</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(pendingRequests)?.map((a, i) => (
                      <tr key={i}>
                        <td className="text-l">{a.facility}</td>
                        <td className="text-l">{a.vaccine}</td>
                        <td className="text-l">{a.quantity_requested}</td>
                        <td className="text-l"><strong>{getDay(a.created_at)},</strong> {getDate(a.created_at?.slice(0, 10))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </section>
          <h3 className="m-t-30  reduce-gap-b10">Recent Allocations</h3>
          <section className="m-t-20 vaccine-container overflow-x-auto">
            {loading ? (
              <section className="point-loading">
                <div className="wrapper">
                  <div className="line  line1"></div>
                  <div className="line line2"></div>
                  <div className="line line3"></div>
                  <div className="line line4"></div>
                </div>
              </section>
            ) : (
              <section>
                <table className="allocation-table overflow-x-auto">
                  <thead>
                    <tr>
                      <th>Vaccine</th>
                      <th>Batch</th>
                      <th>Health Facility</th>
                      <th>Quantity Allocated</th>
                      <th>Date Allocated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(allocations)
                      ?.slice(0, 4)
                      .map((a) => (
                        <tr key={a.id}>
                          <td className="text-l">{a.vaccine_name}</td>
                          <td className="text-l">{a.batch_number}</td>
                          <td className="text-l">{a.name}</td>
                          <td className="text-l">{a.total_received}</td>
                          <td className="text-l">
                            {a.allocation_date?.slice(0, 10)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </section>
            )}
          </section>
        </section>

        {isModalOpen && (
          <section
            className="modal-show flex fxd-c justify-c"
            style={{ height: "100vh" }}
          >
            <div className="class-modal justify-c flex">
              <div className="flex justify-between w-full">
                <h2 className=" w-full">Vaccine Allocation</h2>
                <span
                  onClick={() => {
                    (setIsModalOpen(false),
                      setSelected(""),
                      setForm({ ...form, inventory_id: "" }));
                  }}
                  style={{
                    display: "block",
                    cursor: "pointer",
                    width: "20px",
                    height: "20px",
                    color: "purple",
                  }}
                >
                  X
                </span>
              </div>

              <form className="w-full">
                <div className="flex gap-10 ">
                  <div className="input-group w-50p">
                    <label>Select Vaccine</label>
                    <select
                      className="w-full"
                      required
                      onChange={(e) => handleVaccineSelection(e.target.value)}
                    >
                      <option value="">Select batch</option>

                      {inventories?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.vaccine_name} — {item.batch_number}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group w-50p">
                    <label>Select Health Facility</label>
                    <select
                      className="w-full"
                      required
                      onChange={(e) =>
                        setForm({ ...form, facility_id: e.target.value })
                      }
                    >
                      <option value="">Select health point</option>
                      {healthPoints?.map((hp) => (
                        <option key={hp.id} value={hp.id}>
                          {hp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selected > 0 && (
                  <p className="stock-info">
                    Available stock: <strong>{selected}</strong> doses
                  </p>
                )}

                {selectedExpiry && (
                  <div className="expiry-info">
                    Expiry Date: <strong>{selectedExpiry}</strong>
                  </div>
                )}

                <div className="input-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selected}
                    value={form.quantity || ""}
                    placeholder="Enter quantity"
                    onChange={(e) =>
                      setForm({ ...form, quantity: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Notes</label>
                  <textarea
                    placeholder="Optional notes"
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>

                {selected > 0 && selected <= 50 && (
                  <p className="low-stock-warning">
                    ⚠ Low stock — consider reordering soon.
                  </p>
                )}

                <button onClick={handleSubmit} className="btn-primary">
                  Allocate Vaccine
                </button>
              </form>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
