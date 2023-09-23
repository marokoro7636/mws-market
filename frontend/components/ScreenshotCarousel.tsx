"use client"
import React from 'react';
import Carousel from "react-material-ui-carousel";

interface ScreenshotCarouselProps {
    imgList: string[]
}

const ScreenshotCarousel = ({imgList}: ScreenshotCarouselProps) => {
    return (
        <Carousel autoPlay={false}>
            {
                imgList.map((item) => (
                    <img src={item} alt="Image 1"/>
                ))
            }
        </Carousel>
    );
};

export default ScreenshotCarousel;