# 🍔 Delivery Food App

A full-stack web platform for online food ordering and restaurant management.  
Users can browse restaurants, view menus, place orders, and rate their experiences — all through a clean and modern web interface.  
Built with **React**, **Node.js (Express)**, and **MongoDB**, using **JWT authentication** for security.

---

## 🚀 Overview

This project implements the backend and frontend of a food delivery platform, including restaurant browsing, dynamic menus, order management, and user authentication.  
Some features (like real-time tracking and payment integrations) are planned for future versions.

---

## ✨ Implemented Features

- 🔐 **User & Restaurant Authentication** – implemented using JWT-based authentication with hashed passwords (bcrypt)  
- 🍽️ **Browse Restaurants & Dishes** – search and filter by cuisine, category, ratings, or location  
- 🧾 **Dynamic Menus** – view full menus with photos, prices, and customization options  
- 🚴 **Order Management** – users can create and view orders; order statuses are updated manually (future: real-time tracking)  
- ⭐ **Ratings & Reviews** – users can rate restaurants and dishes and view aggregated reviews  
- 🧠 **Admin Panel** – allows management of restaurants, menus, and orders through dedicated API routes  

---

## ⚙️ Features Planned (Not Yet Implemented)

- 💳 **Payment Integration** – Stripe, PayPal, Apple Pay, Google Pay  
- 🔔 **Notifications System** – live updates for order status, offers, and promotions  
- 📡 **Real-Time Order Tracking** – via WebSockets or Firebase  
- 📱 **Mobile App (React Native)**  

---

## 🧩 System Components

### 👤 User Profile
- Registration and login via JWT tokens  
- Secure password storage using bcrypt  
- Profile includes basic details, order history, and favorite restaurants  

### 🏪 Restaurant Profile
- Restaurant owners can manage menus and dishes  
- Includes name, logo, description, and cuisine type  
- Supports menu editing, adding/removing items, and price updates  

### 📦 Order Flow
1. User selects a restaurant and chooses dishes  
2. The system creates a new order and assigns a status (`Pending`, `Preparing`, `Delivered`, etc.)  
3. Order status updates are handled by the admin or restaurant side  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Web) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **Authentication** | JWT + bcrypt |
| **Hosting** Currently running locally (development mode) |

| **Version Control** | Git + GitHub |

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/nhuri/delivery-food.git
cd delivery-food

# Install dependencies
cd server && npm install
cd ../client && npm install

# Run backend
npm run start

# Run frontend
npm start

API & Configuration

The .env file contains environment variables such as database connection URI and JWT secret.

Example:

MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000

🧑‍💻Author

Netanel Huri
https://github.com/nhuri

🪪 License

This project is licensed under the MIT License — feel free to use and modify for educational or commercial purposes.
