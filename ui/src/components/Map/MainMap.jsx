import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import PlacesContext from "../../context/places/PlacesContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { homePageStyles } from "../HomePage/homePageUtils";
import mapboxgl from "mapbox-gl";
import { useRef } from "react";
import MapContext from "../../context/map/MapContext";
import PropTypes from "prop-types";
import { Marker, Popup } from "mapbox-gl";
import { colors } from "@material-ui/core";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZW5hbW9yYWRhZGVqZXYiLCJhIjoiY2wzdjF0eGtzMHBwYTNqcDR1a2V3cHc5MiJ9.B908wvKiF6shWfLEyGI_lg";

const MainMap = ({ isHomepage, location, markers }) => {
  const { isLoading, userLocation } = useContext(PlacesContext);
  const { isMapReady, setMap } = useContext(MapContext);
  const [currentMap, setCurrentMap] = useState(null);
  const [center, setCenter] = useState();
  const mapDiv = useRef(null);
  const styles = homePageStyles();

  const calculateStyle = () => {
    return isHomepage ? styles.home_page_map : styles.addresses_map;
  };

  useEffect(() => {
    if (currentMap && !isMapReady) {
      setMap(currentMap);
    }
  }, [currentMap, setMap, isMapReady, isHomepage]);

  useEffect(() => {
    if (location) {
      setCenter(location);
    }
    if (isHomepage && userLocation) {
      setCenter(userLocation);
    }
  }, [isHomepage, location, userLocation]);

  useEffect(() => {
    if (currentMap && markers && !isHomepage) {
      markers.map((marker) =>
        new Marker({ color: colors.MINT })
          .setPopup(new Popup().setHTML(`<h3>${marker.alias}</h3>`))
          .setLngLat(marker.center)
          .addTo(currentMap)
      );
    }
  }, [isHomepage, markers, currentMap]);

  useEffect(() => {
    if (center && Object.keys(currentMap).length && !isHomepage) {
      currentMap?.flyTo({ zoom: 16, center });
    }
  }, [center, currentMap, isHomepage]);

  useLayoutEffect(() => {
    if (!isLoading && !isMapReady) {
      const map = new mapboxgl.Map({
        container: mapDiv.current, // container ID
        style: "mapbox://styles/mapbox/dark-v10", // style URL
        center: userLocation, // starting position [lng, lat]
        zoom: 16, // starting zoom
        projection: "globe", // display the map as a 3D globe
      });
      setCurrentMap(map);
    }
  }, [isLoading, isMapReady, userLocation, isHomepage]);

  if (isLoading) {
    return (
      <Box className={calculateStyle()}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div ref={mapDiv} className={calculateStyle()}>
      {userLocation?.join(",")}
    </div>
  );
};

MainMap.propTypes = {
  type: PropTypes.bool,
  location: PropTypes.array,
  markers: PropTypes.array,
};

MainMap.defaultProps = {
  isHomepage: false,
  location: null,
  markers: [],
};

export default MainMap;
