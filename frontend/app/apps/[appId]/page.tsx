'use client'

import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useState } from 'react'
import { Box, Button, Container, Grid, Rating, Stack, Typography } from "@mui/material";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";

const Editor = dynamic(() => import('@/components/MdEdtior'), { ssr: false })

interface AppDetail {
    id: string,
    name: string,
    team: string,
    description: string,
    youtube: string,
    details: {
        imgScreenshot: string[],
        requiredSpec: {
            item: string,
            required: string
        }[],
        install: {
            method: string,
            info: string,
            additional: string
        }[],
        forJob: string
    }
}

type AppDetailData = {
    id: string,
    name: string,
    team: string,
    short_description: string,
    description: string,
    youtube: string,
    details: {
        img_screenshot: string[],
        required_spec: {
            item: string,
            required: string
        }[],
        install: {
            method: string,
            info: string,
            additional: string
        }[],
        forJob: string
    },
    review: {
        // TODO
    }
    rating: {
        // TODO
    }
    icon: string,
    img: string
}

let markdown = `
# Hello world!
Check the EditorComponent.tsx file for the code .
`

const save = (md: string) => { markdown = md }


export default function Page({ params }: { params: { appId: string } }) {
    const appId = params.appId

    const [data, setData] = useState<AppDetailData | null>(null)

    useEffect(() => {
        fetch(`/api/v0/projects/${appId}`)
            .then((response) => response.json())
            .then((data) => setData(data))
    }, [])

    if (data === null) {
        return <div>loading...</div>
    }

    const appDetail: AppDetail = {
        id: data.id,
        name: data.name,
        team: data.team,
        description: data.short_description || "説明はまだ追加されていません",
        youtube: data.youtube,
        details: {
            imgScreenshot: data.details.img_screenshot,
            requiredSpec: data.details.required_spec,
            install: data.details.install,
            forJob: data.details.forJob
        },
    }

    console.log(appDetail)

    return (
        <>
            <Container sx={{ mt: 3 }}>
                <Grid container alignItems="center">
                    <Grid item xs={3}>
                        <img src="/icon128.png" />
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="h3">{appDetail.name}</Typography>
                            <Typography variant="subtitle1">{appDetail.team}</Typography>
                            <Rating name="read-only" value={3} size="small" sx={{ mt: 2 }} />
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{ width: 2 / 3, height: 50 }}>インストール</Button>
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">このアプリについて</Typography>
                    <Typography component="div">{appDetail.description}</Typography>
                </Stack>
                <Box sx={{ mt: 5 }}>
                    <ScreenshotCarousel imgList={appDetail.details.imgScreenshot} />
                </Box>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">紹介動画</Typography>
                    <Box className="video">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/ZaZMZ9jePKw?si=3Wii51labR6F7k3Q" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Box>
                </Stack>
            </Container>
        </>
    );
}