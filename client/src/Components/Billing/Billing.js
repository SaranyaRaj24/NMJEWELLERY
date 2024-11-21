import React, { useState, useEffect } from "react";
import "../Billing/Billing.css";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/esm/Table";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbarr from "../Navbarr/Navbarr";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/bills/getAll");
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };
    fetchBills();
  }, []);

  // const deleteProduct = async (id) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:5000/bills/delete/${id}`
  //     );
  //     if (response.status === 200) {
  //       alert("Bill deleted successfully");
  //       setBills((prevBills) => prevBills.filter((bill) => bill.id !== id));
  //     }
  //   } catch (error) {
  //     console.error("Error deleting bill:", error);
  //   }
  // };

  const handleAddBill = async (billType) => {
    try {
      navigate(`/billing/bill`);
      setBills((prevBills) => [...prevBills]);
    } catch (error) {
      console.error("Error creating a new bill:", error);
    }
  };

  return (
    <>
      <Navbarr />
      <div className="bill">
        <button onClick={() => handleAddBill("customer")}>
          Add New Bill Customer
        </button>

        <button onClick={() => navigate("/restore")}>Restore</button>
      </div>

      <div className="tab-container">
        <Table striped bordered hover className="tabb">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Created at</th>
              <th>Bill Name</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => (
              <tr key={bill.bill_number}>
                <td>{bill.id}</td>
                <td>{bill.created_at}</td>
                <td>{bill.bill_name}</td>
                <td>
                  <Link to={`/billing/${bill.bill_number}`}>
                    <button
                      style={{
                        backgroundColor: "#25274D",
                        color: "white",
                        fontSize: "1rem",
                      }}
                    >
                      View
                    </button>
                  </Link>
                  {/* <button onClick={() => deleteProduct(bill.id)}>
                    {" "}
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Billing;
