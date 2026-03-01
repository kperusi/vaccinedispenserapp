"use client";
// import "../admin/styles/adminstyles.css";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import "../globals.css";
// import '../styles/responsivestyles.css'
import "../styles/styles.css";
import { useEffect, useState } from "react";
import { userContext } from "../context/userContext";
import Link from "next/link";
import Hamburger from "../components/hambuger";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [inventories, setInventories] = useState([]);
  const [totalVaccine, setTotalVaccines] = useState("");
  const [user, setUser] = useState();
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [facilityRequests, setFacilityRequests] = useState([]);
  const [healthPoints, setHealthPoints] = useState();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilityAdmin, setFacilityAdmin] = useState("");
  const [pendingFacilityRequest, setPendingFacilityRequest] = useState();

  const pathname = usePathname();

  const today = new Date();

  const weekDay = today.toLocaleDateString("en-US", { weekday: "long" }); // "Saturday"
  // date.toLocaleDateString("en-US", { weekday: "short" }); // "Sat"
  const todayDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function loadDate() {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    loadDate();
  }, []);
  // console.log(user);

async function fetchRequests(){

      const res = await fetch("/api/get-requests");
      const data = await res.json();
      setRequests(data);

      const facility_requests = data.reduce((acc, request) => {
        const key = request.facility_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(request);
        return acc;
      }, {});

      setFacilityRequests(facility_requests);

      const filterByStatus = (status) => {
        const filtered = Object.keys(facility_requests).reduce(
          (acc, facilityId) => {
            // Filter the array of requests for THIS specific facility
            const matches = facility_requests[facilityId].filter(
              (req) => req.status === status,
            );

            // Only add to the new object if the facility actually has requests with that status
            if (matches.length > 0) {
              acc[facilityId] = matches;
            }

            return acc;
          },
          {},
        );

        return filtered;
      };

      const pendingFacilityRequests = filterByStatus("Pending");


      setPendingFacilityRequest(pendingFacilityRequests);

      const pendingRequest = data.filter((i) => i.status === "pending");
      setPendingRequests(pendingRequest || []);
      if (res.status === 201) {
        setLoading(false);
      }
    };





  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch("/api/get-requests");
      const data = await res.json();
      setRequests(data);

      const facility_requests = data.reduce((acc, request) => {
        const key = request.facility_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(request);
        return acc;
      }, {});

      setFacilityRequests(facility_requests);

      const filterByStatus = (status) => {
        const filtered = Object.keys(facility_requests).reduce(
          (acc, facilityId) => {
            // Filter the array of requests for THIS specific facility
            const matches = facility_requests[facilityId].filter(
              (req) => req.status === status,
            );

            // Only add to the new object if the facility actually has requests with that status
            if (matches.length > 0) {
              acc[facilityId] = matches;
            }

            return acc;
          },
          {},
        );

        return filtered;
      };
      const pendingFacilityRequests = filterByStatus("Pending");
      setPendingFacilityRequest(pendingFacilityRequests);
      const pendingRequest = data.filter((i) => i.status === "pending");
      setPendingRequests(pendingRequest || []);

      const res2 = await fetch("/api/get-inventories");
      const { inventories, total_vaccines } = await res2.json();
      console.log(total_vaccines);
      setInventories(inventories);
      setTotalVaccines(
        inventories?.reduce((sum, item) => sum + item.quantity, 0),
      );

      if (res.status === 201) {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    async function loadData() {
      const res1 = await fetch("/api/get-facilities");
      const facilities = await res1.json();
      setHealthPoints(facilities);

      if (res1.status === 500) {
        setHealthPoints([]);
      }

      const res3 = await fetch("/api/get-allocations");
      const allocations = (await res3.json()) || [];
      setAllocations(allocations);

      if (res3.status === 201) {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    async function fetchFacilityAdmin() {
      const res = await fetch("/api/get-users");
      const data = await res.json();
      setFacilityAdmin(data);
    }
    fetchFacilityAdmin();

    // fetchUsers();
  }, []);

  async function fetchFacilities() {
    const res1 = await fetch("/api/get-facilities");
    const facilities = await res1.json();
    setHealthPoints(facilities);
  }

  const getTitle = () => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("vaccine")) return "Vaccine Types";
    if (pathname.includes("inventory")) return "Central Inventory";
    if (pathname.includes("requests")) return "Vaccine Requests";
    if (pathname.includes("reports")) return "Reports";
    if (pathname.includes("points")) return "Health Centers";
    if (pathname.includes("create-facilities")) return "Add Health Centers";
  };

  return (
    <main className="dashboard">
      <userContext.Provider
        value={{
          requests: requests,
          pendingRequests: pendingRequests,
          totalVaccine: totalVaccine,
          inventories: inventories,
          allocations: allocations,
          loading: loading,
          healthPoints: healthPoints,
          fetchFacilities: fetchFacilities,
          facilityRequests: facilityRequests,
          pendingFacilityRequest: pendingFacilityRequest,
          fetchRequests:fetchRequests
        }}
      >
        <aside className="sidebar">
          <h2 className="logo">VaxControl</h2>

          <nav>
            <div>
              <Link href="/admin/dashboard">Dashboard</Link>
            </div>
            <div>
              <Link href="/admin/points">Health Centers</Link>
            </div>
            <div>
              {" "}
              <Link href="/admin/vaccine">Vaccines</Link>
            </div>
            <div>
              {" "}
              <Link href="/admin/inventory">Inventory</Link>
            </div>
            <div className="flex">
              <Link href="/admin/requests">Requests</Link>
              {!loading && (
                <div style={{ marginLeft: "-10px" }} className="notify">
                  {pendingRequests.length}
                </div>
              )}
            </div>
            <div>
              <Link href="/admin/reports">Reports</Link>
            </div>
          </nav>

          <button
            className="logout"
            onClick={() => {
              (router.push("/login"), localStorage.removeItem("user"));
            }}
          >
            Logout
          </button>
        </aside>

        <main className="w-full">
          <header className="ds-header header p-l-r-30 p-30">
            <div className="avatar-name">
              <h2>
                <span style={{ color: "grey" }}>Central Control</span>{" "}
                <strong>{getTitle()}</strong>
              </h2>
              <h4 className="reduce-gap-1">
                {" "}
                <strong style={{ color: "red" }}>{weekDay}, </strong>
                <span style={{ color: "gray" }}>{todayDate}</span>
              </h4>
            </div>

            <div
              style={{ alignContent: "center" }}
              className="flex gap-10 justify-c"
            >
              <div className="admin-badge">
                {user ? (
                  <span>
                    {user?.name?.split(" ")[0]?.slice(0, 1).toUpperCase()}
                    {user?.name?.split(" ")[1]?.slice(0, 1).toUpperCase()}{" "}
                  </span>
                ) : (
                  <span></span>
                )}
              </div>
              <span className="ms-name text-c p-10">{user?.name}</span>
            </div>
            {/* </div> */}
          </header>
          <header className="ms-header fxd-c">
            <section className="flex align-item-c fxd-r justify-between bg-white p-5 border-r-5">
              <Hamburger />
              <div className="w-70p">
                <h2>Vax Control</h2>
              </div>

              <div
                className={`admin-badge ${user ? "" : "admin-badge-hidden"}`}
              >
                {user ? (
                  <span>
                    {user?.name?.split(" ")[0]?.slice(0, 1).toUpperCase()}
                    {user?.name?.split(" ")[1]?.slice(0, 1).toUpperCase()}{" "}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </section>
            <section>
              <div className="avatar-name p-l-r-30">
                <h2>
                  <span style={{ color: "grey" }}>Central Control</span>{" "}
                  <strong>{getTitle()}</strong>
                </h2>
                <h4 className="reduce-gap-2" style={{ marginTop: "-8px" }}>
                  <strong style={{ color: "red", fontSize: "0.8rem" }}>
                    {weekDay},{" "}
                  </strong>
                  <span style={{ color: "gray" }}>{todayDate}</span>
                </h4>
              </div>
            </section>

            {/* </div> */}
          </header>
          <section className="content">{children}</section>
        </main>
      </userContext.Provider>
    </main>
  );
}
