"use client";
import { userContext } from "../../../context/userContext";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect,useContext } from "react";

export default function RequestVaccine() {
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [vaccineId, setVaccineId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [message, setMessage] = useState("");
  const [isModalShow, setIsModalShow] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { facility } = useContext(userContext);

  useEffect(() => {
    fetch("/api/get-vaccines")
      .then((res) => res.json())
      .then(setVaccines);
  }, []);

console.log(facility?.facility_id)
  const submitRequest = async () => {
    setMessage('')
    const facility_id = facility?.facility_id;
   
    const res = await fetch("/api/points/create-request", {
      method: "POST",
      body: JSON.stringify({ vaccineId, quantity, facility_id, requestNote }),
    });

    const data = await res.json();
    setMessage(data.message);
    setQuantity('')
  };

  console.log(requestNote);

  return (
    <section className="p-30">
      <div className="bg-white p-30 border-r-8">
        <div className="flex w-full justify-between m-b-20">
          <h2 className="m-b-20">Request More Vaccines</h2>
        </div>

        <div className="flex fxd-c w-full">
          <div className="input-group ">
            <label>Select Vaccine</label>
            <select
              className="w-full"
              onChange={(e) => setVaccineId(e.target.value)}
            >
              <option value="">Select Vaccine</option>
              {vaccines.map((v, i) => (
                <option key={i} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Request Note (Optional)</label>
            <textarea
              placeholder="Request Note"
              value={requestNote || ""}
              onChange={(e) => setRequestNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button className="btn-primary" onClick={submitRequest}>
          Submit Request
        </button>

        <p>{message}</p>
      </div>
    </section>
  );
}
