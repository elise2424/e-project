"use client";

import { useState } from "react";
import { Button } from "antd";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [count, setCount] = useState(0);

  const eliseawesome = () => {
    console.log("Elise project begin");
  };

  return (
    <>
      <div>
        <h1>elise personal project</h1>
        <p style={{ backgroundColor: "pink" }}>
          this project is used for nothing
        </p>
      </div>

      <div className={styles.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button
          onClick={eliseawesome}
          style={{ backgroundColor: "pink", padding: "60px" }}
        >
          {" "}
          elise awesome button{" "}
        </button>
        <p>
          Edit <code>app/page.jsx</code> and save to test
        </p>
        <img style={{ width: "400px" }} src="/lbb.png" alt="lbb" />

        <iframe
          width="1071"
          height="602"
          src="https://www.youtube.com/embed/6XSoVmT0qXo?list=RD6XSoVmT0qXo"
          title="G.E.M.鄧紫棋【別勉強 Don't Force It (feat. Eric周興哲)】Official Music Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <Button type="primary" shape="circle">
          A
        </Button>
        <Button type="primary">AntD is working!</Button>
      </div>
    </>
  );
}

