"use client"
import React from 'react';
import Carousel from "react-material-ui-carousel";
import {Box} from "@mui/material";

interface ScreenshotCarouselProps {
    imgList: string[]
}

const ScreenshotCarousel = ({imgList}: ScreenshotCarouselProps) => {
    return (
        <Box sx={{width: "600px"}}>
            <Carousel
                autoPlay={false}
                navButtonsAlwaysVisible={true}
                animation="slide"
                cycleNavigation={true}
            >
                {
                    imgList.map((item, i) => <Box component="img" src={item} key={i}/>)
                }
            </Carousel>
        </Box>
    );
};

export default ScreenshotCarousel;