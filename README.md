# 🍔 Delivery Food App

A full-stack web platform for online food ordering and delivery — enabling users to browse restaurants, customize dishes, and track their orders in real time.  
Built with **React**, **Node.js (Express)**, and **MongoDB/PostgreSQL** for a smooth, scalable experience.

---

## 🚀 Overview

Delivery-Food is an end-to-end food delivery platform that connects users with multiple restaurants.  
It offers seamless ordering, real-time tracking, and secure payments — all through an intuitive, modern web interface.

---

## ✨ Main Features

- 🔐 **User & Restaurant Authentication** – registration and login with Firebase Authentication  
- 🍽️ **Browse Restaurants & Dishes** – search and filter by cuisine, category, ratings, or location  
- 🧾 **Dynamic Menus** – view full menus with photos, prices, and customization options  
- 🚴 **Order & Track in Real Time** – follow order status: confirmed → cooking → out for delivery → delivered  
- 💳 **Multiple Payment Options** – Stripe, PayPal, Apple Pay, Google Pay  
- ⭐ **Ratings & Reviews** – users can rate restaurants and dishes with written feedback  
- 🔔 **Notifications** – live updates on order status, new restaurants, and special offers  
- 🧠 **Admin Panel** – manage restaurants, menus, orders, promotions, and analytics  

---

## 🧩 System Components

### 👤 User Profile
- Name, profile picture (optional), and email  
- Delivery addresses  
- Order history and favorites  
- Saved payment methods  

### 🏪 Restaurant Profile
- Business info (name, logo, address, location)  
- Full menu management (items, prices, images, descriptions)  
- Sales statistics, reviews, and ratings  

### 🔍 Search & Filtering
- By restaurant name or dish  
- By cuisine type (Italian, Asian, Vegan, Pizza, etc.)  
- By distance, delivery time, or rating  
- Filter for promotions and discounts  

### 📦 Order Flow
1. Select a restaurant and customize dishes  
2. Choose delivery time (immediate or scheduled)  
3. Track the order in real time  
4. Communicate with restaurant or courier if needed  

---

## 🖥️ Admin Dashboard

The admin panel provides full control over platform operations:
- Manage restaurants, users, and orders  
- Create promotions and discounts  
- Monitor sales, reviews, and performance metrics  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Web) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB or PostgreSQL |
| **Authentication** | Firebase Authentication |
| **Hosting** | AWS / Firebase Hosting |
| **Payments** | Stripe, PayPal |
| **Version Control** | Git + GitHub |

---

## 🧠 Future Enhancements

- Mobile app version (React Native)
- Delivery driver tracking map
- AI-based restaurant recommendations
- Multi-language support
- Integration with external POS systems

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

🧾 API & Configuration

.env file includes environment variables for database connection, Firebase keys, and payment API keys

Example configurations can be added under /config/ directory

📸 UI & Design Resources

Design mockups and wireframes:
👉 App Design Link

🧑‍💻 Author

Netanel Khuri
GitHub Profile

🪪 License

This project is licensed under the MIT License — feel free to use and modify for educational or commercial purposes.

# Run frontend
npm start

