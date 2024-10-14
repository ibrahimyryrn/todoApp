import React, { useEffect, useState } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    id: number | undefined
  ) => void;
  id: number | undefined;
  editTitle: string;
  editDescription: string;
}

const ModalEdit: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  id,
  editTitle,
  editDescription,
}) => {
  const [title, setTitle] = useState(editTitle);
  const [description, setDescription] = useState(editDescription);

  // editTitle değiştiğinde title state'ini güncelle
  useEffect(() => {
    setTitle(editTitle);
    setDescription(editDescription);
  }, [editTitle, editDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, description, id);
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-customPurple hover:text-customPurpleDark"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-customPurpleDark">
          Edit Todo
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium  text-customPurpleDark"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium  text-customPurpleDark"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Submit Butonu */}
          <Button
            type="submit"
            className="w-full p-2 bg-customPurple hover:bg-customPurpleDark "
          >
            Set
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;
