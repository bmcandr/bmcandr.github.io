import * as React from "react";
import { attribution } from "../components/attribution.module.css";

const Attribution = () => {
    return (
        <div className={attribution}>
            <b>image:</b> Landsat-8 courtesy of the U.S. Geological Survey
        </div>
    );
};

export default Attribution;
