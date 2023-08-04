import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

const tileJsonEndpoint =
    "https://qfpv7qdc0h.execute-api.us-east-1.amazonaws.com/cog/tilejson.json?tileMatrixSetId=WebMercatorQuad&tile_scale=1&url=";

const tilesEndpoint =
    "https://qfpv7qdc0h.execute-api.us-east-1.amazonaws.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}@1x.png?url=";

const stacCatalog = "https://earth-search.aws.element84.com/v1/search";

async function searchSTAC(query) {
    const response = await fetch(stacCatalog, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
    });
    return response.json();
}

async function getTileJson(url) {
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
};

const mapStyle = {
    version: 8,
    sources: {
        osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            // attributionControl: false,
            maxzoom: 19,
        },
    },
    layers: [
        {
            id: "osm",
            type: "raster",
            source: "osm", // This must match the source key above
        },
    ],
};

const STACMap = () => {
    const mapContainerRef = useRef(null);

    const [map, setMap] = useState(null);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: mapStyle,
            center: [0, 90],
            zoom: 0,
        });
        setMap(map);
        return () => map.remove();
    }, []);

    useEffect(() => {
        if (!map) return;

        map.on("click", function (e) {
            var geometry = {
                coordinates: [e.lngLat.lng, e.lngLat.lat],
                type: "Point",
            };

            var date = new Date();

            var searchQuery = {
                collections: ["sentinel-2-l2a"],
                intersects: geometry,
                limit: 1,
                query: {
                    datetime: {
                        gt: new Date(date.setDate(date.getDate() - 14)),
                    },
                    "eo:cloud_cover": {
                        lt: 25,
                    },
                },
                sortby: "properties.s2:nodata_pixel_percentage",
            };

            searchSTAC(searchQuery).then(function (items) {
                var item = items.features[0];
                var href = item["assets"]["visual"]["href"];

                getTileJson(tileJsonEndpoint.concat(href)).then(function (
                    tileJson
                ) {
                    var center = tileJson.center;
                    map.flyTo({
                        center: [center[0], center[1]],
                        zoom: center[2],
                    });
                });

                var tileUrl = tilesEndpoint.concat(href);

                const layer_id = "sentinel-2";
                if (map.getLayer(layer_id)) {
                    map.removeLayer(layer_id);
                }
                if (map.getSource(layer_id)) {
                    map.removeSource(layer_id);
                }
                map.addSource(layer_id, {
                    type: "raster",
                    tiles: [tileUrl],
                    tilesize: 256,
                    attributionControl: false,
                });
                map.addLayer({
                    id: layer_id,
                    type: "raster",
                    source: layer_id,
                    minzoom: 8,
                    maxzoom: 14,
                    paint: {},
                });
            });
        });
    }, [map]);

    return <div ref={mapContainerRef} style={mapContainerStyle} />;
};

export default STACMap;
