"use client";
import { useContext, useEffect, useState } from "react";
import "../../styles/styles.css";
import { useRouter } from "next/navigation";
import { userContext } from "../../context/userContext";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(true);
  const { user, setUser } = useContext(userContext);

  // Fake login for demo; replace with real API later
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      // Redirect based on role
      if (data.role === "CONTROL") {
        router.push("/admin/dashboard");
      } else {
        router.push(`points/dashboard/${data.id}`);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handlePasswordVisible = () => {
    setVisible(!visible);
  };
  console.log(visible);
  return (
    <main
      style={{
        height: "100vh",
      }}
      className="flex fxd-r login-cx"
    >
      <div className="ds-bg">
        <h2>
          <strong>Welcome Back </strong>
          Vax Disperser Control
        </h2>
      </div>
      <div className="login-form flex fxd-c">
        <div className="ms-bg"></div>
        <div className="flex fxd-c p-30  input-group gap-20 justify-c align-item-c">
          <div className="flex fxd-c w-full ">
            <h2 className="color-black">Welcome back to Vax</h2>
            <h3 className="color-grey">Login to Continue</h3>
          </div>
          <div className="flex fxd-c w-full p-t-20">
            <label>Username</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex fxd-c w-full">
            <label>Password</label>
            {/* <div className="password-input-cx flex"> */}
            <input
              type={visible ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <Image
              style={{ alignSelf: "flex-end" }}
              onClick={handlePasswordVisible}
              alt="password visibility"
              width={20}
              height={20}
              src={`${visible ? "/visibility_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" : "/visibility_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"}`}
            />
            {/* </div> */}
          </div>

          <button
            onClick={handleLogin}
            className="bg-darkblue outline-none border-none border-r-8 p-15 m-t-20 w-50p"
          >
            Login
          </button>
          <div style={{ height: "50px" }} className="p-10">
            {" "}
            {error && <p className="color-red">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
