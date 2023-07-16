import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { body, overlay } from "./hero.module.css";

const Hero = ({ children }) => {
    return (
        <div
            style={{
                position: "relative",
                alignText: "center",
            }}
        >
            <StaticImage
                alt=""
                src={"../images/LC08_L1TP_036033_20180913_20180928_01_T1.jpg"}
                quality={90}
                grayscale="true"
                fit="cover"
                placeholder="blurred"
                style={{
                    height: "100vh",
                }}
            />
            <div className={overlay}></div>
            {children}
        </div>
    );
};

export default Hero;
