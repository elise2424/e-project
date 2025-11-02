"use client";
import React, { useState } from 'react';
import { Button,Menu, Row, Image, Col } from "antd";
// import Image from "next/image";
import styles from "./page.module.css";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { MathJax, MathJaxContext } from "better-react-mathjax";

import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

const items = [
  {
    label: 'Home',
    key: 'mail',
    icon: <MailOutlined />,
  },
  {
    label: 'Cv',
    key: 'app',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
  {
    label: 'Project',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Personal project',
        children: [
          { label: 'Work experience 1', key: 'setting:1' },
        ],
      },
      
    ],
  },
];
const Header = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = e => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} styles={{backgroundColor:"grey"}} />;
};
export default function Home() {
  const [count, setCount] = useState(0);

  const eliseawesome = () => {
    console.log("Elise project begin");
  };

  const data = [
    { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: { color: 'red' } },
  ]
const formula = `\\sigma = E \\cdot \\varepsilon`;
  return (
    <>
        <Header/>    
        <Row>
          <Col span={20} justify="center" align="middle">           
            <h2> Project - Research of implementation of math model applied in manufacturing </h2>
            <p>
              This project is used to stimulate the stress-strain behaviour of an aluminium alloy using python, and use it to predict the mechanical behaviours of material. It combines the theory and a simple coding exercise to illustrate how material respond under tensile loading and how to visualize the curve using python plotiing tools.
            </p>
          </Col>
        </Row>

      <div className={styles.card}>
        <Row>
          <Col span={12}> <Image style={{ width: "400px" }} src="/c4.png" alt="c4" /></Col>
          <Col span={12}> <Image style={{ width: "400px" }} src="/car.png" alt="car" /></Col>
        </Row>

        <Row>
          <Col span={12} ><Image style={{ width: "400px" }} src="/car2.png" alt="car2" /></Col>
          <Col span={12}><Image style={{ width: "400px" }} src="/car3.png" alt="car3" /></Col>
        </Row>
        
      </div>

      <div> 
        <h2> Model Section </h2>
        <MathJaxContext>
      <div style={{ fontSize: "24px", margin: "20px" }}>
        <MathJax inline dynamic>
          {"\\(" + formula + "\\)"}
        </MathJax>
      </div>
    </MathJaxContext>
        <Plot data={data} layout={{ title: 'My Plot' }} />
      </div>
    </>
  );
}
