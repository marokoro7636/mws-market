import Viewer from '@/components/MdViewer'
import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import {Button, Container, Grid, Rating, Stack} from "@mui/material";
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
        description: `description ${appId}`,
        youtube: `https://${appId}`,
        details: {
            img_screenshot: ["img1"],
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
                <Grid container>
                    <Grid item xs={2}>
                        <img src="/icon128.png"/>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack>
                            <h1>{appDetailMock.name}</h1>
                            <p>{appDetailMock.team}</p>
                            <Rating name="read-only" value={3} size="small"/>
                        </Stack>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained">インストール</Button>
                    </Grid>
                </Grid>
                {/*<Suspense fallback={null}>*/}
                {/*    <Viewer markdown={markdown} />*/}
                {/*</Suspense>*/}
            </Container>
        </div>
    );
}