import React from "react";

const DropDownMenu = ({ defaultValue }) => {
  return (
    <>
      <select name="drop-menu" id="drop-menu">
        <option value={"none"}>{defaultValue}</option>
        
      </select>
    </>
  );
};

export default DropDownMenu;
