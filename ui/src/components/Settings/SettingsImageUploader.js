import { Box, Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ImageUploader from "../ImageUploader/ImageUploader";
import Stack from "@mui/material/Stack";

const SettingsImageUploader = ({
  id,
  url,
  callToUpload,
  isReadOnly,
  uploaderAlign,
  setAreUpdates,
}) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState();

  useEffect(() => {
    console.log("url", url);
    if (url && url !== "") {
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
      callToUpload(id, currentImage)
        .then((response) => {
          setCurrentImage(null);
          setErrorMessage(null);
          setAreUpdates(true);
        })
        .catch((e) => {
          const { message } = e.response.data;
          if (message.includes("UPLOAD SIZE EXCEEDED")) {
            setErrorMessage("Tamaño de archivo muy grande");
          }
          setCurrentImage(null);
          setCurrentUrl("");
          setAreUpdates(false);
        });
    }
  };

  return (
    <>
      <Stack direction='column' alignItems={uploaderAlign}>
        <Box pt={4}>
          <ImageUploader
            url={currentUrl}
            handleImageUpload={handleImageUpload}
            isReadOnly={isReadOnly}
          />
        </Box>
        {showSaveButton && <Button onClick={onSaveImage}>SAVE</Button>}
        {errorMessage && <Typography>{errorMessage}</Typography>}
      </Stack>
    </>
  );
};

export default SettingsImageUploader;