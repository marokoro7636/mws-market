import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import {Box, Button, Container, Grid, Rating, Stack, Typography} from "@mui/material";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";


const Editor = dynamic(() => import('@/components/MdEdtior'), { ssr: false })

interface AppDetail{
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

let markdown = `
# Hello world!
Check the EditorComponent.tsx file for the code .
`

const save = (md:string) => { markdown = md }

// TODO 状態管理方法 ←Zustandが良さそう

export default function Page({ params }: { params: { appId: string } }) {
    const appId = params.appId
    // TODO /api/mock/projects/[appId]から情報を取ってくる

    const appDetailMock: AppDetail = {
        id: appId,
        name: `App ${appId}`,
        team: `team ${appId}`,
        description: `description ${appId} `.repeat(50),
        youtube: "https://youtu.be/ZaZMZ9jePKw?si=x96UEomj8VWoHw0-",
        details: {
            imgScreenshot: ["https://dummyimage.com/800x16:9/000/fff.png", "https://dummyimage.com/640x16:9/09f/fff.png", "https://dummyimage.com/400x16:9/cccccc/000000.png"],
            requiredSpec: [
                {
                    item: "",
                    required: ""
                }
            ],
            install: [
                {
                    method: "",
                    info: "",
                    additional: ""
                }
            ],
            forJob: ""
        }
    }

    return (
        <div>
            <Container sx={{mt: 3}}>
                <Grid container alignItems="center">
                    <Grid item xs={3}>
                        <img src="/icon128.png"/>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="h3">{appDetailMock.name}</Typography>
                            <Typography variant="subtitle1">{appDetailMock.team}</Typography>
                            <Rating name="read-only" value={3} size="small" sx={{mt: 2}}/>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{width: 2/3, height: 50}}>インストール</Button>
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">このアプリについて</Typography>
                    <Typography component="div">{appDetailMock.description}</Typography>
                </Stack>
                <Box sx={{mt: 5}}>
                    <ScreenshotCarousel imgList={appDetailMock.details.imgScreenshot}/>
                </Box>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">紹介動画</Typography>
                    <Box className="video">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/ZaZMZ9jePKw?si=3Wii51labR6F7k3Q" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Box>
                </Stack>
            </Container>
        </div>
    );
}