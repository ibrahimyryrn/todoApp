import ShowTodo from "../components/ShowTodo";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

function Homepage() {
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const handleIsCompletedModalOpen = () => {
    setIsCompletedModalOpen(true);
  };
  const handleIsCompletedModalClose = () => {
    setIsCompletedModalOpen(false);
  };

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const handleIsSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };
  const handleIsSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <ShowTodo
        isCompletedModalOpen={isCompletedModalOpen}
        handleIsCompletedModalClose={handleIsCompletedModalClose}
        isSearchModalOpen={isSearchModalOpen}
        handleIsSearchModalClose={handleIsSearchModalClose}
      />
      <Footer
        handleIsCompletedModalOpen={handleIsCompletedModalOpen}
        handleIsSearchModalOpen={handleIsSearchModalOpen}
      />
    </div>
  );
}

export default Homepage;
