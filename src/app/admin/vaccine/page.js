"use client";
import { useEffect, useState } from "react";
import "../../styles/styles.css";

export default function VaccinesPage() {
  const [vaccines, setVaccines] = useState([]);
  const [isVaccineModalShow, setIsVaccineModalShow] = useState(false);
  const [user, setUser] = useState("");
  const [form, setForm] = useState({
    name: "",
    code: "",
    manufacturer: "",
    doses_required: "",
    interval_days: "",
    description: "",
    age_max: "",
    age_min: "",
  });

  // useEffect(() => {
  //   async function fetchVaccines() {
  //     const res = await fetch("/api/get-vaccines");
  //     const data = await res.json();
  //     localStorage.setItem("vaccines", JSON.stringify(data));
  //     setVaccines(data);
  //   }
  //   fetchVaccines();
  // }, []);

  useEffect(() => {
    async function getVaccines() {
      setVaccines(JSON.parse(localStorage.getItem("vaccines")));
      setUser(JSON.parse(localStorage.getItem("user")));
    }

    getVaccines();
  }, []);

  async function fetchVaccines() {
    console.log("fetching vaccine");

    const res = await fetch("/api/get-vaccines");
    const data = await res.json();
    localStorage.setItem("vaccines", JSON.stringify(data));

    const localVaccine = JSON.parse(localStorage.getItem("vaccines")) || [];
    setVaccines(localVaccine);
  }

  async function handleAddVaccine(e) {
    e.preventDefault();

    const res = await fetch("/api/create-vaccine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, user }),
    });

    fetchVaccines();

    const localVaccine = JSON.parse(localStorage.getItem("vaccines")) || [];
    setVaccines(localVaccine);

    console.log(localVaccine);
    if (res.status === 201) {
      setForm({
        name: "",
        manufacturer: "",
        code: "",
        description: "",
        age_max: "",
        age_min: "",
        interval_days: "",
        doses_required: "",
      });
    }

    // fetchVaccines();
  }

  return (
    <main className="vaccine-container scroll-container">
      <section className="flex justify-between p-tb-14">
        <h2>Vaccine Management</h2>
        <button
          className="p-l-r-20 btn-primary h-45"
          onClick={() => setIsVaccineModalShow(true)}
        >
          + Add Vaccine
        </button>
      </section>

      {/* Add Vaccine Form */}

      {isVaccineModalShow && (
        <section className="modal-show">
          <div className="class-modal">
            <div className="flex fxd-r justify-between w-full">
              <h3 className="p-tb-5">Add New Vaccines</h3>
              <button
                className="btn-cancel"
                onClick={() => setIsVaccineModalShow(false)}
              >
                X
              </button>
            </div>

            <form onSubmit={handleAddVaccine} className="flex fxd-c">
              <div className="input-group">
                <label>Vaccine Name</label>
                <input
                  placeholder="Vaccine Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-20">
                <div className="input-group w-50p">
                  <label>Manufacturer</label>
                  <input
                    placeholder="Manufacturer"
                    value={form.manufacturer}
                    onChange={(e) =>
                      setForm({ ...form, manufacturer: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Code</label>
                  <input
                    placeholder="Code"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </div>
                <div className="input-group w-50p">
                  <label>Doses Required</label>
                  <input
                    placeholder="Doses Required"
                    value={form.doses_required}
                    onChange={(e) =>
                      setForm({ ...form, doses_required: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex w-full gap-20">
                <div className="input-group w-50p">
                  <label>Days Interval</label>
                  <input
                    placeholder="Days Interval"
                    value={form.interval_days}
                    onChange={(e) =>
                      setForm({ ...form, interval_days: e.target.value })
                    }
                  />
                </div>
                <div className="input-group w-50p">
                  <label>Max. Age</label>
                  <input
                    placeholder="Max. Age"
                    value={form.age_max}
                    onChange={(e) =>
                      setForm({ ...form, age_max: e.target.value })
                    }
                  />
                </div>
                <div className="input-group w-50p">
                  <label>Min. Age</label>
                  <input
                    placeholder="Min. Age"
                    value={form.age_min}
                    onChange={(e) =>
                      setForm({ ...form, age_min: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex w-full gap-20"></div>

              <div className="input-group m-b-20">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                  }}
                />
              </div>

              <div className="flex gap-20 justify-c ">
                {/* <button
                  className="p-l-r-20 bg-none outline-none border-grey b-1 color-black border-r-8"
            
                >
                  Back
                </button> */}
                <button className="btn-add p-l-r-20">Save Vaccine</button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Vaccine Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Manufacturer</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {vaccines.map((v) => (
            <tr
              style={{ borderBottom: "1px solid #dfdfdf" }}
              key={v.id}
              className="text-l"
            >
              <td className="text-l">{v.name}</td>
              <td className="text-l">{v.code}</td>
              <td className="text-l">{v.manufacturer}</td>
              <td className="text-l">{v.description}</td>
              <td>
                <span className={v.status ? "active" : "disabled"}>
                  {v.status ? "Active" : "Disabled"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
