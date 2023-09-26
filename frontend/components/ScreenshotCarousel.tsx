"use client"
import React from 'react';
import {Box} from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';

interface ScreenshotCarouselProps {
    imgList: string[]
}

const ScreenshotCarousel = ({imgList}: ScreenshotCarouselProps) => {
    const imgWidth = 500 // スクリーンショットの横幅
    const spacing = 20 // スクリーンショット同士の間

    return (
        <AliceCarousel
            mouseTracking
            autoWidth
            infinite
            items={
                imgList.map((item, i) => (
                    <Box width={imgWidth+spacing}>
                        <Box component="img" src={item} key={i} draggable={false} width={imgWidth}/>
                    </Box>
                ))
            }
        />
    );
};

export default ScreenshotCarousel;