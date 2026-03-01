"use client";
import { useEffect, useState } from "react";
// import "./pointstyle.css";
// import "./activeborder.css";
import "../../styles/styles.css";
import { useRouter } from "next/navigation";

export default function PointUsersPage() {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [fullname, setFullName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isModalShow, setIsModalShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    nameError: "",
    emailError: "",
    addressError: "",
  });
  const [healtheCenterForm, setHealthCenterForm] = useState({
    name: "",
    address: "",
    contact_staff: "",
    phone: "",
    email: "",
    capacity: "",
    type: "",
  });

  const [activeTab, setActiveTab] = useState(1);
  const nextStep = () => setActiveTab((prev) => prev + 1);
  const prevStep = () => setActiveTab((prev) => prev - 1);

  async function fetchUsers() {
    const res = await fetch("/api/get-users");
    const data = await res.json();
    setUsers(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/create-facility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname,
        adminEmail,
        password,
        admin,
        healtheCenterForm,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Failed to create user");
      return;
    }

    if (res.status === 201) {
      setMessage("✅ Point user created successfully");
      setFullName("");
      setAdminEmail("");
      setPassword("");
      setHealthCenterForm({
        name: "",
        address: "",
        email: "",
        capacity: "",
        type: "",
        contact_staff: "",
        phone: "",
      });

      setLoading(false);

      fetchUsers();
      prevStep();
    }
  };

  const handleNext = () => {
    if (healtheCenterForm.name === "") {
      setErrorMsg({ ...errorMsg, nameError: "Name can not be empty" });
      return;
    }
    nextStep();
  };

  useEffect(() => {
    async function setAdminRole() {
      const user = JSON.parse(localStorage.getItem("user"));
      setAdmin(user);
      console.log(user.role);
    }
    setAdminRole();
  }, []);

  console.log(admin);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/get-users");
      console.log(">>>", res);
      const users = await res.json();
      setUsers(users);
      console.log("users", users);
    }
    fetchUsers();
  }, []);

  async function createPointUser(e) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/admin/points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    setUsername("");
    setLoading(false);
    fetchUsers();
  }

  async function toggleStatus(id, is_active) {
    await fetch("/api/admin/points", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !is_active }),
    });

    fetchUsers();
  }

  return (
    <main className="p-l-r-60 scroll-container">
      <section>
        <div
          // style={{ position: "sticky", top: "3px", backgroundColor: "#f6f7f8" }}
          className=""
        >
          <h2>Health Center Management</h2>
          <p style={{ color: "#1e293b" }}>
            Create Health Centers and their Administrators
          </p>
        </div>

        <section className="teacher-container">
          <div className="wizard-card">
            {/* Progress Header */}
            <div className="wizard-header">
              <div className={`step ${activeTab >= 1 ? "active" : ""}`}>
                1. Create Health Center
              </div>
              <div className={`step ${activeTab >= 2 ? "active" : ""}`}>
                2. Create User for Health Center
              </div>
            </div>

            <div className="wizard-content">
              {/* STEP 1: GENERAL INFO */}
              {activeTab === 1 && (
                <section className="fade-in">
                  <h3>Health Center Information</h3>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Name</label>
                      <input
                        value={healtheCenterForm.name}
                        required
                        placeholder="full name"
                        onInput={() =>
                          setErrorMsg({ ...errorMsg, nameError: "" })
                        }
                        onChange={(e) =>
                          setHealthCenterForm({
                            ...healtheCenterForm,
                            name: e.target.value,
                          })
                        }
                      />
                      <p style={{ color: "red" }}>{errorMsg.nameError}</p>
                    </div>
                    <div className="flex w-full gap-10">
                      <div className="input-group w-50p">
                        <label>Email</label>
                        <input
                          type="text"
                          value={healtheCenterForm.email || ""}
                          required
                          placeholder="Johndoe@gmail.com"
                          // onInput={() =>
                          //   setError({ ...error, surnameError: "" })
                          // }
                          onChange={(e) =>
                            setHealthCenterForm({
                              ...healtheCenterForm,
                              email: e.target.value,
                            })
                          }
                        />
                        {/* <p style={{ color: "red" }}>{error.surnameError}</p> */}
                      </div>
                      <div className="input-group w-50p">
                        <label>Type</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g Clinic, health Center"
                          // onInput={() =>
                          //   setError({ ...error, firstnameError: "" })
                          // }
                          onChange={(e) =>
                            setHealthCenterForm({
                              ...healtheCenterForm,
                              type: e.target.value,
                            })
                          }
                        />
                        {/* <p style={{ color: "red" }}>
                              {error.firstnameError}
                            </p> */}
                      </div>
                    </div>

                    <div
                      style={{ width: "100%" }}
                      className="flex fxd-r gap-10"
                    >
                      <div className="input-group w-50p">
                        <label>Contact Staff</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g Protus Otus"
                          onChange={(e) =>
                            setHealthCenterForm({
                              ...healtheCenterForm,
                              contact_staff: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="input-group w-50p">
                        <label>Phone</label>
                        <input
                          required
                          type="tel"
                          placeholder="e.g 070556443566"
                          onChange={(e) =>
                            setHealthCenterForm({
                              ...healtheCenterForm,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label>Capacity</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g 445"
                          onChange={(e) =>
                            setHealthCenterForm({
                              ...healtheCenterForm,
                              capacity: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Address</label>
                      <textarea
                        rows={3}
                        value={healtheCenterForm.address}
                        onChange={(e) =>
                          setHealthCenterForm({
                            ...healtheCenterForm,
                            address: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex fxd-r justify-c">
                    <button className="btn-main" onClick={handleNext}>
                      Proceed to add admin
                    </button>
                  </div>
                </section>
              )}

              {/* STEP 2: LOGIN DETAILS */}
              {activeTab === 2 && (
                <section className="fade-in">
                  <h3>Health Center Admin Details</h3>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="full name"
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Email </label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="btn-row justify-c">
                    <button
                      className="font-s-16 weight-600 bg-none color-darkblue outline-none b-1 border-grey border-r-5 p-l-r-10"
                      onClick={prevStep}
                    >
                      ← Back
                    </button>

                    <button className="btn-main" onClick={handleSubmit}>
                      Add Center
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </section>

        {/* <div className="class-modal">
            <section className="wizard-content"></section>

            {message && <p>{message}</p>}
            
            <button>
              ← Back to Dashboard
            </button>
          </div> */}
      </section>
    </main>
  );
}
