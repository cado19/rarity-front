import React, { useState } from "react";
import { motion } from "framer-motion";

export default function IDmodal({
  show,
  onClose,
  id_front,
  id_back,
  avatar,
  baseURL,
}) {
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

  const idFront = id_front ? baseURL + `/files/customers/id/${id_front}` : avatar;
  const idBack = id_back ? baseURL + `/files/customers/id/${id_back}` : avatar;

    const slides = [
        idFront,
        idBack
    ];
    
    const [currentSlide, setCurrentSlide] = useState(0);

    const prevSlide = () => {
        setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1 + slides.length) % slides.length);
    }

  if (!show) {
    return null;
  }
  return (
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
        <h2 className="text-2xl font-bold mb-4">ID images</h2>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div key={index} className="flex-shrink-0 w-full">
                    <img src={slide} alt={`Slide ${index + 1}`} className="w-full"/>
                    </div>
                ))}
            </div>
        </div>
        <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white px-4 py-2 rounded">Prev</button>
        <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white px-4 py-2 rounded">Next</button>
      </motion.div>
    </motion.div>
  );
}
