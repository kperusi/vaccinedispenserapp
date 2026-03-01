"use client";
import getDate from "../../utils/date";
import { userContext } from "../../context/userContext";
import { useContext, useEffect, useState } from "react";

export default function AdminRequests() {
  // const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
const {requests,fetchRequests}=useContext(userContext)

  console.log(requests)
  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     const res = await fetch("/api/get-requests");
  //     const data = await res.json();
  //     setRequests(data);
  //   };
  //   fetchRequests();
  // }, []);

  const approveRequest = async (id) => {
    const res = await fetch(`/api/get-requests/${id}/approve`, {
      method: "POST",
    });
    const data = await res.json();
    setMessage(data.message);
    fetchRequests();
  };

  const rejectRequest = async (id) => {
    const res = await fetch(`/api/get-requests/${id}/reject`, {
      method: "POST",
    });
    const data = await res.json();
    setMessage(data.message);
    fetchRequests();
  };

  return (
    <div className="container">
      <h2 style={{margin:'30px 0px'}}>Vaccine Requests</h2>
      {message && <p className="message">{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Health Center</th>
            <th>Vaccine</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td className="text-l">{r.facility}</td>
              <td className="text-l">{r.vaccine}</td>
              <td className="text-l">{r.quantity_requested}</td>
              <td className={`status text-l ${r.status==='pending'?'color-red':'color-green'}`}>{r.status}</td>
              <td className="text-l">{getDate(r.created_at)}</td>
              <td className="text-l">
                {r.status === "pending" && (
                  <>
                    <button
                      className="approve"
                      onClick={() => approveRequest(r.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => rejectRequest(r.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <style jsx>{`
        .container {
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }

        h1 {
          margin-bottom: 15px;
          color: #111827;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          background: #f3f4f6;
          font-weight: 600;
        }

        .status.pending { color: orange; font-weight: bold; }
        .status.approved { color: green; font-weight: bold; }
        .status.rejected { color: red; font-weight: bold; }

        button {
          padding: 6px 12px;
          margin-right: 6px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .approve {
          background: #10b981;
          color: white;
        }

        .approve:hover {
          background: #059669;
        }

        .reject {
          background: #ef4444;
          color: white;
        }

        .reject:hover {
          background: #dc2626;
        }

        .message {
          background: #e0f2fe;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 6px;
        }
      `}</style> */}
    </div>
  );
}
