// import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
// import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
// import {
//   useCreateMenuItemMutation,
//   useGetMenuItemsQuery,
// } from "../slices/menuApiSlice";

// const AddMenuItem = ({ setActiveKey }) => {
//   const [image, setImage] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//         setInputLogo(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//         setInputLogo(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const [inputName, setInputName] = useState("");
//   const [inputLogo, setInputLogo] = useState("");
//   const [inputDescription, setInputDescription] = useState("");
//   const [inputPrice, setInputPrice] = useState("");
//   const [addMenuItem] = useCreateMenuItemMutation();
//   const { refetch } = useGetMenuItemsQuery();

//   const handleAddMenuItem = async (e) => {
//     e.preventDefault();
//     const response = await addMenuItem({
//       name: inputName,
//       logo: inputLogo,
//       description: inputDescription,
//       price: inputPrice,
//     }).unwrap();
//     setActiveKey(null);
//     refetch();
//   };
//   return (
//     <>
//       <h4>Add menuItem</h4>
//       <InputGroup size="sm" className="mb-3">
//         <Form.Control
//           placeholder="name"
//           onChange={(e) => setInputName(e.target.value)}
//         />
//       </InputGroup>
//       <div>
//         <InputGroup size="sm" className="mb-3">
//           <Form.Control
//             type="text"
//             placeholder="Enter image URL or drag and drop an image"
//             value={inputLogo}
//             onChange={(e) => setInputLogo(e.target.value)}
//           />
//         </InputGroup>
//         <div
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           style={{
//             border: "2px dashed #ccc",
//             borderRadius: "4px",
//             padding: "20px",
//             textAlign: "center",
//             marginBottom: "20px",
//           }}
//         >
//           Enter image URL or Drag & Drop your image here or click to select
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{ display: "none" }}
//             id="fileInput"
//           />
//           <label
//             htmlFor="fileInput"
//             style={{ display: "block", cursor: "pointer" }}
//           >
//             <Button variant="primary">Choose Image</Button>
//           </label>
//         </div>
//         {image && (
//           <img
//             src={image}
//             alt="Preview"
//             style={{ width: "100%", maxWidth: "400px" }}
//           />
//         )}
//       </div>
//       <InputGroup size="sm" className="mb-3">
//         <Form.Control
//           placeholder="Description"
//           onChange={(e) => setInputDescription(e.target.value)}
//         />
//       </InputGroup>
//       <InputGroup size="sm" className="mb-3">
//         <Form.Control
//           placeholder="price"
//           onChange={(e) => setInputPrice(e.target.value)}
//         />
//       </InputGroup>
//       <Button onClick={handleAddMenuItem}>Add MenuItem</Button>
//     </>
//   );
// };

// export default AddMenuItem;

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {
  useCreateMenuItemMutation,
  useGetMenuItemsQuery,
} from "../slices/menuApiSlice";

const AddMenuItem = ({ setAddMode }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePath(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePath(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [addMenuItem] = useCreateMenuItemMutation();
  const { refetch } = useGetMenuItemsQuery();

  //   const uploadImage = async (file) => {
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     const response = await fetch("http://localhost:8000", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error("העלאת התמונה נכשלה");
  //     }

  //     const result = await response.json();
  //     return result.filePath;
  //   };
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/uploads", {
      // השתמש בנתיב יחסי
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("העלאת התמונה נכשלה");
    }

    const result = await response.json();
    return result.filePath;
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    let uploadedImagePath = "";

    if (imageFile) {
      try {
        uploadedImagePath = await uploadImage(imageFile);
      } catch (error) {
        alert("העלאת התמונה נכשלה");
        return;
      }
    }

    const response = await addMenuItem({
      name: inputName,
      logo: uploadedImagePath || imagePath,
      description: inputDescription,
      price: inputPrice,
      category: inputCategory,
    }).unwrap();
    setAddMode(null);
    refetch();
  };

  return (
    <>
      <h4>Add Menu Item</h4>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="name"
          onChange={(e) => setInputName(e.target.value)}
        />
      </InputGroup>
      <div>
        <InputGroup size="sm" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter image URL or drag and drop an image"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
          />
        </InputGroup>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: "2px dashed #ccc",
            borderRadius: "4px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Drag & Drop your image here or click to select
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            style={{ display: "block", cursor: "pointer" }}
          >
            <Button variant="primary">Choose Image</Button>
          </label>
        </div>
        {imagePath && (
          <img
            src={imagePath}
            alt="Preview"
            style={{ width: "100%", maxWidth: "400px" }}
          />
        )}
      </div>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Description"
          onChange={(e) => setInputDescription(e.target.value)}
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Price"
          onChange={(e) => setInputPrice(e.target.value)}
        />
      </InputGroup>
      <InputGroup size="sm" className="mb-3">
        <Form.Control
          placeholder="Category"
          onChange={(e) => setInputCategory(e.target.value)}
        />
      </InputGroup>
      <Button onClick={handleAddMenuItem}>Add Menu Item</Button>
    </>
  );
};

export default AddMenuItem;
