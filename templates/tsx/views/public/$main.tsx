import React from "react";
import Header from "../components/Header.tsx"; // Assuming you'll rename Header.jsx to Header.tsx
import Footer from "../components/Footer.tsx"; // Assuming you'll rename Footer.jsx to Footer.tsx

const MainPage: React.FC = () => (
  <>
    <head>
      <link rel="stylesheet" href="/css/main.css" />
    </head>
    <Header />
    <main>
    <section>
        <h1>Welcome to Create-Vixeny</h1>
    </section>

    <section>
        <h2>This Template</h2>
        <p>In this project, you will find a logging system integrated with SQL databases.</p>
        <p>If you have never used Vixeny, you can find a small guide at <code>/docs</code>.</p>
    </section>

    <section>
        <h2>Project Structure</h2>
        <p>There are two main components:</p>
        <ul>
            <li><strong>Dynamic Server (src):</strong> Here, you can find dynamic content handling, including examples of <code>wrap</code>, <code>resolve</code>, and <code>branch</code> functions.</li>
            <li><strong>Static Server (views):</strong> This is where all static files are hosted. Specifically, the <code>views/public</code> directory will serve as the home for these files, ready to be accessed by users. This file is <code>./views/public/$main.html</code>.</li>
        </ul>
        <p>Additionally, there are two plugins active:</p>
        <ul>
            <li><strong>esbuild:</strong> Converts TypeScript (.ts) files to ECMAScript Modules (.mjs).</li>
            <li><strong>Remark:</strong> Transforms Markdown (.md) files into HTML, ensuring that documentation and guides are easily accessible.</li>
        </ul>
        <blockquote>Remember, Vixeny does not have a <code>dist</code> folder; everything is lazily composed on the fly. For example, a file named <code>example.md</code> will be resolved as <code>example.html</code> and accessed as <code>example</code>.</blockquote>
    </section>

    <section>
        <h2>Join Our Community</h2>
        <p>Be a part of our journey by joining our Discord community. Here, you can stay updated on the latest developments, provide feedback, and interact with the team and other users.</p>
        <a href="https://discord.gg/PMXbQtDD3m">Join us on Discord</a>
    </section>
    </main>
    <Footer />
  </>
);

export default MainPage;
