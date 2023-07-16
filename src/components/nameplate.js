import * as React from "react";
import { body, divider, name, tagline } from "./nameplate.module.css";
import SocialLayout from "./social-layout";

const Nameplate = ({ children }) => {
  return (
    <div>
      <h1 className={name}>brendan mcandrew</h1>
      <hr className={divider} />
      <p className={tagline}>geospatial software engineer</p>
      {children}
    </div>
  );
};

export default Nameplate;
