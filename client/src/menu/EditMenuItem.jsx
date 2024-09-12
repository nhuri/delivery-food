// // import React, { useState } from "react";
// // import {
// //   useEditRestaurantMutation,
// //   useGetRestaurantQuery,
// // } from "../slices/restaurantApiSlice";
// // import Button from "react-bootstrap/Button";
// // import { useUpdateMenuItemMutation } from "../slices/menuApiSlice";

// // const EditMenuItem = ({ id, setEditMode }) => {
// //   const [inputName, setInputName] = useState("");
// //   const [inputPrice, setInputPrice] = useState("");
// //   const [inputDescription, setInputDescription] = useState("");
// //   const [inputCategory, setInputCategory] = useState("");
// //   const [editMenuItem] = useUpdateMenuItemMutation();
// //   const { refetch } = useGetRestaurantQuery();

// //   const handleEditMenuItem = async (e) => {
// //     e.preventDefault();
// //     const menuItemId = id;
// //     const response = await editMenuItem({
// //       menuItemId,
// //       data: {
// //         name: inputName,
// //         price: inputPrice,
// //         address: inputDescription,
// //         category: inputCategory,
// //       },
// //     }).unwrap();
// //     refetch();
// //     setEditMode(false);
// //   };
// //   return (
// //     <div className="editMenuItem">
// //       <h4>Edit the MenuItem</h4>
// //       <input
// //         onChange={(e) => {
// //           setInputName(e.target.value);
// //         }}
// //         type="text"
// //         placeholder="Enter the name"
// //       />

// //       <input
// //         onChange={(e) => {
// //           setInputPrice(e.target.value);
// //         }}
// //         type="text"
// //         placeholder="Enter the price link"
// //       />
// //       <input
// //         onChange={(e) => {
// //           setInputDescription(e.target.value);
// //         }}
// //         type="text"
// //         placeholder="Enter the description"
// //       />
// //       <input
// //         onChange={(e) => {
// //           setInputCategory(e.target.value);
// //         }}
// //         type="text"
// //         placeholder="Enter the category"
// //       />
// //       <Button
// //         onClick={(e) => {
// //           handleEditMenuItem(e);
// //         }}
// //       >
// //         Edit MenuItem
// //       </Button>
// //     </div>
// //   );
// // };

// // export default EditMenuItem;

// import React, { useState } from "react";
// import { useUpdateMenuItemMutation } from "../slices/menuApiSlice";
// import Button from "react-bootstrap/Button";

// const EditMenuItem = ({ id, setEditMode }) => {
//   const [inputName, setInputName] = useState("");
//   const [inputPrice, setInputPrice] = useState("");
//   const [inputDescription, setInputDescription] = useState("");
//   const [inputCategory, setInputCategory] = useState("");
//   const [editMenuItem] = useUpdateMenuItemMutation();

//   const handleEditMenuItem = async (e) => {
//     e.preventDefault();
//     const menuItemId = id;
//     await editMenuItem({
//       menuItemId,
//       data: {
//         name: inputName,
//         price: inputPrice,
//         description: inputDescription,
//         category: inputCategory,
//       },
//     }).unwrap();
//     setEditMode(false);
//   };

//   return (
//     <div
//       style={{
//         border: "1px solid #ddd",
//         borderRadius: "8px",
//         padding: "20px",
//         backgroundColor: "#f9f9f9",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         maxWidth: "500px",
//         margin: "auto",
//       }}
//     >
//       <h4 style={{ marginBottom: "20px" }}>Edit the MenuItem</h4>
//       <form onSubmit={handleEditMenuItem}>
//         <div style={{ marginBottom: "15px" }}>
//           <label
//             htmlFor="name"
//             style={{ display: "block", marginBottom: "5px" }}
//           >
//             Name
//           </label>
//           <input
//             id="name"
//             type="text"
//             value={inputName}
//             onChange={(e) => setInputName(e.target.value)}
//             placeholder="Enter the name"
//             style={{
//               width: "100%",
//               padding: "10px",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label
//             htmlFor="price"
//             style={{ display: "block", marginBottom: "5px" }}
//           >
//             Price
//           </label>
//           <input
//             id="price"
//             type="text"
//             value={inputPrice}
//             onChange={(e) => setInputPrice(e.target.value)}
//             placeholder="Enter the price"
//             style={{
//               width: "100%",
//               padding: "10px",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label
//             htmlFor="description"
//             style={{ display: "block", marginBottom: "5px" }}
//           >
//             Description
//           </label>
//           <input
//             id="description"
//             type="text"
//             value={inputDescription}
//             onChange={(e) => setInputDescription(e.target.value)}
//             placeholder="Enter the description"
//             style={{
//               width: "100%",
//               padding: "10px",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "20px" }}>
//           <label
//             htmlFor="category"
//             style={{ display: "block", marginBottom: "5px" }}
//           >
//             Category
//           </label>
//           <input
//             id="category"
//             type="text"
//             value={inputCategory}
//             onChange={(e) => setInputCategory(e.target.value)}
//             placeholder="Enter the category"
//             style={{
//               width: "100%",
//               padding: "10px",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//               boxSizing: "border-box",
//             }}
//           />
//         </div>
//         <Button type="submit" style={{ width: "100%" }}>
//           Edit MenuItem
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default EditMenuItem;
import React, { useState } from "react";
import { useUpdateMenuItemMutation } from "../slices/menuApiSlice";
import Button from "react-bootstrap/Button";

const EditMenuItem = ({ menuId, setEditMode }) => {
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [editMenuItem] = useUpdateMenuItemMutation();
  console.log(menuId);

  const handleEditMenuItem = async (e) => {
    e.preventDefault();
    try {
      await editMenuItem({
        menuId,
        data: {
          name: inputName,
          price: inputPrice,
          description: inputDescription,
          category: inputCategory,
        },
      }).unwrap();
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update menu item: ", error);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        marginTop: "20px",
      }}
    >
      <h4 style={{ marginBottom: "20px" }}>Edit the MenuItem</h4>
      <form onSubmit={handleEditMenuItem}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter the name"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="price"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Price
          </label>
          <input
            id="price"
            type="text"
            value={inputPrice}
            onChange={(e) => setInputPrice(e.target.value)}
            placeholder="Enter the price"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
            placeholder="Enter the description"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="category"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
            placeholder="Enter the category"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>
        <Button type="submit" style={{ width: "100%" }}>
          Edit MenuItem
        </Button>
      </form>
    </div>
  );
};

export default EditMenuItem;
