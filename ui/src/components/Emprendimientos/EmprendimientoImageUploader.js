import { Box, Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ImageUploader from "../ImageUploader/ImageUploader";
import { updateEmprendimientoImage } from "./emprendimientosServices";

const EmprendimientoImageUploader = ({ id, url, isReadOnly }) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState();

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
    } else {
      setCurrentUrl(null);
    }
    setCurrentImage(null);
  }, [id, url]);

  useEffect(() => {
    if (id && currentImage) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  }, [id, currentImage]);

  const handleImageUpload = (file) => {
    setCurrentImage(file);
    setErrorMessage(null);
  };

  const onSaveImage = () => {
    if (id && currentImage) {
      updateEmprendimientoImage(id, currentImage)
        .then((response) => {
          setCurrentImage(null);
          setErrorMessage(null);
        })
        .catch((e) => {
          const { message } = e.response.data;
          if (message.includes("UPLOAD SIZE EXCEEDED")) {
            setErrorMessage("Tamaño de archivo muy grande");
          }
          setCurrentImage(null);
          setCurrentUrl("");
        });
    }
  };

  return (
    <>
      <Box pt={4}>
        <ImageUploader
          url={currentUrl}
          handleImageUpload={handleImageUpload}
          isReadOnly={isReadOnly}
        />
      </Box>
      {showSaveButton && <Button onClick={onSaveImage}>SAVE</Button>}
      {errorMessage && <Typography>{errorMessage}</Typography>}
    </>
  );
};

export default EmprendimientoImageUploader;
