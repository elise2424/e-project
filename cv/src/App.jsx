import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import YouTube from "react-youtube";
import { Button, Flex, Tooltip } from 'antd';


function App() {
  const [count, setCount] = useState(0)

  const eliseawesome = () => {
    console.log('Elise project begin')
  }

  const opts = {
    height: "390",
    width: "640",
    playerVars: { autoplay: 0 },
  };

  return (
    <>
      <div>
        <h1>elise personal project</h1>
        <p style={{ backgroundColor: "pink" }}>this project is used for nothing</p>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={eliseawesome} style={{ backgroundColor: "pink", padding: '60px' }}> elise awesome button </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <img style={{ width: '400px' }} src='/lbb.png' />

        <iframe width="1071" height="602" src="https://www.youtube.com/embed/6XSoVmT0qXo?list=RD6XSoVmT0qXo" title="G.E.M.鄧紫棋【別勉強 Don’t Force It (feat. Eric周興哲)】Official Music Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <Button type="primary" shape="circle">
          A
        </Button>
         <Button type="primary">AntD is working!</Button>
      </div>


    </>
  )
}
export default App
