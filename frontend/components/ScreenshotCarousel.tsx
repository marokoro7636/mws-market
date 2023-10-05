"use client"
import React from 'react';
import { Box } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';

interface ScreenshotCarouselProps {
    imgList: string[]
}

const ScreenshotCarousel = ({ imgList }: ScreenshotCarouselProps) => {
    const imgWidth = 500 // スクリーンショットの横幅
    const spacing = 20 // スクリーンショット同士の間

    if (!Array.isArray(imgList) || imgList.length === 0) {
        const dummyPlaceholder = "https://placehold.jp/45/b3bac1/ffffff/640x360.jpg?text=Image%20is%20not%20available"
        const items = [
            <Box width={imgWidth + spacing}>
                <Box component="img" src={dummyPlaceholder} draggable={false} width={imgWidth} />
            </Box>
        ]
        return (
            <AliceCarousel
                mouseTracking
                autoWidth
                items={items}
            />)
    }

    return (
        <AliceCarousel
            mouseTracking
            autoWidth
            infinite
            items={
                imgList.map((item, i) => (
                    <Box width={imgWidth + spacing} key={i}>
                        <Box component="img" src={item} draggable={false} width={imgWidth} />
                    </Box>
                ))
            }
        />
    );
};

export default ScreenshotCarousel;