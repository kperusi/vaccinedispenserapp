"use client";
import React, { useEffect, useState } from "react";
import "../../../styles/styles.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [vaccine, setVaccine] = useState([]);
  const [admin, setAdmin] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    vaccine_type_id: "",
    batch_number: "",
    quantity: "",
    storage_condition: "",
    expiry_date: "",
    man_date: "",
  });

  useEffect(() => {
    async function setAdminRole() {
      const user = JSON.parse(localStorage.getItem("user"));
      setAdmin(user);
      console.log(user.role);
    }
    setAdminRole();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    const res = await fetch("/api/add-to-inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form,
        admin,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message || "Failed to add Inventory");
      return;
    }
    if (res.status === 201) {
      setMsg("Inventory added successfully");
      setForm({
        vaccine_type_id: "",
        batch_number: "",
        quantity: "",
        storage_condition: "",
        expiry_date: "",
        man_date: "",
      });
      setSaving(false);
    }
  };

  async function fetchVaccines() {
    console.log("fetching vaccine");

    const res = await fetch("/api/get-vaccines");
    const data = await res.json();
    localStorage.setItem("vaccines", JSON.stringify(data));

    const localVaccine = JSON.parse(localStorage.getItem("vaccines")) || [];
    setVaccine(localVaccine);
  }

  useEffect(() => {
    async function fetchVaccines() {
      console.log("fetching vaccinedf");
      const res = await fetch("/api/get-vaccines");
      const data = await res.json();
      setVaccine(data);
    }
    fetchVaccines();
  }, []);

  console.log(form);
  return (
    <main className="scroll-container">
      <div className="flex fxd-c align-item-c p-l-r-50">
        <div className="form-card w-full">
          <header className="form-header flex fxd-c gap-20">
            {/* <a href="/admin" className="back-link">
              ← Back to Dashboard
            </a> */}
            <div className="flex fxd-c">
              <h3>Register New Batch</h3>
              <p className="reduce-gap-20">
                Enter the shipment details to update your stock levels.
              </p>
            </div>
          </header>

          <form id="inventoryForm" className="bg-white p-30 border-r-8">
            <div className="input-group">
              <label>Vaccine Type</label>
              <select
                className="w-50p "
                name="vaccine_type_id"
                required
                onChange={(e) =>
                  setForm({ ...form, vaccine_type_id: e.target.value })
                }
              >
                <option value="">Select a vaccine...</option>
                
                {  vaccine.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>storage Condition</label>
                <input
                  type="text"
                  name="storage conditions"
                  placeholder="e.g., Pfizer Inc."
                  required
                  onChange={(e) =>
                    setForm({ ...form, storage_condition: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex fxd-r w-full gap-20">
              <div className="input-group w-50p">
                <label>Batch Number</label>
                <input
                  type="text"
                  name="batch_number"
                  placeholder="e.g., BNT-1092"
                  required
                  value={form.batch_number || ""}
                  onChange={(e) =>
                    setForm({ ...form, batch_number: e.target.value })
                  }
                />
              </div>
              <div className="input-group w-50p">
                <label>Quantity (Doses)</label>
                <input
                  type="text"
                  name="quantity"
                  min="1"
                  placeholder="500"
                  required
                  value={form.quantity || ""}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex w-full gap-20">
              <div className="input-group w-50p">
                <label>Manufactured Date</label>
                <input
                  type="date"
                  name="manufactured_date"
                  required
                  onChange={(e) =>
                    setForm({ ...form, man_date: e.target.value })
                  }
                />
              </div>
              <div className="form-row w-50p">
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    name="expiry_date"
                    required
                    onChange={(e) =>
                      setForm({ ...form, expiry_date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-20">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => router.push("/admin/inventory")}
              >
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Confirm & Add Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
