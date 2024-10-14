import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className: string;
  type?:"submit";
}

const Button = (props: Props) => {
  return (
    <button type={props.type} onClick={props?.onClick} className={` text-white rounded ${props.className } `}>
      {props.children}
    </button>
  );
};

export default Button;