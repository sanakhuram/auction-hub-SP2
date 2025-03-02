<div style="background-color: #F0E2C7; padding: 20px; border-radius: 10px; text-align: center;">

<h1 align="center">
  <img src="/public/images/design.png" width="50" height="50" />
   Auction Hub - Semester 2 Project Exam
   <img src="/public/images/design.png" width="50" height="50" />
</h1>

🚀 **Auction Hub** is an online auction platform where users can buy and sell unique collectibles, artwork, vintage items, and more through a seamless bidding system.

<p align="center">
  <img src="https://github.com/user-attachments/assets/4f8f23cd-c367-4bb9-9b5c-dca01cac0e79" width="300" />
  <img src="https://github.com/user-attachments/assets/fda3eb5c-6ca2-4021-8d33-979e022b9319" width="300" />
</p>

<p align="center">
  🎨 <a href="https://www.figma.com/design/KNSBShYJcA6w3ROnkKjCRL/Semester-Project-2?node-id=49-452&m=dev&t=vFRdjFHmThiH7waO-1">
    <img src="https://img.shields.io/badge/Figma-Design-red?style=for-the-badge&logo=figma" />
  </a>
  📋 <a href="https://github.com/users/sanakhuram/projects/5">
    <img src="https://img.shields.io/badge/Planning-Board-yellow?style=for-the-badge&logo=trello" />
  </a>
  🌍 <a href="https://auction-hub.netlify.app/">
    <img src="https://img.shields.io/badge/Live-Demo-teal?style=for-the-badge&logo=netlify" />
  </a>
  📂 <a href="https://github.com/sanakhuram/auction-hub-SP2">
    <img src="https://img.shields.io/badge/GitHub-Repo-orange?style=for-the-badge&logo=github" />
  </a>
  📅 <a href="https://github.com/users/sanakhuram/projects/5/views/4">
    <img src="https://img.shields.io/badge/Gantt Chart-blue?style=for-the-badge&logo=microsoftproject" />
  </a>
  🎨 <a href="https://www.figma.com/design/KNSBShYJcA6w3ROnkKjCRL/Semester-Project-2?node-id=49-449&t=dMiRPZW7QBdb6T5S-1">
    <img src="https://img.shields.io/badge/Figma-Style Guide-purple?style=for-the-badge&logo=figma" />
  </a>
    </a>
  🎨 <a href="https://www.figma.com/proto/KNSBShYJcA6w3ROnkKjCRL/Semester-Project-2?node-id=267-943&p=f&t=MllrosSqGUbDy8C7-0&scaling=scale-down&content-scaling=fixed&page-id=267%3A941&starting-point-node-id=267%3A943">
    <img src="https://img.shields.io/badge/Figma-Mobile Prototype-green?style=for-the-badge&logo=figma" />
  </a>
    </a>
  🎨 <a href="https://www.figma.com/proto/KNSBShYJcA6w3ROnkKjCRL/Semester-Project-2?node-id=248-843&p=f&t=pW34esmiYab5d6Yi-1&scaling=scale-down&content-scaling=fixed&page-id=49%3A452&starting-point-node-id=248%3A843">
    <img src="https://img.shields.io/badge/Figma-Desktop Prototype-pink?style=for-the-badge&logo=figma" />
  </a>
</p>

---

## 📌 Project Overview

This project was built as part of the **Semester 2 Project Exam** for web development. The goal was to develop a fully functional auction platform where **registered users can create, edit, delete listings, place bids, and track bid history** while non-registered users can only browse listings.

---

## 🛠️ Updated Tech Stack

