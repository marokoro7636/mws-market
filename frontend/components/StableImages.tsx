import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { SxProps } from '@mui/system'

interface StableAvatarProps {
    src: string,
    fallbackSrc: string
    sx: SxProps | null
    variant?: "circular" | "rounded" | undefined
}


const StableAvatar = ({ src, sx = null, fallbackSrc, variant = "circular" }: StableAvatarProps) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    if (!src) {
        src = fallbackSrc
    }

    return (
        <Avatar
            src={!imageError ? src : fallbackSrc}
            sx={sx}
            variant={variant}
            onError={() => {
                handleImageError()
            }}
        />
    );
};

import { CardMedia } from '@mui/material';

interface StableImgCardMediaProps {
    image: string,
    width: string,
    height: string,
    fallbackImage: string
}

const StableImgCardMedia = ({ image, width, height, fallbackImage }: StableImgCardMediaProps) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        console.log("error")
        setImageError(true);
    };

    if(!image) {
        image = fallbackImage
    }

    return (
        <CardMedia
            component="img"
            height={height}
            width={width}
            image={!imageError ? image : fallbackImage}
            onError={handleImageError}
        />
    );
};

export {
    StableAvatar,
    StableImgCardMedia,
}