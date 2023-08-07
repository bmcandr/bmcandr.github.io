import * as React from "react";
import { Link } from "gatsby";
import { FaEarthAmericas, FaLinkedin, FaSquareGithub } from "react-icons/fa6";
import "./social-layout.module.css";

const SocialLayout = () => {
    return (
        <div>
            <li>
                <a href="https://github.com/bmcandr" target="_blank">
                    <FaSquareGithub />
                </a>
            </li>
            <li>
                <a
                    href="https://linkedin.com/in/brendanbmcandrew"
                    target="_blank"
                >
                    <FaLinkedin />
                </a>
            </li>
            <li>
                <Link to="/map/">
                    <FaEarthAmericas />
                </Link>
            </li>
        </div>
    );
};

export default SocialLayout;
