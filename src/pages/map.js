import React from "react";
import loadable from "@loadable/component";

const STACMap = loadable(() => import("../components/map/STACMap"));

const MapPage = () => {
    return (
        <div>
            <STACMap />
        </div>
    );
};

export default MapPage;
