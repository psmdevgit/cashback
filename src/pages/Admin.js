import React, { useEffect, useState } from "react";

function Admin() {

  const [uname, setUname] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("Stored user:", user);

    if (user && user.role === "1") {
      setUname(user.username);
    } else {
      // not admin → redirect to login
      window.location.href = "/";
    }
  }, []);   // run only once

  return (
    <h2>Welcome Admin Page {uname}</h2>
  );
}

export default Admin;