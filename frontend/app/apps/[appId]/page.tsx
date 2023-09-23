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
        forjob: string
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
        youtube: `https://${appId}`,
        details: {
            img_screenshot: ["https://picsum.photos/600/400", "https://picsum.photos/600/400?grayscale"],
            required_spec: [
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
            forjob: ""
        }
    }

    return (
        <div>
            <Container sx={{mt: 3}}>
                <Stack spacing={5}>
                    <Box component="div">
                        <Grid container alignItems="center" justifyContent="center">
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
                    </Box>
                    <Stack spacing={2}>
                        <Typography variant="h4">このアプリについて</Typography>
                        <Typography component="div">{appDetailMock.description}</Typography>
                    </Stack>
                    <Box>
                        <ScreenshotCarousel imgList={appDetailMock.details.img_screenshot}/>
                    </Box>
                </Stack>

            </Container>
        </div>
    );
}