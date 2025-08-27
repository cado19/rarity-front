import React, { useState } from "react";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";

export default function AddImage({ show, onClose, onSubmit }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    const options = {
      maxSizeMB: 1, // target size
      maxWidthOrHeight: 1024, // resize if needed
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const imageFile = new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: Date.now(),
      });

      onSubmit(imageFile);
    } catch (error) {
      console.error("Compression failed:", error);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 0.2, delay: 0.3 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: "-100vh" },
    visible: { opacity: 1, y: "0" },
    transition: { duration: 0.2, delay: 0.3 },
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="flex justify-end">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="my-3" />
          <button
            className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
            onClick={handleSubmit}
          >
            Upload
          </button>
          {/* <p className="mb-4"> */}
          {/* </p> */}
        </motion.div>
      </motion.div>
    </div>
  );
}
