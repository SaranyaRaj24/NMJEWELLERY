
import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { RiAddCircleFill, RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Home/Home.css";
import Navbarr from "../Navbarr/Navbarr";

const RoundedTextField = styled(TextField)({
  maxWidth: 300,
  backgroundColor: "#f9f9f9",
  marginTop: "9rem",
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    paddingLeft: "16px",
    "& fieldset": {
      borderColor: "#ccc",
    },
    "&:hover fieldset": {
      borderColor: "#888",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
});


const StyledCard = styled(Card)({
  backgroundColor: "#25274D", 
  borderRadius: "15px",
  border: "1px solid #ffffff", 
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  width: "180px",
  margin: "10px",
  "&:hover": {
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
  },
});

const StyledButton = styled(Button)({
  borderRadius: "20px",
  padding: "8px 20px",
  fontSize: "16px",
});

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#fff",
  },
});

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [lotNumber, setLotNumber] = useState("");
  const [lotNumbers, setLotNumbers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/lot");
        console.log("Fetched Lots:", response.data);
        if (response.data && Array.isArray(response.data.result)) {
          setLotNumbers(response.data.result);
        } else {
          console.error(
            "API response does not contain 'result' array:",
            response.data
          );
          setLotNumbers([]);
        }
      } catch (error) {
        console.error("Error fetching lots:", error);
        setLotNumbers([]);
      }
    };

    fetchLots();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLotNumber("");
  };

  const handleLotNumberChange = (e) => {
    setLotNumber(e.target.value);
  };

  const handleSaveLotNumber = async () => {
    if (lotNumber) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/lot/lot_info",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lot_name: lotNumber,
            }),
          }
        );

        const result = await response.json();

        console.log("Save Response:", result);

        if (response.ok) {
          const newLot = {
            id: result.newLot.id,
            lot_name: lotNumber,
          };

          setLotNumbers((prev) => [...prev, newLot]);
          setSuccessMessage("Lot created successfully!");
          setLotNumber("");
          handleClose();
        } else {
          console.error("Error:", result.msg);
          setSuccessMessage(result.msg || "Error creating lot.");
        }
      } catch (error) {
        console.error("Failed to save Lot Name:", error);
        setSuccessMessage("Failed to save Lot Name.");
      }
    } else {
      setSuccessMessage("Lot Name is required.");
    }
  };

  const handleDeleteLotNumber = (index) => {
    setDeleteIndex(index);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    const updatedLotNumbers = [...lotNumbers];
    updatedLotNumbers.splice(deleteIndex, 1);
    setLotNumbers(updatedLotNumbers);
    setDeleteConfirmationOpen(false);
    setSuccessMessage("Lot deleted successfully");
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmationOpen(false);
    setDeleteIndex(null);
  };

  const handleViewLotDetails = (lot_id, lot_name) => {
    navigate(`/products/${lot_id}?lotname=${lot_name}`);
  };

  const filteredLotNumbers = lotNumbers.filter((lot) =>
    lot.lot_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbarr />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <RoundedTextField
            label="Search Lot Name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Lot Name"
            fullWidth
          />
          <IconButton sx={{ ml: 1 }} disableRipple onClick={handleClickOpen}>
            <RiAddCircleFill
              style={{ marginTop: "9rem", marginLeft: "5rem" }}
              size={30}
              color="#25274D"
            />
          </IconButton>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Lot Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Lot Name"
              type="text"
              fullWidth
              variant="outlined"
              value={lotNumber}
              onChange={handleLotNumberChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSaveLotNumber}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <StyledDialog
          open={deleteConfirmationOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="delete-lot-number-dialog"
        >
          <DialogTitle
            sx={{ fontSize: "18px", fontWeight: "bold", color: "#1976d2" }}
          >
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete this Lot Name
            </Typography>
          </DialogContent>
          <DialogActions>
            <StyledButton
              onClick={handleCloseDeleteDialog}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </StyledButton>
            <StyledButton
              onClick={confirmDelete}
              color="primary"
              variant="contained"
            >
              Yes, Delete
            </StyledButton>
          </DialogActions>
        </StyledDialog>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 2,
            maxWidth: "100%",
          }}
        >
          {filteredLotNumbers.length > 0 ? (
            filteredLotNumbers.map((lot, index) => (
              <StyledCard key={index}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "white", 
                      mb: 1,
                      fontSize: "1.2rem",
                    }}
                  >
                    {lot.lot_name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    <IconButton onClick={() => handleDeleteLotNumber(index)}>
                      <RiDeleteBin6Line size={25} color="White" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleViewLotDetails(lot.id, lot.lot_name)}
                    >
                      <RiEyeLine size={25} color="white" />{" "}
                     
                    </IconButton>
                  </Box>
                </CardContent>
              </StyledCard>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No Lot name available.
            </Typography>
          )}
        </Box>
      </Box>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Home;
