"use client";

import { useContext, useEffect, useState } from "react";
import "../../../styles/point-dashboard.css";
import "../../../styles/styles.css";
import { userContext } from "../../../context/userContext";
import { useRouter } from "next/navigation";

export default function PointDashboard() {
  // const [stock, setStock] = useState([]);
  const { user, setUser, allocations, facility, loading, stock, pendingStock,approvedRequest } =
    useContext(userContext);
  const router = useRouter();

  const getDay = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  };

  const getDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
  
    const localUser = JSON.parse(localStorage.getItem("user"));
    async function loadUser(u) {
      // setSavedUser(u);
    }
    loadUser(localUser);
  }, []);

  // useEffect(() => {
  //   console.log("fecthing");
  //   async function fetchFacility() {
  //     const res = await fetch(
  //       `/api/points/get-inventory?id=${savedUser.id}`,
  //     );
  //     const data = await res.json();
  //     console.log(data);
  //     if (data) {
  //       setFacility(data[0]?.facility);
  //       setAllocations(data[1]?.allocations);
  //     }
  //     if (data[2]?.status === 201) {
  //       setLoading(false);
  //     }
  //   }
  //   fetchFacility();
  //   // fetch("/api/point/allocations").then(res => res.json()).then(setAllocations);
  // }, [user?.id]);

  const getDaysToExpiry = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <section style={{width:'70vw', alignSelf:'center',justifySelf:'center'}} className="point-loading p-30">
        <div className="wrapper">
          <div className="line  line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
          <div className="line line4"></div>
        </div>
      </section>
    );
  }

  return (
    <main className="dashboard-container flex fxd-c scroll-container ">
      <section className="flex m-b-20 justify-between border-r-8 gap-10">
        <div className="profile-card bg-grey-2 border-grey border-l-9 border-r-5">
          <h4> Pending Request </h4>
          <h1>{pendingStock?.length}</h1>
        </div>
        <div className="profile-card bg-red-2 border-red border-l-9 border-r-5">
          <h4> Rejected Request</h4>
          <h2>0</h2>
        </div>
        <div className="profile-card border-green border-l-9 bg-green-2 border-r-5">
          <h4>Approved Request</h4>
          <h1>{approvedRequest?.length}</h1>
        </div>
      </section>

      {/* STOCK SECTION */}
      <h3 style={{ marginBottom: "0px" }}>Latest Pending Request</h3>
      <section className="card">
        {pendingStock?.length === 0 ? (
          <p>No vaccines allocated.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Quantity Requested</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingStock?.map((item) => {
                const days = getDaysToExpiry(item.expiry_date);

                return (
                  <tr key={item.id}>
                    <td className="text-l">{item.name}</td>

                    <td className="text-l">{item.quantity_requested}</td>
                    <td className="text-l">{item.request_notes}</td>
                    <td className="text-l bg-red-2 color-red border-r-5">
                      {item.status.toUpperCase()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* ALLOCATION HISTORY */}
      <section>
        <h3 style={{ marginBottom: "-0px" }}>Allocation History</h3>
        <section className="card">
          {allocations?.length === 0 ? (
            <p>No allocation records.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date Allocated</th>
                  <th>Vaccine</th>
                  <th>Batch Number</th>
                  <th>Quantity</th>
                  {/* <th>Manufacturer</th> */}
                  {/* <th>Manufactured Date</th> */}
                  <th>Expiry Date</th>
                </tr>
              </thead>
              {allocations?.map((a, i) => (
                <tbody key={i}>
                  <tr key={i}>
                    <td className="text-l">
                      {a.allocation_date?.slice(0, 10)}
                    </td>
                    <td className="text-l">{a.name}</td>
                    <td className="text-l">{a.batch_number}</td>
                    <td className="text-l">{a.quantity_allocated}</td>
                    <td className="text-l">{getDay(a?.expiry_date)}, {getDate(a?.expiry_date)}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          )}
        </section>
      </section>
    </main>
  );
}
