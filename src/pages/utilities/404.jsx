import React from "react";
import Logo from "../../assets/rarity_logo.png";

export default function NotFound() {
  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <div>
        <img src={Logo} />
      </div>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <p>
            <a href="https://www/raritycars.com">Go back to the homepage</a>
        </p>
      </div>
    </div>
  );
}
