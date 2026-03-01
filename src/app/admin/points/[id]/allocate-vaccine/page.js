"use client";
import getDay from "../../../../utils/day";
import { userContext } from "../../../../context/userContext";
import React, { useState, useEffect, useContext } from "react";
import getDate from "../../../../utils/date";
import { useParams } from "next/navigation";

export default function AllocateVaccine() {
  const [form, setForm] = useState({
    inventory_id: "",
    facility_id: "",
    quantity: "",
    notes: "",
  });

  // const [inventories, setInventories] = useState([]);
  const [selected, setSelected] = useState();
  const [selectedExpiry, setSelectedExpiry] = useState();
  const [facility, setFacility] = useState();
  const { inventories, healthPoints } = useContext(userContext);
  const [daysToExpiry, setDaysToExpiry] = useState();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const loadFacility = async () => {
      console.log(healthPoints);

      const _healthPoint = healthPoints.find((i) => i.id == id);
      setFacility(_healthPoint);
      setForm({ ...form, facility_id: id });
    };

    loadFacility();
  }, []);

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
  const getDaysToExpiry = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

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
  console.log(facility);
  return (
    <main className="scroll-container p-t-20">
      <section
        className="flex fxd-c align-item-c w-full"
        style={{ height: "100vh" }}
      >
        <div className="class-modal justify-c flex w-full">
          <div className="flex justify-between w-full">
            <h3 className=" w-full"><span className="color-grey-184">Assign Vaccine to </span>{facility?.name}</h3>
            <span
              // onClick={() => {
              //   (setIsModalOpen(false),
              //     setSelected(""),
              //     setForm({ ...form, inventory_id: "" }));
              // }}
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

              {/* <div className="input-group w-50p">
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
              </div> */}
            </div>

            {selected > 0 && (
              <p className="stock-info">
                Available stock: <strong>{selected}</strong> doses
              </p>
            )}

            {selectedExpiry && (
              <div className="expiry-info">
                Expiry Date: <strong>{getDay(selectedExpiry)}</strong>,{" "}
                {getDate(selectedExpiry)}
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
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
    </main>
  );
}
