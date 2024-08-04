// import React, { useState } from 'react';
// import { Modal, Box, Typography, TextField, Button } from '@mui/material';
// import { storage } from '../app/firebase'; // Import Firebase storage
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary methods for Firebase storage

// const AddItemModal = ({ open, handleClose, addItem }) => {
//   const [itemName, setItemName] = useState('');
//   const [itemCount, setItemCount] = useState(1);
//   const [imgUrl, setImgUrl] = useState('');

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const storageRef = ref(storage, `images/${file.name}`);
//       await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(storageRef);
//       setImgUrl(url);
//     }
//   };

//   const handleAddItem = () => {
//     if (!itemName || itemCount <= 0 || !imgUrl) {
//       alert('All fields are required');
//       return;
//     }
//     addItem(itemName, itemCount, imgUrl);
//     setItemName('');
//     setItemCount(1);
//     setImgUrl('');
//     handleClose();
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: 400,
//         bgcolor: '#ffffff',
//         border: '2px solid #6200ea',
//         borderRadius: '8px',
//         boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
//         p: 4,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 3,
//       }}>
//         <Typography id="modal-modal-title" variant="h6" component="h2">
//           Add Item
//         </Typography>
//         <TextField
//           label="Item Name"
//           variant="outlined"
//           fullWidth
//           value={itemName}
//           onChange={(e) => setItemName(e.target.value)}
//         />
//         <TextField
//           label="Quantity"
//           variant="outlined"
//           type="number"
//           fullWidth
//           value={itemCount}
//           onChange={(e) => setItemCount(parseInt(e.target.value))}
//         />
//         <Button
//           variant="outlined"
//           component="label"
//         >
//           Upload Image
//           <input
//             type="file"
//             hidden
//             onChange={handleUpload}
//           />
//         </Button>
//         {imgUrl && <Typography variant="body1">Image uploaded successfully.</Typography>}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleAddItem}
//         >
//           Add Item
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default AddItemModal;
