"use client"
import React from 'react';
import {Box, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';

interface ScreenshotCarouselProps {
    imgList: string[],
    editable: boolean,
    onDelete: (url: string) => void
}

const ScreenshotCarousel = ({imgList, editable, onDelete}: ScreenshotCarouselProps) => {
    const imgWidth = 500 // スクリーンショットの横幅
    const spacing = 30 // スクリーンショット同士の間

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
            disableButtonsControls
            items={
                imgList.map((item, i) => (
                    <Box width={imgWidth+spacing} key={i} sx={{position: "relative"}}>
                        <Box component="img" src={item} draggable={false} width={imgWidth}/>
                        {editable &&
                            <IconButton color="error" onClick={() => {onDelete(item)}} sx={{position: "absolute", top: 10, right: spacing+10}}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    </Box>
                ))
            }
        />
    );
};

export default ScreenshotCarousel;