import React, { useState } from 'react';
import { SxProps } from '@mui/system'

const strHash = (str: string): number => {
    if (!str || str.length === 0) {
        str = "gfuEjOmoTyHS0Wy"
    }
    let ret = 1 << (Math.max(20 - str.length, 10))
    console.log(ret)
    const arr = (new TextEncoder).encode(str)
    for (const i of Array.from(arr)) {
        ret = ret * i * i % (1 << (i % 10) + 18) + ret
        console.log(ret)
    }
    return ret
}

const getTrialgleImage = (width: number, height: number, hash: string) => {
    const seed = strHash(hash)
    const color = seed % 99
    const gap = ((seed % 8) + 2) * 10
    return `https://generative-placeholders.glitch.me/image?width=${width/1.5}&height=${height/1.5}&style=triangles&gap=${gap}&colors=${color}`
}

const getIdenticon = (hash: string) => {
    const seed = strHash(hash)
    return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`
}

import { Avatar } from '@mui/material';

interface StableAvatarProps {
    src: string,
    hash: string,
    sx: SxProps | null
    variant?: "circular" | "rounded" | undefined
}


const StableAvatar = ({ src, sx = null, hash, variant = "circular" }: StableAvatarProps) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const fallbackSrc = getIdenticon(hash)

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
    width: number,
    height: number,
    hash: string,
}

const StableImgCardMedia = ({ image, width, height, hash }: StableImgCardMediaProps) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        console.log("error")
        setImageError(true);
    };

    const fallbackImage = getTrialgleImage(width, height, hash)

    if (!image) {
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
    strHash,
    getIdenticon,
}