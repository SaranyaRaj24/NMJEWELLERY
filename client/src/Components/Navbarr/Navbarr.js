
import React from "react";
import "../Navbarr/Navbarr.css";
import { Link } from "react-router-dom";
import logo from "../../Assets/Logo.jpg"; 

const Navbarr = () => {
  return (
    <>
      <div className="nav-bar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="positionn">
          <Link to="/home">
            <b style={{ cursor: "pointer", color: "white", fontSize: "20px" }}>
              {" "}
              Products{" "}
            </b>
          </Link>
          <Link to="/billing">
            <b style={{ cursor: "pointer", color: "white", fontSize: "20px" }}>
              {" "}
              Billing{" "}
            </b>
          </Link>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "aliceblue",
          width: "100%",
          height: "100vh",
          position: "fixed",
          zIndex: -1,
        }}
      ></div>
    </>
  );
};

export default Navbarr;
