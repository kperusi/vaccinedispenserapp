"use client";
import { useContext, useEffect, useState } from "react";
// import "./pointstyle.css";
// import "./activeborder.css";
import "../../styles/styles.css";
import { useRouter } from "next/navigation";
import { userContext } from "../../context/userContext";
import getDate from "../../utils/date";
import getDay from "../../utils/day";

export default function PointUsersPage() {
  const [users, setUsers] = useState([]);

  const [admin, setAdmin] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isModalShow, setIsModalShow] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [healtheCenterForm, setHealthCenterForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    capacity: "",
    type: "",
  });
  const {
    healthPoints,
    fetchFacilities,
    requests,
    facilityRequests,
    pendingFacilityRequest,
  } = useContext(userContext);

  const [activeTab, setActiveTab] = useState(1);
  const nextStep = () => setActiveTab((prev) => prev + 1);
  const prevStep = () => setActiveTab((prev) => prev - 1);

  useEffect(() => {
    async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setAdmin(user);
      console.log(user.role);
    };
  }, []);

  async function toggleStatus(id, is_active) {
    await fetch("/api/admin/points", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !is_active }),
    });

    fetchFacilities();
  }
  const toggleSession = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="p-30">
      <section className="page-header">
        <div className="flex fxd-c">
          <h2>Health Centers</h2>
          <p>Add More Health Centers</p>
        </div>

        <div>
          <button
            className="btn-primary"
            onClick={() => router.push("/admin/create-facilities")}
          >
            + Add Point
          </button>
        </div>
      </section>

      {healthPoints?.length === 0 && (
        <div className="m-b-10">
          <p>No Points Yet!</p>
        </div>
      )}
      {healthPoints?.length > 0 && (
        <section className="flex fxd-c  gap-20 align-item-c scroll-container p-b-20">
          <div className="containerh">
            <div className="session-list ">
              {healthPoints.map((hp, i) => (
                <section
                  key={i}
                  className={`session-card ${expandedId === hp.id ? "actives" : ""}`}
                >
                  <div
                    className="session-header"
                    onClick={() => toggleSession(hp.id)}
                  >
                    <div className="session-info ">
                      <span
                        className={`status-dot ${hp.status ? "active" : "completedn"}`}
                      ></span>
                      <div className="">
                        <div className="flex">
                          <h3>{hp.name}</h3>
                          {facilityRequests[hp.id]?.filter(
                            (i) => i.status === "pending",
                          ) && (
                            <span className="notify">
                              {
                                facilityRequests[hp.id]?.filter(
                                  (i) => i.status === "pending",
                                ).length
                              }
                            </span>
                          )}
                        </div>
                        <p>
                          {hp.email} | {hp.address}
                        </p>
                      </div>
                    </div>
                    <div className="session-meta">
                      {hp.status === "active" && (
                        <span className="badge">Active</span>
                      )}
                      {/* <span>{sessionsTerms[session.id]?.length} Terms</span> */}
                      <span className="arrow">
                        {expandedId === hp.id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                  {expandedId === hp.id && (
                    <div className="term-details">
                      <div className="term-actions">
                        <button
                          style={{ fontWeight: "600", fontSize: "14px" }}
                          className="btn-text "
                          onClick={() => {
                            // setAddTermModalShow(true);
                            // setSelectedSession(session);
                          }}
                        >
                          + Allocate Vaccines
                        </button>
                      </div>
                      <p>Request History</p>

                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facilityRequests[hp?.id]?.map((r, i) => (
                            <tr key={i} className="text-l">
                              <td className="text-l flex gap-10 align-item-c">
                                <span
                                  className={`${r.status}`}
                                  style={{
                                    display: "block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                  }}
                                ></span>
                                <strong>{getDay(r.created_at)}, </strong>
                                {getDate(r.created_at)}
                              </td>
                              <td
                                className={`text-l ${r.status === "pending" ? "color-red" : "color-green"}`}
                              >
                                {r.status?.slice(0, 1).toUpperCase()}
                                {r.status?.slice(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                  
                      <div className="flex p-t-10 justify-c-end gap-10">
                        <button
                        onClick={()=>router.push(`/admin/points/${hp.id}/view`)}
                          style={{ fontSize: "14px" }}
                          className=" border-none color-white border-r-8 bg-darkblue outline-none p-10 p-l-r-20"
                        >
                          View Details
                        </button>
                        <button
                          style={{ fontSize: "14px" }}
                          className="btn-secondary p-10"
                        >
                          Edit Facility
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

{
  /* {healthPoints?.length > 0 && (
        <section style={{ height: "60vh" }} className="scroll-container">
          <table width="100%">
            <thead className="border-b-1 border-grey bg-grey-218">
              <tr>
                <th>Health Center</th>
                <th>Status</th>
                <th>Action</th>
                <th>address</th>
                <th>email</th>
                <th>Type</th>
                <th>Contact Staff</th>
              </tr>
            </thead>

            <tbody>
              {healthPoints?.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: "1px solid #dfdfdf" }}
                  className="text-l healthpoint"
                >
                  <td className="text-l">{u.name}</td>
                  <td className="text-l">
                    <span className={u.status ? "active" : "disabled"}>
                      {u.status ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={u.is_active ? "disable" : "enable"}
                      onClick={() => toggleStatus(u.id, u.is_active)}
                    >
                      {u.is_active ? "Disable" : "Enable"}
                    </button>
                  </td>
                  <td className="text-l">{u.address}</td>
                  <td className="text-l">{u.email}</td>
                  <td className="text-l">{u.type}</td>
                  <td className="text-l">
                    {u.contact_staff ? u.contact_staff : "Not assigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )} */
}
