import React from "react";
import loadable from "@loadable/component";

const STACMap = loadable(() => import("./STACMap"));

function Map() {
    return (
        <div>
            <STACMap />
        </div>
    );
}

export default Map;
