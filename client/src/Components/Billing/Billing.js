
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

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/bills/delete/${id}`
      );
      if (response.status === 200) {
        alert("Bill deleted successfully");
        setBills((prevBills) => prevBills.filter((bill) => bill.id !== id));
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  
  const handleAddBill = async (billType) => {
    try {
      const response = await axios.post("http://localhost:5000/bills/create", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newBill = response.data;
      const { bill_number, created_at } = newBill;
  
      navigate(`/billing/${bill_number}/add/${billType}`);
      setBills((prevBills) => [
        ...prevBills,
        { bill_number, created_at: new Date(created_at).toLocaleString() },
      ]);
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
        <button onClick={() => handleAddBill("party")}>
          Add New Bill Party
        </button>
        <button>Restore</button>
      </div>

      <div className="tab-container">
        <Table striped bordered hover className="tabb">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Created at</th>
              <th>Bill Number</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => (
              <tr key={bill.bill_number}>
                <td>{index + 1}</td>
                <td>{bill.created_at}</td>
                <td>{bill.bill_number}</td>
                <td>
                  <Link to={`/billing/${bill.bill_number}/add`}>
                    <button>View</button>
                  </Link>
                  <button onClick={() => deleteProduct(bill.id)}>
                    {" "}
                    Delete
                  </button>
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
