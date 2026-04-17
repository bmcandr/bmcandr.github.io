import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./styles.map.module.css";

interface Props {
  center: [number, number];
  zoom: number;
  height?: string;
}

const Map: React.FC<Props> = ({ center, zoom, height = "400px" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center,
      zoom,
    });

    return () => map.remove();
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      style={{ "--map-height": height } as React.CSSProperties}
    />
  );
};

export default Map;
