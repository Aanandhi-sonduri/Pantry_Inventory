"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  InputAdornment,
  IconButton,
  Grid, // Import Grid component
} from "@mui/material";
import { firestore } from "./firebase";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Checkbox from "@mui/material/Checkbox";

// import bgImage from "./assets/";

const styles = {

  footer: {
    display: "flex",
    justifyContent: "center", // Center the image horizontally
    alignItems: "center",     // Center the image vertically
    height: "60px",           // Set a fixed height for the footer
    backgroundColor: "#f8f8f8", // Optional: set a background color for the footer
    position: "absolute",      // Position the footer at the bottom
    bottom: 0,
    width: "100%",
  },
  footerImage: {
    maxWidth: "100%",         // Make sure the image is responsive
    height: "auto",           // Maintain aspect ratio
  },
  
  mainContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "left", 
    flexDirection: "column",
    gap: 2,
    fontFamily: "Roboto, sans-serif",
    padding: "2px",
    backgroundImage: `url(/assets/background.jpeg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    bgcolor: "#ebe1d7",
    
   
  },
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 400,
    bgcolor: "#ffffff",
    border: "2px solid #6200ea",
    borderRadius: "8px",  
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    transform: "translate(-50%, -50%)",
  },
  pantryBox: {
    width: "780px", // Adjust this value to make the box wider
    height: "400px",
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "16px",
    bgcolor: "#ffffff",
    marginLeft: "110px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    },
    "&::-webkit-scrollbar": {
      width: "12px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f0f0f0",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "10px",
      border: "3px solid #f0f0f0",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555",
    },
},

  itemBox: {
    width: "180px",
    height: "170px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    bgcolor: "#ebe1d7",
    borderRadius: "4px",
    padding: "5px",
    marginBottom: "10px",
    position: "relative",
     // Added for positioning of buttons
     "&:hover": {
      bgcolor: "#ccbcb6", // Background color on hover
  },
  },
  button: {
    backgroundColor: "#ff6f61",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#ff4a4a",
    },
  },
  deleteButton: {
    position: "absolute",
    top: "8px",
    right: "8px", // Change this to 'right' to move the button to the top right corner
    backgroundColor: "#ff1744",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#c81032",
    },
  },
  header: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    fontSize: "1.5rem",
    color: "#000000",
   
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      width: "800px",
      borderRadius: "50px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "box-shadow 0.3s ease",
      "&:hover": {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
      "&.Mui-focused": {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    },
    "& .MuiInputAdornment-root": {
      color: "#888",
    },
  },
  searchBarContainer: {
    display: 'flex',
    justifyContent: 'left',
    width: '100%',
    marginLeft: '112px'
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
};

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,dangerouslyAllowBrowser: true });

export async function getGroqChatCompletion(item) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Give me the  nutritional values of ${item} as a simple paragraph which is easy to understand, dont repeat the prompt in the response `,
      },
    ],
    model: "llama3-8b-8192",
  });
  return chatCompletion.choices[0]?.message?.content || ""; // Return the nutritional values
}



