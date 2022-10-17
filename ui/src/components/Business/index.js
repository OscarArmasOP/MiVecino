import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Typography } from "@material-ui/core";
import {
  getEmprendimiento,
  getReviewEmprendimientos,
} from "../Emprendimientos/emprendimientosServices";
import { useLocation } from "wouter";
import { getUser } from "../../utils/utils";
import Business from "../Business/Business";
import { Footer } from "../Common/Footer/Footer";
import EmprendimientoMap from "../Map/EmprendimientoMap";
import More from "./Images/More";
import EmprendimientoReviews from "../Reviews/EmprendimientoReviews";
import Review from "../Reviews/Review";
import { typographyStyles } from "../../utils/stylesUtils";

const EmprendimientoDetail = ({ params }) => {
  const { id } = params;
  const [emprendimiento, setEmprendimiento] = useState();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ score: 0, comment: "" });
  const [, setErrorMessage] = useState("");
  const [, setLocation] = useLocation();
  const typography = typographyStyles();

  useEffect(() => {
    if (!window.localStorage.getItem("user")) {
      setLocation("/login");
    }
  }, [setLocation]);

  useEffect(() => {
    getReviewEmprendimientos(id)
      .then((response) => {
        setReviews(response);
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
    getEmprendimiento(id)
      .then((response) => setEmprendimiento(response))
      .catch((e) => setErrorMessage(e.message));
  }, [id, setReviews, setErrorMessage]);

  useEffect(() => {
    if (reviews) {
      const user = getUser();
      setUserReview(
        reviews.find((review) => review.username === user.username)
      );
    }
  }, [reviews]);

  return (
    <>
      <Business data={emprendimiento} />
      <More />
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={{ minHeight: "100vh" }}
      >
        <EmprendimientoReviews reviews={reviews} />
        <Review emprendimientoId={id} userReview={userReview} />
      </Grid>
      <EmprendimientoMap location={[-103.3907956, 20.6414121]} />
      <Box p={2} id='similarPlaces'>
        <Typography className={typography.dark_title}>
          Recomendaciones similares
        </Typography>
      </Box>
      <More />
      <Footer />
    </>
  );
};

export default EmprendimientoDetail;
