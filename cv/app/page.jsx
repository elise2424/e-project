"use client";
import React, { useState } from "react";
import {
  Menu,
  Row,
  Image,
  Col,
  Layout,
  Typography,
  Space,
  Card,
  Divider,
  InputNumber,
  Slider,
} from "antd";
import styles from "./page.module.css";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { MathJax, MathJaxContext } from "better-react-mathjax";

import dynamic from "next/dynamic";

const { Header: AntHeader, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const items = [
  {
    label: "Home",
    key: "mail",
    icon: <MailOutlined />,
  },
  {
    label: "Cv",
    key: "app",
    icon: <AppstoreOutlined />,
    disabled: true,
  },
  {
    label: "Project",
    key: "SubMenu",
    icon: <SettingOutlined />,
    children: [
      {
        type: "group",
        label: "Personal project",
        children: [{ label: "Work experience 1", key: "setting:1" }],
      },
    ],
  },
];

const NavigationHeader = () => {
  const [current, setCurrent] = useState("mail");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <AntHeader className={styles.header}>
      <div className={styles.headerContent}>
        <Title level={3} className={styles.logo}>
          Research Portfolio
        </Title>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          className={styles.menu}
        />
      </div>
    </AntHeader>
  );
};

// Function to calculate stress-strain curve
const calculateStressStrain = (strainRate, stepSize, maxStrain = 0.1) => {
  const E = 70e9; // Young's modulus for aluminum (Pa)
  const yieldStrength = 275e6; // Yield strength (Pa)
  const ultimateStrength = 310e6; // Ultimate tensile strength (Pa)
  const yieldStrain = yieldStrength / E; // Elastic limit

  const strain = [];
  const stress = [];

  // Calculate number of points based on step size
  const numPoints = Math.floor(maxStrain / stepSize) + 1;

  for (let i = 0; i <= numPoints; i++) {
    const currentStrain = i * stepSize;
    strain.push(currentStrain);

    if (currentStrain <= yieldStrain) {
      // Elastic region: linear relationship
      stress.push(E * currentStrain);
    } else {
      // Plastic region: hardening behavior
      const plasticStrain = currentStrain - yieldStrain;
      // Strain rate effect: higher strain rate increases strength
      const strainRateFactor = 1 + Math.log10(strainRate + 1) * 0.1;
      const workHardening = 1.5e9; // Work hardening coefficient
      const plasticStress =
        yieldStrength +
        workHardening * Math.pow(plasticStrain, 0.5) * strainRateFactor;

      // Cap at ultimate strength
      if (plasticStress > ultimateStrength * strainRateFactor) {
        stress.push(ultimateStrength * strainRateFactor);
      } else {
        stress.push(plasticStress);
      }
    }
  }

  return { strain, stress };
};

// Function to generate 3D A pillar surface data
const generateAPillar3D = (loadFactor = 1.0, resolution = 40) => {
  const x = [];
  const y = [];
  const z = []; // 3D geometry (depth/curvature)
  const stress = []; // Stress values for coloring

  // Create 3D A pillar surface
  // A pillar is typically curved both horizontally and vertically
  for (let i = 0; i < resolution; i++) {
    const rowX = [];
    const rowY = [];
    const rowZ = [];
    const rowStress = [];

    // Vertical position (height along A pillar)
    const heightRatio = i / (resolution - 1);
    const height = heightRatio * 1500; // 0-1500 mm height

    for (let j = 0; j < resolution; j++) {
      // Horizontal position (width across A pillar)
      const widthRatio = j / (resolution - 1);
      const width = (widthRatio - 0.5) * 200; // -100 to +100 mm (centered)

      // Create curved 3D shape for A pillar
      // A pillar typically curves outward and has varying depth
      const curvature = Math.sin(heightRatio * Math.PI) * 30; // Curvature along height
      const depthBase = 50 + curvature; // Base depth with curvature
      const widthCurvature = Math.cos(widthRatio * Math.PI) * 10; // Curvature across width

      // 3D coordinates
      const xCoord = width;
      const yCoord = height;
      const zCoord =
        depthBase + widthCurvature + Math.sin(heightRatio * 2 * Math.PI) * 15;

      // Calculate stress distribution on the 3D surface
      // Stress concentrations at joints and bends
      const centerY = 750;
      const distFromCenter = Math.abs(height - centerY) / 750;

      let stressValue = 50 * loadFactor;

      // Top joint stress concentration
      const topJoint = Math.exp(-Math.pow((height - 1400) / 80, 2));
      // Bottom joint stress concentration
      const bottomJoint = Math.exp(-Math.pow((height - 100) / 80, 2));
      // Mid-bend stress concentration (where curvature is maximum)
      const midBend = Math.exp(-Math.pow((height - centerY) / 200, 2));
      // Edge stress (at width extremes)
      const edgeStress = Math.exp(-Math.pow((widthRatio - 0.5) * 2, 2) * 2);

      stressValue += (topJoint + bottomJoint) * 120 * loadFactor;
      stressValue += midBend * 90 * loadFactor;
      stressValue += edgeStress * 40 * loadFactor;

      // Add variation based on curvature
      stressValue += Math.abs(curvature / 30) * 30 * loadFactor;

      rowX.push(xCoord);
      rowY.push(yCoord);
      rowZ.push(zCoord);
      rowStress.push(stressValue);
    }

    x.push(rowX);
    y.push(rowY);
    z.push(rowZ);
    stress.push(rowStress);
  }

  return { x, y, z, stress };
};

