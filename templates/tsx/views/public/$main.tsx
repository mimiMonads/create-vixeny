import React from "react";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

const MainPage: React.FC = () => (
  <>
    <head>
      <link rel="stylesheet" href="/css/main.css" />
    </head>
    <Header />
    <main>
      <section>
        <h1>Welcome to Create-Vixeny!</h1>
      </section>

      <section>
        <h2>Project Structure</h2>
        <p>Our project consists of two main components:</p>
        <ul>
          <li>
            <strong>
              Dynamic Server (<code>src</code>):
            </strong>{" "}
            This is where all the route functions are located.
          </li>
          <li>
            <strong>
              Static Server (<code>views</code>):
            </strong>{" "}
            This hosts all static files. Specifically, the{" "}
            <code>views/public</code>{" "}
            directory will serve as the home for these files, which users can
            access. For instance, the file{" "}
            <code>./views/public/$main.html</code> is found here.
          </li>
        </ul>
        <p>Additionally, we have one active plugin:</p>
        <ul>
          <li>
            <strong>esbuild:</strong>{" "}
            This plugin converts all TypeScript files in{" "}
            <code>views/public</code>{" "}
            (.ts) to ECMAScript Modules (.mjs). You can find an example at{" "}
            <code>/views/public/mjs/main.ts</code>.
          </li>
        </ul>
        <blockquote>
          Remember, Vixeny does not use a <code>dist</code>{" "}
          folder; everything is composed on-the-fly. For example, a file named
          {" "}
          <code>example.md</code> will be resolved as <code>example.html</code>
          {" "}
          and accessed as <code>example</code>.
        </blockquote>
      </section>
      <section>
        <p>
          For more information, visit the
          <a href="https://vixeny.dev/" target="_blank">
            official Vixeny website
          </a>.
        </p>
      </section>
      <section>
        <h2>Join Our Community</h2>
        <p>
          Be a part of our journey by joining our Discord community. Here, you
          can stay updated on the latest developments, provide feedback, and
          interact with the team and other users.
        </p>
        <a href="https://discord.gg/PMXbQtDD3m">Join us on Discord</a>
      </section>
    </main>
    <Footer />
  </>
);

export default MainPage;
