import click
from pystac_client import Client
from shapely import geometry
import folium

from datetime import datetime, timedelta


@click.command()
@click.option("--output")
def main(output: str):
    earth_search_client = Client.open(
        "https://earth-search.aws.element84.com/v1", ignore_conformance=True
    )

    canyonlands_pt = geometry.Point(-109.88727751345296, 38.19233623495967)

    today = datetime.today()
    start_date = today - timedelta(days=30)
    today, start_date = [
        datetime.strftime(date, "%Y-%m-%d") for date in [today, start_date]
    ]

    s2_items = earth_search_client.search(
        collections=["sentinel-2-l2a"],
        datetime=f"{start_date}/{today}",
        intersects=canyonlands_pt,
    )

    s2_item_coll = s2_items.get_all_items()

    clearest_item = min(
        s2_item_coll, key=lambda item: item.properties["eo:cloud_cover"]
    )

    scene_centroid = geometry.shape(clearest_item.geometry).centroid

    m = folium.Map(
        location=(scene_centroid.y, scene_centroid.x),
        tiles="cartodbpositron",
        zoom_start=10,
    )

    tiler = "https://api.cogeo.xyz/cog/tiles/{z}/{x}/{y}"
    virtual_tiles = f"{tiler}?url={clearest_item.assets['visual'].href}"
    folium.TileLayer(
        tiles=virtual_tiles, overlay=True, name="12SYJ", attr="IndigoAg"
    ).add_to(m)

    m.save(output)


if __name__ == "__main__":
    main()