export default function Home() {
  const [strainRate, setStrainRate] = useState(0.001); // Strain rate in 1/s
  const [stepSize, setStepSize] = useState(0.001); // Step size for calculation
  const [loadFactor, setLoadFactor] = useState(1.0); // Load factor for A pillar 3D
  const [contourResolution, setContourResolution] = useState(40); // Resolution for 3D plot

  // Calculate stress-strain data based on parameters
  const { strain, stress } = calculateStressStrain(strainRate, stepSize);

  // Convert to MPa for display (from Pa)
  const strainDisplay = strain;
  const stressDisplay = stress.map((s) => s / 1e6); // Convert Pa to MPa

  const data = [
    {
      x: strainDisplay,
      y: stressDisplay,
      type: "scatter",
      mode: "lines",
      name: "Stress-Strain Curve",
      line: {
        color: "#1890ff",
        width: 3,
      },
      marker: {
        size: 4,
        color: "#1890ff",
      },
    },
  ];

  const formula = `\\sigma = E \\cdot \\varepsilon`;

  // Generate 3D A pillar surface data
  const pillar3DData = generateAPillar3D(loadFactor, contourResolution);

  const contourPlotData = [
    {
      x: pillar3DData.x,
      y: pillar3DData.y,
      z: pillar3DData.z,
      surfacecolor: pillar3DData.stress,
      type: "surface",
      colorscale: [
        [0, "#313695"], // Dark blue (low stress)
        [0.2, "#4575b4"],
        [0.4, "#74add1"],
        [0.6, "#abd9e9"],
        [0.8, "#e0f3f8"],
        [1, "#fee090"], // Yellow (high stress)
      ],
      colorbar: {
        title: "Stress (MPa)",
        titleside: "right",
        len: 0.7,
      },
      hovertemplate:
        "X: %{x:.1f} mm<br>" +
        "Y: %{y:.1f} mm<br>" +
        "Z: %{z:.1f} mm<br>" +
        "Stress: %{surfacecolor:.1f} MPa<extra></extra>",
      lighting: {
        ambient: 0.7,
        diffuse: 0.8,
        fresnel: 0.1,
        specular: 0.3,
        roughness: 0.5,
      },
      lightposition: {
        x: 100,
        y: 100,
        z: 1000,
      },
    },
  ];

  return (
    <Layout className={styles.layout}>
      <NavigationHeader />
      <Content className={styles.content}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <Title level={1} className={styles.heroTitle}>
              Mathematical Modeling in Manufacturing
            </Title>
            <Paragraph className={styles.heroDescription}>
              This research project focuses on simulating the stress-strain
              behavior of aluminium alloys using Python-based mathematical
              models. The project combines theoretical foundations with
              computational methods to predict mechanical behaviors and
              visualize material responses under tensile loading, demonstrating
              the practical application of numerical modeling in materials
              science.
            </Paragraph>
          </div>
        </section>

        {/* Project Gallery Section */}
        <section className={styles.gallerySection}>
          <div className={styles.container}>
            <Title level={2} className={styles.sectionTitle}>
              Project Gallery
            </Title>
            <Paragraph className={styles.sectionDescription}>
              Visual documentation of the research process and experimental
              results
            </Paragraph>
            <div className={styles.imageGallery}>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={12}>
                  <Card
                    hoverable
                    className={styles.imageCard}
                    cover={
                      <Image
                        src="/c4.png"
                        alt="Project component 4"
                        preview={false}
                        className={styles.galleryImage}
                      />
                    }
                  />
                </Col>
                <Col xs={24} sm={12} lg={12}>
                  <Card
                    hoverable
                    className={styles.imageCard}
                    cover={
                      <Image
                        src="/car.png"
                        alt="Project component car"
                        preview={false}
                        className={styles.galleryImage}
                      />
                    }
                  />
                </Col>
                <Col xs={24} sm={12} lg={12}>
                  <Card
                    hoverable
                    className={styles.imageCard}
                    cover={
                      <Image
                        src="/car2.png"
                        alt="Project component car 2"
                        preview={false}
                        className={styles.galleryImage}
                      />
                    }
                  />
                </Col>
                <Col xs={24} sm={12} lg={12}>
                  <Card
                    hoverable
                    className={styles.imageCard}
                    cover={
                      <Image
                        src="/car3.png"
                        alt="Project component car 3"
                        preview={false}
                        className={styles.galleryImage}
                      />
                    }
                  />
                </Col>
              </Row>
            </div>
          </div>
        </section>

        {/* Model Section */}
        <section className={styles.modelSection}>
          <div className={styles.container}>
            <Title level={2} className={styles.sectionTitle}>
              Mathematical Model
            </Title>
            <Paragraph className={styles.sectionDescription}>
              The stress-strain relationship for linear elastic materials
            </Paragraph>

            <Card className={styles.formulaCard}>
              <MathJaxContext>
                <div className={styles.formulaContainer}>
                  <MathJax inline dynamic>
                    {"\\(" + formula + "\\)"}
                  </MathJax>
                </div>
              </MathJaxContext>
              <Divider />
              <Paragraph className={styles.formulaDescription}>
                Where <Text strong>σ</Text> represents stress,{" "}
                <Text strong>E</Text> is the Young's modulus (elastic modulus),
                and <Text strong>ε</Text> denotes strain. This fundamental
                relationship describes the linear elastic behavior of materials
                under uniaxial loading conditions.
              </Paragraph>
            </Card>

            <Card className={styles.plotCard}>
              <Title level={4} className={styles.plotTitle}>
                Stress-Strain Visualization
              </Title>

              {/* Control Panel */}
              <Card className={styles.controlPanel} size="small">
                <Row gutter={[24, 16]}>
                  <Col xs={24} sm={12}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong>Strain Rate (1/s):</Text>
                      <Slider
                        min={0.0001}
                        max={1}
                        step={0.0001}
                        value={strainRate}
                        onChange={setStrainRate}
                        marks={{
                          0.0001: "0.0001",
                          0.1: "0.1",
                          1: "1.0",
                        }}
                      />
                      <InputNumber
                        min={0.0001}
                        max={1}
                        step={0.0001}
                        value={strainRate}
                        onChange={(value) => setStrainRate(value || 0.001)}
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          value ? `${Number(value).toFixed(4)} s⁻¹` : ""
                        }
                        parser={(value) => {
                          const parsed = value?.replace(" s⁻¹", "").trim();
                          return parsed ? parseFloat(parsed) : 0.001;
                        }}
                      />
                    </Space>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong>Step Size:</Text>
                      <Slider
                        min={0.0001}
                        max={0.01}
                        step={0.0001}
                        value={stepSize}
                        onChange={setStepSize}
                        marks={{
                          0.0001: "0.0001",
                          0.005: "0.005",
                          0.01: "0.01",
                        }}
                      />
                      <InputNumber
                        min={0.0001}
                        max={0.01}
                        step={0.0001}
                        value={stepSize}
                        onChange={(value) => setStepSize(value || 0.001)}
                        style={{ width: "100%" }}
                        formatter={(value) => `${value}`}
                        parser={(value) => value || 0}
                      />
                    </Space>
                  </Col>
                </Row>
                <Divider style={{ margin: "16px 0" }} />
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Paragraph
                      style={{ margin: 0, fontSize: "12px", color: "#8c8c8c" }}
                    >
                      <Text strong>Current Parameters:</Text> Strain Rate ={" "}
                      {strainRate.toFixed(4)} s⁻¹, Step Size ={" "}
                      {stepSize.toFixed(4)}, Data Points = {strain.length}
                    </Paragraph>
                  </Col>
                </Row>
              </Card>

              <Plot
                data={data}
                layout={{
                  title: {
                    text: "Stress-Strain Curve",
                    font: { size: 18 },
                  },
                  xaxis: {
                    title: "Strain (ε)",
                    titlefont: { size: 14 },
                  },
                  yaxis: {
                    title: "Stress (σ) [MPa]",
                    titlefont: { size: 14 },
                  },
                  plot_bgcolor: "#fafafa",
                  paper_bgcolor: "#ffffff",
                  margin: { l: 70, r: 40, t: 60, b: 60 },
                  hovermode: "closest",
                  showlegend: false,
                }}
                style={{ width: "100%", height: "500px" }}
                config={{ responsive: true, displayModeBar: true }}
              />
            </Card>
          </div>
        </section>

        {/* A Pillar Contour Plot Section */}
        <section className={styles.contourSection}>
          <div className={styles.container}>
            <Title level={2} className={styles.sectionTitle}>
              A Pillar Component Analysis
            </Title>
            <Paragraph className={styles.sectionDescription}>
              3D visualization of A pillar component geometry with stress
              distribution mapping
            </Paragraph>

            <Card className={styles.plotCard}>
              <Title level={4} className={styles.plotTitle}>
                3D A Pillar Stress Distribution
              </Title>
              <Paragraph
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "#8c8c8c",
                }}
              >
                Rotate, zoom, and pan to explore the 3D geometry. Color
                indicates stress levels (MPa).
              </Paragraph>

              {/* Control Panel for Contour Plot */}
              <Card className={styles.controlPanel} size="small">
                <Row gutter={[24, 16]}>
                  <Col xs={24} sm={12}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong>Load Factor:</Text>
                      <Slider
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        value={loadFactor}
                        onChange={setLoadFactor}
                        marks={{
                          0.5: "0.5x",
                          1.0: "1.0x",
                          1.5: "1.5x",
                          2.0: "2.0x",
                        }}
                      />
                      <InputNumber
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        value={loadFactor}
                        onChange={(value) => setLoadFactor(value || 1.0)}
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          value ? `${Number(value).toFixed(1)}x` : ""
                        }
                        parser={(value) => {
                          const parsed = value?.replace("x", "").trim();
                          return parsed ? parseFloat(parsed) : 1.0;
                        }}
                      />
                    </Space>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong>Resolution:</Text>
                      <Slider
                        min={25}
                        max={50}
                        step={5}
                        value={contourResolution}
                        onChange={setContourResolution}
                        marks={{
                          25: "25",
                          35: "35",
                          40: "40",
                          50: "50",
                        }}
                      />
                      <InputNumber
                        min={25}
                        max={50}
                        step={5}
                        value={contourResolution}
                        onChange={(value) => setContourResolution(value || 40)}
                        style={{ width: "100%" }}
                      />
                    </Space>
                  </Col>
                </Row>
                <Divider style={{ margin: "16px 0" }} />
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Paragraph
                      style={{ margin: 0, fontSize: "12px", color: "#8c8c8c" }}
                    >
                      <Text strong>Current Parameters:</Text> Load Factor ={" "}
                      {loadFactor.toFixed(1)}x, Resolution = {contourResolution}
                      ×{contourResolution}
                    </Paragraph>
                  </Col>
                </Row>
              </Card>

              <Plot
                data={contourPlotData}
                layout={{
                  title: {
                    text: "A Pillar 3D Stress Distribution",
                    font: { size: 18 },
                  },
                  scene: {
                    xaxis: {
                      title: "Width (mm)",
                      titlefont: { size: 12 },
                      backgroundcolor: "#fafafa",
                      gridcolor: "#cccccc",
                    },
                    yaxis: {
                      title: "Height (mm)",
                      titlefont: { size: 12 },
                      backgroundcolor: "#fafafa",
                      gridcolor: "#cccccc",
                    },
                    zaxis: {
                      title: "Depth (mm)",
                      titlefont: { size: 12 },
                      backgroundcolor: "#fafafa",
                      gridcolor: "#cccccc",
                    },
                    aspectmode: "data",
                    camera: {
                      eye: {
                        x: 1.5,
                        y: 1.5,
                        z: 1.2,
                      },
                      center: {
                        x: 0,
                        y: 0,
                        z: 0,
                      },
                    },
                  },
                  plot_bgcolor: "#ffffff",
                  paper_bgcolor: "#ffffff",
                  margin: { l: 0, r: 0, t: 60, b: 0 },
                }}
                style={{ width: "100%", height: "700px" }}
                config={{
                  responsive: true,
                  displayModeBar: true,
                  displaylogo: false,
                }}
              />
            </Card>
          </div>
        </section>
      </Content>
    </Layout>
  );
}
