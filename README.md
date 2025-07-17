# StockSync - Walmart Sparkathon Project

Hey there! Welcome to StockSync, our solution for the Walmart Sparkathon. We're tackling a big issue in retail: inefficient supply chains that lead to stockouts, overstocking, and a lot of waste. This isn't just a problem for the big players like Walmart; it affects every retailer, from global giants to your local corner store, every single day. And it gets even worse during busy times like the holidays. Our goal with StockSync is to fix this with real-time insights, smart predictions, and eco-friendly recommendations.

## Overview
The retail world is struggling with supply chain chaos—stockouts frustrate customers, overstocking ties up money, and waste hurts the planet. This costs billions every year and makes shoppers lose trust in stores. Retailers, big and small, face this mess daily, and it's especially bad during peak seasons like Black Friday or Christmas. StockSync steps in to solve this by giving retailers the tools they need to manage inventory smarter, save money, and be kinder to the environment.

## Solution
StockSync is a game-changer for retail. It's a dashboard that shows you exactly what's going on with your inventory in real-time, so you can avoid running out of stock or having too much. It uses smart predictions to tell you when you're about to run low on items, and it even suggests ways to recycle or repurpose products to cut down on waste. Plus, it's super easy to use—just upload your data, and you're good to go. With StockSync, retailers can make better decisions, keep customers happy, and do their part for the planet.

## Methodology and Implementation
Here's how we built StockSync:
- We set up a Node.js/Express server to handle CSV uploads smoothly.
- For the brainy stuff, we used Python with scikit-learn to predict when stock might run low.
- Pandas and Seaborn helped us crunch the numbers and find useful patterns in the data.
- On the frontend, we chose Vite and React for a fast, responsive user interface.
- Chart.js made it easy to create clear, actionable charts for stock levels and demand.
- We also added features to recommend recycling options, supporting sustainable practices.
- Finally, we used pnpm for the backend to keep things running efficiently.

We worked quickly to make sure StockSync is a practical tool that retailers can start using right away.

## Tech Stack
- **Backend**: Node.js, Express, Python, scikit-learn, Seaborn, Pandas
- **Frontend**: Vite, React, Chart.js

## Setup Instructions
### Prerequisites
- Node.js (v16 or later)
- npm or pnpm
- Python (v3.9 or later) with required libraries
- Git

### Installation
1. **Clone the Repository**
```
git clone https://github.com/yourusername/stocksync.git
cd frontend
```

2. **Backend Setup**
- Navigate to the backend directory:
```
cd backend
```
- Install dependencies using pnpm:
```
pnpm install
```
- Make sure you have the Python libraries:
```
pip install requirements.txt
```
- Start the backend server:
```
pnpm start
```


3. **Frontend Setup**
- Navigate to the frontend directory:
```
cd ../frontend
```
- Install Dependencies:
```
npm install
```
- Start the deveopment server:
```
npm run dev
```

4. **Access the Application**
- Open your browser and go to `http://localhost:5173`.
- Upload a CSV file with columns like `SKU`, `Product_Type`, `Predicted_Stock_Level`, etc., to see the dashboard in action.

## Usage
- Upload your inventory data via CSV on the landing page.
- Check out the dashboard for real-time insights, stock predictions, and recycling tips.
- Use the logout button to return to the login page.