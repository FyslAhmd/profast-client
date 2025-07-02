import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLoaderData } from "react-router";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FlyToAndOpenPopup = ({ target, popupRefs }) => {
  const map = useMap();
  if (target) {
    const { lat, lng, index } = target;

    // Fly and open popup
    map.flyTo([lat, lng], 12, { duration: 1.5 });
    setTimeout(() => {
      popupRefs.current[index]?.openPopup();
    }, 1000);
  }
  return null;
};

const Coverage = () => {
  const serviceCenters = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [target, setTarget] = useState(null);

  const popupRefs = useRef([]);

  const handleSearch = () => {
    const search = searchTerm.trim().toLowerCase();

    const foundIndex = serviceCenters.findIndex((center) => {
      return (
        center.district.toLowerCase().includes(search) ||
        center.covered_area.some((area) => area.toLowerCase().includes(search))
      );
    });

    if (foundIndex !== -1) {
      const center = serviceCenters[foundIndex];
      setTarget({
        lat: center.latitude,
        lng: center.longitude,
        index: foundIndex,
      });
    } else {
      alert("No matching district or area found.");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const lower = value.toLowerCase();
    const filtered = serviceCenters.filter((center) => {
      return (
        center.district.toLowerCase().includes(lower) ||
        center.covered_area.some((area) => area.toLowerCase().includes(lower))
      );
    });

    setSuggestions(filtered.slice(0, 5));
  };

  const handleSuggestionClick = (districtName) => {
    setSearchTerm(districtName);
    setSuggestions([]);

    const exact = serviceCenters.find(
      (center) => center.district.toLowerCase() === districtName.toLowerCase()
    );

    if (exact) {
      const index = serviceCenters.indexOf(exact);
      setTarget({
        lat: exact.latitude,
        lng: exact.longitude,
        index: index,
      });
    }
  };

  return (
    <div className=" my-8 p-10 bg-white rounded-xl">
      <h2 className="text-3xl font-bold mb-4">
        We are available in 64 districts
      </h2>

      <div className="relative z-[999] max-w-md my-6">
        <div className="flex items-center bg-gray-200 rounded-full overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search district or area..."
            className="flex-grow px-4 py-2 bg-gray-200 focus:outline-none text-sm"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button
            className="btn btn-primary text-black rounded-full px-6"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute bg-white border w-full z-[9999] rounded shadow mt-2 max-h-60 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(s.district)}
              >
                {s.district}{" "}
                <span className="text-gray-400">
                  ({s.covered_area.join(", ")})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-md relative z-0">
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {target && (
            <FlyToAndOpenPopup target={target} popupRefs={popupRefs} />
          )}

          {serviceCenters.map((center, index) => (
            <Marker
              key={index}
              position={[center.latitude, center.longitude]}
              ref={(ref) => (popupRefs.current[index] = ref)}
            >
              <Popup>
                <p className="font-bold">{center.district}</p>
                <p>{center.covered_area.join(", ")}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
