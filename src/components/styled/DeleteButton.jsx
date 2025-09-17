// DeleteButton.jsx. This component is for delete button

import React from 'react';

function DeleteButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
    >
      {label || 'Delete'}
    </button>
  );
}

export default DeleteButton;