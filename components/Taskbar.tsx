import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";

interface TaskbarProps {
  onSearch: (type: string, query: string) => void;
  onAISearch: (query: string) => void;
}

interface MockData {
  [key: string]: string[];
}

const Taskbar: React.FC<TaskbarProps> = ({ onSearch, onAISearch }) => {
  const [type, setType] = useState<string>("character");
  const [query, setQuery] = useState<string>("");
  const [isCrowClicked, setIsCrowClicked] = useState<boolean>(false);
  const [crowBtnText, setCrowBtnText] = useState<string>("Ask the Raven");
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mockData, setMockData] = useState<MockData>({});

  const searchInArray = (searchQuery: string): string[] => {
    return (mockData[type] || []).filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const results = searchInArray(searchQuery);
      setSuggestions(results);
      console.log("Suggestions updated:", results); // Debug log
    }, 300),
    [mockData, type]
  );

  const getMockData = async (type: string) => {
    try {
      const response = await axios.get<string[]>(
        `https://realm.visanexa.com/search/${type}`
      );
      setMockData((prevState) => ({ ...prevState, [type]: response.data }));
      console.log("Mock data fetched:", response.data); // Debug log
    } catch (error) {
      console.error("Error fetching mock data:", error);
    }
  };

  useEffect(() => {
    console.log(
      "Current type:",
      type,
      "Mock data length:",
      mockData[type]?.length
    ); // Debug log
    if (!mockData[type]) {
      getMockData(type);
      console.log("Fetching data for type:", type); // Debug log
    }
    if (query.length > 2) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
    }
  }, [query, debouncedSearch, mockData, type]);

  const handleCrowClick = () => {
    setIsCrowClicked(!isCrowClicked);
    setCrowBtnText(isCrowClicked ? "Ask the Raven" : "Search Manually");
  };

  return (
    <div>
      <div className="taskbar">
        <div className="flex items-center space-x-4">
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              getMockData(e.target.value);
            }}
            className={`taskbar-select rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              isCrowClicked ? "crow-clicked" : ""
            }`}
          >
            <option value="character">Character</option>
            <option value="house">House</option>
            <option value="seat">Seat</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find any house, seat, or character from Westeros, and explore their lore..."
            className={`taskbar-input flex-grow rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              isCrowClicked ? "crow-clicked" : ""
            }`}
          />
          <button
            onClick={() => {
              onSearch(type, query);
              setSuggestions([]);
            }}
            className={`taskbar-button search-button text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              isCrowClicked ? "crow-clicked" : ""
            }`}
          >
            Search
          </button>
          <button
            onClick={handleCrowClick}
            className="taskbar-button ask-crow-button text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            {crowBtnText}
          </button>
          <input
            type="text"
            value={searchBarValue}
            onChange={(e) => setSearchBarValue(e.target.value)}
            placeholder="Ask the Three-Eyed Crow anything; he knows all from the Red Keep to the secrets beyond the Wall..."
            className={`taskbar-input2 flex-grow rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              isCrowClicked ? "crow-clicked" : ""
            }`}
          />
          <button
            onClick={() => onAISearch(searchBarValue)}
            className={`taskbar-button new-button text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              isCrowClicked ? "crow-clicked" : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                setQuery(item);
                setSuggestions([]);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Taskbar;
