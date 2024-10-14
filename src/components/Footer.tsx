import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

interface FooterProps {
  handleIsCompletedModalOpen: () => void;
  handleIsSearchModalOpen: () => void;
}

function Footer({
  handleIsCompletedModalOpen,
  handleIsSearchModalOpen,
}: FooterProps) {
  return (
    <>
      {/*EN ALT KISIM*/}
      <div className="flex justify-evenly h-16 bg-white">
        <div className="ml-4 flex flex-col ">
          <button className="mt-2" onClick={handleIsSearchModalOpen}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <span className="text-customPurple text-xs mt-1">SEARCH</span>
        </div>
        <div className="mr-4 flex flex-col">
          <button className="mt-2" onClick={handleIsCompletedModalOpen}>
            <FontAwesomeIcon icon={faCheckDouble} />
          </button>
          <span className="text-customPurple text-xs mt-1">COMPLETED</span>
        </div>
      </div>
    </>
  );
}

export default Footer;
