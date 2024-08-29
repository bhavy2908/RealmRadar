"use client";

import React from "react";
import DataParser from "../../components/DataParser";

const nodes = [
  {
    id: "935",
    data: {
      label: "Daenerys Targaryen",
      gender: "female",
      culture: "Valyrian",
      born: "In 284 AC, at Dragonstone",
      type: "character",
      isCrowned: true,
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "3036",
    data: {
      label: "House Targaryen of King's Landing",
      coat_of_arms: "Sable, a dragon thrice-headed gules",
      words: "Fire and Blood",
      founded: "House Targaryen: >114 BCHouse Targaryen of King's Landing:1 AC",
      region: "The Crownlands",
      type: "house",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "367",
    data: {
      label: "Godry Farring",
      gender: "male",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "1754",
    data: {
      label: "Gillam",
      gender: "male",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "1889",
    data: {
      label: "Godric Borrell",
      gender: "male",
      culture: "Sistermen",
      born: "At Sweetsister",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "2413",
    data: {
      label: "Gevin Harlaw",
      gender: "male",
      culture: "Ironborn",
      died: "In 299 AC, at Winterfell",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "1786",
    data: {
      label: "Andar Royce",
      gender: "male",
      culture: "Valemen",
      born: "At Runestone",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "941",
    data: {
      label: "Mhysa",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "942",
    data: {
      label: "The Silver Queen",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "943",
    data: {
      label: "Silver Lady",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "940",
    data: {
      label: "Mother",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "945",
    data: {
      label: "The Dragon Queen",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "938",
    data: {
      label: "The Unburnt",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "944",
    data: {
      label: "Dragonmother",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "936",
    data: {
      label: "Dany",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "937",
    data: {
      label: "Daenerys Stormborn",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "939",
    data: {
      label: "Mother of Dragons",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "946",
    data: {
      label: "The Mad King's daughter",
      type: "alias",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "1544",
    data: {
      label: "Daenerys Targaryen",
      gender: "female",
      born: "In 172 AC",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "3237",
    data: {
      label: "House Nymeros Martell of Sunspear",
      coat_of_arms:
        "Tenny, a sun in splendour gules transfixed by a spear bendwise Or",
      founded: "1000 years ago",
      words: "Unbowed, Unbent, Unbroken",
      region: "Dorne",
      type: "house",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "2117",
    data: {
      label: "Tytos Brax",
      gender: "male",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "1790",
    data: {
      label: "Andros Brax",
      gender: "male",
      died: "In 298 AC, at Riverrun",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "1887",
    data: {
      label: "Gilbert Farring",
      gender: "male",
      type: "character",
    },
    position: { x: 0, y: 0 },
  },
];

const edges = [
  {
    id: "3857",
    source: "935",
    target: "3036",
    type: "belongs_to",
  },
  {
    id: "2157",
    source: "935",
    target: "367",
    type: "holds_title",
  },
  {
    id: "2159",
    source: "935",
    target: "1754",
    type: "holds_title",
  },
  {
    id: "2160",
    source: "935",
    target: "1889",
    type: "holds_title",
  },
  {
    id: "2161",
    source: "935",
    target: "2413",
    type: "holds_title",
  },
  {
    id: "2158",
    source: "935",
    target: "1786",
    type: "holds_title",
  },
  {
    id: "569",
    source: "935",
    target: "941",
    type: "has_alias",
  },
  {
    id: "570",
    source: "935",
    target: "942",
    type: "has_alias",
  },
  {
    id: "571",
    source: "935",
    target: "943",
    type: "has_alias",
  },
  {
    id: "568",
    source: "935",
    target: "940",
    type: "has_alias",
  },
  {
    id: "573",
    source: "935",
    target: "945",
    type: "has_alias",
  },
  {
    id: "566",
    source: "935",
    target: "938",
    type: "has_alias",
  },
  {
    id: "572",
    source: "935",
    target: "944",
    type: "has_alias",
  },
  {
    id: "564",
    source: "935",
    target: "936",
    type: "has_alias",
  },
  {
    id: "565",
    source: "935",
    target: "937",
    type: "has_alias",
  },
  {
    id: "567",
    source: "935",
    target: "939",
    type: "has_alias",
  },
  {
    id: "574",
    source: "935",
    target: "946",
    type: "has_alias",
  },
  {
    id: "3436",
    source: "1544",
    target: "3237",
    type: "belongs_to",
  },
  {
    id: "3816",
    source: "1544",
    target: "3036",
    type: "belongs_to",
  },
  {
    id: "2036",
    source: "2117",
    target: "1544",
    type: "holds_title",
  },
  {
    id: "1081",
    source: "1790",
    target: "1544",
    type: "holds_title",
  },
  {
    id: "1253",
    source: "1544",
    target: "1887",
    type: "holds_title",
  },
];

const handleClick = () => {
  window.open("https://github.com/bhavy2908/RealmRadar", "_blank");
};

export default function Home() {
  return (
    <div>
      <div className="logo-container">
        <img src="/assets/logo.png" width={150}></img>
        <button className="github-button" onClick={handleClick}>
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="github-logo"
          />
          <span className="code">GitHub</span>
        </button>
      </div>
      <div style={{ width: "100vw" }}></div>
      <DataParser inodes={nodes} iedges={edges} />
    </div>
  );
}