| 🚀 **Technology**         | 🛠️ **Purpose**                                 |
| ------------------------- | ---------------------------------------------- |
| **JavaScript (Vanilla)**  | 🎯 Core application logic, API handling        |
| **Vite.js**               | ⚡ Fast and modern frontend build tool         |
| **Tailwind CSS**          | 🎨 Utility-first CSS framework for UI styling  |
| **LocalStorage**          | 🔐 JWT token storage for authentication        |
| **Noroff API (REST API)** | 🔗 Backend API for managing auctions           |
| **Netlify**               | 🌍 Deployment and hosting                      |
| **ESLint**                | ✅ Linting tool to enforce code quality        |
| **Prettier**              | 🎨 Code formatter for consistent styling       |
| **Husky**                 | 🔄 Git hooks for enforcing pre-commit checks   |
| **Playwright**            | 🧪 End-to-end testing framework for UI testing |

---

## 🔥 Features

✅ **User Authentication**: 🔐 Secure login & registration for buyers and sellers.  
✅ **Listing Management**: 📦 Users can create, edit, and manage their own auction listings.  
✅ **Bidding System**: 💰 Place bids, track bid history, and view highest bids.  
✅ **User Profiles**: 👤 View seller information and bid history.  
✅ **Guest Access**: 👀 Non-registered users can browse listings but cannot bid.  
✅ **Dark Mode**: 🌙 Tailwind-powered theme switching for better UX.

---

## 📖 How to Use the App

1️⃣ **Sign Up/Login**

- Click **Register** and sign up using your `stud.noroff.no` email.
- Every **new user receives 1,000 credits** to start bidding.
- Login to start bidding or selling.

2️⃣ **Create a Listing**

- Click **Create Listing** and enter a title, description, images, and set a deadline.
- 🏆 **Earn credits when your item is sold!**

3️⃣ **Edit & Delete Listings**

- ✏️ **Edit Listing**: Modify title, description, images, or deadline.
- 🗑️ **Delete Listing**: Remove a listing before it has bids.

4️⃣ **Place a Bid**

- Go to any listing and enter a bid amount to compete for the item.
- 💸 **Use your credits to bid on items.**
- If you win the auction, the credits will be deducted from your account.

5️⃣ **Manage Profile**

- View total credits, update your avatar, and track your bids.
- 🎯 **Check your balance and bidding history in your profile.**

6️⃣ **Guest Access**

- Non-registered users can browse listings but **cannot bid**.

---

## 🚀 Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sanakhuram/auction-hub-SP2.git
cd auction-hub-SP2
```

---

### 2️⃣ Get Your API Key

🔑 This project uses the **Noroff API**, which requires an API key.

#### 🔗 **How to Get Your API Key**

1. Go to **[Noroff API Key Authentication](https://docs.noroff.dev/docs/v2/auth/api-key#api-key-tool)**.
2. Sign up or log in with your **stud.noroff.no** email.
3. Generate your API key and **copy it**.

---

### 3️⃣ Set Up Environment Variables

Rename the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then, open `.env` and add your API key:

```plaintext
VITE_API_URL=https://api.noroff.dev/auction-house
VITE_API_KEY=your-secret-api-key
```

---

### 4️⃣ Install Dependencies

```bash
npm install
```

---

### 5️⃣ Run the Development Server

```bash
npm run dev
```

📌 Open **[`http://localhost:5173`](http://localhost:5173)** in your browser.

---

## 🌍 Deployment

🚀 The application is deployed on **Netlify** and can be accessed at:  
🔗 **[Auction Hub Live](https://auction-hub.netlify.app/)**

---

## 🎯 How to Contribute

1️⃣ **Fork the Repository**  
2️⃣ **Create a Feature Branch**

```bash
git checkout -b feature-new-feature
```

3️⃣ **Commit Changes & Push**

```bash
git commit -m "Added a new feature"
git push origin feature-new-feature
```

4️⃣ **Open a Pull Request**

---

## 💎 Contact Me

📧 **Developer**: _Sana Khuram_

📬 **Email**: [sanakhuram](mailto:sana.khuram.baig@gmail.com)

💡 **Happy Bidding & Selling!** 🚀💰

</div>
