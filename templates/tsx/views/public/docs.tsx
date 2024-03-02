import React from 'react';
import Header from '../components/Header.tsx'; // Assuming you'll rename Header.jsx to Header.tsx
import Footer from '../components/Footer.tsx'; // Assuming you'll rename Footer.jsx to Footer.tsx

const MainPage: React.FC = () => (
  <>
    <head>
        <link rel="stylesheet" href="/css/main.css" />
    </head>
    <Header />
    <main>
      <h1>Welcome to Our Website -Docs-</h1>
      <p>This is the main page. Feel free to explore.</p>
    </main>
    <Footer />
  </>
);

export default MainPage;
