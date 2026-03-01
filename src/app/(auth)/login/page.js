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
  const [visible,setVisible]=useState()
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
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

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

const handlePasswordVisible=()=>{
  setVisible(!visible)
}

  return (
    <main
      style={{
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="flex fxd-c login-cx"
    >
      <div className="login-form flex fxd-c bg-white border-r-8 b-1">
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
            <input
              type={visible?'password':'text'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Image alt="password visibility" width={15} height={15}src='/images/visibility_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'/>
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
