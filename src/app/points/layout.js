"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import "../globals.css";
import "../styles/styles.css";
// import { useState } from "react";
import { userContext } from "../context/userContext";
import Link from "next/link";

export default function Layout({ children }) {
  const [stock, setStock] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [savedUser, setSavedUser] = useState("");
  const { user, setUser } = useContext(userContext);
  const [facility, setFacility] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [approvedRequest, setApprovedRequest] = useState([]);
   const [pendingStock, setPendingStock] = useState([]);
  const [request, setRequest] = useState([]);
  const params = useParams();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("inventory")) return " Available Vaccine Types";
    if (pathname.includes("requests")) return "Vaccine Requests";
    if (pathname.includes("reports")) return "Reports";
    if (pathname.includes("points")) return "Health Centers";
  };
  const today = new Date();

  const weekDay = today.toLocaleDateString("en-US", { weekday: "long" }); // "Saturday"
  // date.toLocaleDateString("en-US", { weekday: "short" }); // "Sat"
  const todayDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  useEffect(() => {
   
    const localUser = JSON.parse(localStorage.getItem("user"));
    async function loadUser(u) {
      setSavedUser(u);
    }
    loadUser(localUser);
  }, []);

  useEffect(() => {
    async function fetchFacility() {
      const res = await fetch(`/api/points/get-inventory?id=${params.id}`);
      const data = await res.json();

      const _id = data[0]?.facility.facility_id;

      if (data) {
        setFacility(data[0]?.facility);
        setAllocations(data[1]?.allocations);

        await fetch(`/api/points/get-facility-inventory?id=${_id}`)
          .then((res) => res.json())
          .then(setStock);
      }

      const res2 = await fetch(`/api/points/get-request?id=${_id}`);
      const data2 = await res2.json();
      setRequest(data2);

      const _pendingStock = data2.filter((i) => i.status === "pending");
      setPendingStock(_pendingStock);
      const _approvedRequest = data2.filter((i) => i.status === "approved");
      setApprovedRequest(_approvedRequest);

      if (data[2]?.status === 201) {
        setLoading(false);
      }
    }
    fetchFacility();
  }, [user?.id, facility?.id, params.id]);

  const getDaysToExpiry = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("");
    router.push("/login");
  };

  useEffect(() => {
    fetch("/api/get-vaccines")
      .then((res) => res.json())
      .then(setVaccines);
  }, []);

  console.log(pendingStock);
  console.log(request);

  return (
    <main className="dashboard">
      <userContext.Provider
        value={{
          facility: facility,
          allocations: allocations,
          loading: loading,
          stock: stock,
          pendingStock: pendingStock,
          approvedRequest:approvedRequest
        }}
      >
        <aside className="sidebar">
          <h2 className="logo">Vax National Vaccines</h2>

          <nav>
            <Link href={`/points/dashboard/${params?.id}`}>Dashboard</Link>

            <Link href={`/points/point-inventory/${params.id}`}>
              Available Vaccines
            </Link>
            <Link href={`/points/request-vaccine/${params.id}`}>
              Request Vaccine
            </Link>
            <Link href="/points/available-vaccine">Record Usage</Link>
            <Link href="/points/reports">Usage History</Link>
            <Link href="/points/reports">expiry Alerts</Link>
          </nav>

          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <section className="w-full">
          <header className="header p-l-r-30 p-t-30">
            <div>
              <h1 style={{ marginBottom: "0px" }}>{facility?.name}</h1>
              <h3 className="reduce-gap-10">
                <span style={{ color: "grey" }}>Facility Administrator</span>{" "}
                <strong>{getTitle()}</strong> |{" "}
                <span className="reduce-gap-15">
                  {" "}
                  <strong style={{ color: "red" }}>{weekDay}, </strong>
                  <span style={{ color: "gray" }}>{todayDate}</span>
                </span>
              </h3>
            </div>

            <div
              style={{ alignContent: "center" }}
              className="flex gap-10 justify-c"
            >
              <div className="admin-badge">
                <h2>
                  {facility?.user_name.split(" ")[0]?.slice(0, 1).toUpperCase()}
                  {facility?.user_name
                    .split(" ")[1]
                    ?.slice(0, 1)
                    .toUpperCase()}{" "}
                </h2>
              </div>
              <span className="text-c p-10">{facility?.user_name}</span>
            </div>
          </header>

          <section className="content">{children}</section>
        </section>
      </userContext.Provider>
    </main>
  );
}

// import "../admin/styles/adminstyles.css";
