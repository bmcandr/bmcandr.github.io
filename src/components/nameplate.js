import * as React from "react";
import { divider, name, tagline } from "./nameplate.module.css";

const Nameplate = ({ children }) => {
    return (
        <div
            style={{
                justifyContent: "center",
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <h1 className={name}>brendan mcandrew</h1>
            <hr className={divider} />
            <p className={tagline}>geospatial software engineer</p>
            {children}
        </div>
    );
};

export default Nameplate;