export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [nutritionalInfo, setNutritionalInfo] = useState({});


  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];

    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPantry(pantry);
    } else {
      setFilteredPantry(
        pantry.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, pantry]);

  const addItem = async (item, count) => {
    if (!item.trim()) {
      alert("Item name cannot be empty!");
      return;
    }
  const nutritionalInfo = await getGroqChatCompletion(item);
  
    // Handle the fetched nutritional information here as per your requirement
  console.log(nutritionalInfo); // You can log it to see the structure

    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().count || 0;
      await setDoc(docRef, { count: currentCount + count });
    } else {
      await setDoc(docRef, { count: count });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const count = docSnap.data().count;
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      await updatePantry();
    }
  };

  const handleSearch = () => {
    if (searchQuery === "") {
      setFilteredPantry(pantry);
    } else {
      setFilteredPantry(
        pantry.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  const handleCheckboxChange = async (itemName) => {
    const newSelectedItems = { ...selectedItems };
    newSelectedItems[itemName] = !newSelectedItems[itemName]; // Toggle selected state
  
    setSelectedItems(newSelectedItems);
  
    // Fetch nutritional info only when checked
    if (newSelectedItems[itemName]) {
      const info = await getGroqChatCompletion(itemName);
      setNutritionalInfo((prev) => ({
        ...prev,
        [itemName]: info, // Store nutritional info for the selected item
      }));
    } else {
      // Remove nutritional info if unchecked
      setNutritionalInfo((prev) => {
        const newInfo = { ...prev };
        delete newInfo[itemName];
        return newInfo;
      });
    }
  };
  

  return (
    <Box sx={styles.mainContainer}>
      <Typography variant="h1" textAlign="center" sx={{ ...styles.header, mt: 7 ,letterSpacing: "1rem", mb:1 }}>
        THE PANTRY SHACK
      </Typography>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Item
          </Typography>
          <Stack spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic-count"
              label="Quantity"
              variant="outlined"
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value, 10))}
            />
            <Button
              variant="contained"
              sx={{ ...styles.button, backgroundColor: "black" }} 
              onClick={() => {
                addItem(itemName, itemCount);
                setItemName("");
                setItemCount(1);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box sx={styles.searchBarContainer}>
          <TextField
               sx={{
                ...styles.searchField,
                "& .MuiOutlinedInput-root": {
                  height: "40px", // Reduce the height
                  padding: "0 10px", // Adjust padding
                  width: "600px",
                  mt: 4,
                  backgroundColor: 'white'
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.875rem", // Adjust font size if needed
                },
              }}
              variant="outlined"
              placeholder="Search for items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                          <SearchIcon />
                      </InputAdornment>
                  ),
              }}
          />
          <Button variant="contained" onClick={handleOpen} sx={{ ...styles.button, marginLeft: '15px',backgroundColor: 'black',height:"38px",mt:4, // Set background color to black
              "&:hover": {
                backgroundColor: '#333', // Darker shade on hover
              }, }}>
              <AddIcon />
              Add New Item
          </Button>
          {/* <Typography variant="h6" sx={{ textAlign: "center", mt:4, ml: 14 }}>
              NUTRITIONAL INFORMATION
          </Typography> */}
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4, ml: 14, color: "black" }}>
              NUTRITIONAL INFORMATION
          </Typography>

      </Box>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={8}> {/* Pantry box */}
          <Box sx={styles.pantryBox}>
            <Grid container spacing={2} justifyContent="center">
              {filteredPantry.map((item) => (
                <Grid item xs={3} key={item.name}> {/* Change to xs={3} for 4 items per row */}
                  <Box sx={styles.itemBox}>
                    <IconButton
                      aria-label="delete"
                      onClick={async () => {
                        await deleteDoc(doc(collection(firestore, "pantry"), item.name));
                        await updatePantry();
                      }}
                      sx={styles.deleteButton}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h7" style={{ textAlign: "left", width: "100%" , color: "black"}}>
                      Qty: {item.count}
                    </Typography>
                    <Typography variant="h5" style={{ textAlign: "center", width: "100%" , color: "black"}}>
                      {item.name}
                    </Typography>
                    <Box sx={styles.buttonGroup}>
                      <IconButton aria-label="increase" onClick={() => addItem(item.name, 1)}>
                        <AddCircleOutlineIcon color="black" />
                      </IconButton>
                      <Checkbox
                        checked={!!selectedItems[item.name]} // Check if the item is selected
                        onChange={() => handleCheckboxChange(item.name)} // Handle checkbox change
                      />
                      <IconButton aria-label="decrease" onClick={() => removeItem(item.name)}>
                        <RemoveCircleOutlineIcon color="black" />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={4}> {/* Nutritional info box */}
          <Box sx={{
              ...styles.pantryBox,
              marginLeft: '-30px', // Space between pantry box and nutritional info box
              width: "400px", // Ensure the box uses full width of the grid item
            }}>
            {Object.entries(nutritionalInfo).length === 0 ? (
              <Typography variant="body1" textAlign="center">
                Select an item to see nutritional info
              </Typography>
            ) : (
              Object.entries(nutritionalInfo).map(([item, info]) => (
                <Box key={item} sx={{ marginBottom: 2, color: "black" }}>
                  <Typography variant="body1">{info}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
