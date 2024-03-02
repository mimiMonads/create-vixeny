// MainPage.js
import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const MainPage = () => (
  <>
    <head>
      <link rel="stylesheet" href="/css/main.css" />
    </head>
    <Header />
    <main>
      <h1>Welcome to Our Website</h1>
      <p>This is the main page. Feel free to explore.</p>
    </main>
    <Footer />
  </>
);

export default MainPage;