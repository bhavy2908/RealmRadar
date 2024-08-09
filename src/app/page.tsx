"use client";

import React from "react";
import dynamic from "next/dynamic";

const FlowChart = dynamic(() => import("../../components/flowchart"), {
  ssr: false,
});

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FlowChart />
    </div>
  );
}
