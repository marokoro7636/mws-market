"use client"
import React, {useRef, useState} from 'react'
import {Box, Button, Container, Grid, IconButton, Rating, Stack, TextField, Typography} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ScreenshotCarousel from "@/components/ScreenshotCarousel";

interface AppInfo{
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

// TODO 状態管理方法 ←Zustandが良さそう

export default function Page({ params }: { params: { appId: string } }) {
    const appId = params.appId
    // TODO /api/mock/projects/[appId]から情報を取ってくる

    const appInfoMock: AppInfo = {
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

    const appNameRef = useRef<HTMLInputElement>()
    const appDescriptionRef = useRef<HTMLInputElement>()
    const appYoutubeRef = useRef<HTMLInputElement>()

    const [isEditable, setEditable] = useState<boolean>(false)
    const [appInfo, setAppInfo] = useState<AppInfo>(appInfoMock)
    const [prevAppInfo, setPrevAppInfo] = useState<AppInfo>(appInfoMock)

    const onSaveAppInfo = () => {
        if (appNameRef.current?.value != appInfo.name) {
            console.log("name changed")
            // TODO: update name by API
            setAppInfo({...appInfo, name: (appNameRef.current?.value as string)})
        }
        if (appDescriptionRef.current?.value != appInfo.description) {
            console.log("description changed")
            setAppInfo({...appInfo, description: (appDescriptionRef.current?.value as string)})
        }
        if (appYoutubeRef.current?.value != appInfo.youtube && appYoutubeRef.current?.value.startsWith("https://youtu.be/")) {
            console.log("youtube changed")
            setAppInfo({...appInfo, youtube: (appYoutubeRef.current?.value as string)})
        }
        setEditable(false)
    }

    const onEditAppInfo = () => {
        setPrevAppInfo(appInfo)
        setEditable(true)
    }

    const onCancelEdit = () => {
        setAppInfo(prevAppInfo)
        setEditable(false)
    }

    const onDeleteScreenshot = (url: string) => {
        const newScreenshot = appInfo.details.imgScreenshot.filter((item) => item !== url)
        const newDetails = {...appInfo.details, imgScreenshot: newScreenshot}
        setAppInfo({...appInfo, details: newDetails})
    }

    const convertYoutubeLink = (link: string): string => {
        const youtubeId = link.split("/").slice(-1)[0]
        return `https://www.youtube.com/embed/${youtubeId}`
    }

    return (
        <>
            <Container sx={{mt: 3}}>
                <Box sx={{textAlign: "right"}}>
                    {isEditable ?
                        <>
                            <Button variant="contained" color="secondary" onClick={onSaveAppInfo} sx={{mr: 1}}>Save</Button>
                            <Button variant="contained" color="error" onClick={onCancelEdit}>Cancel</Button>
                        </> :
                        <Button variant="contained" color="secondary" onClick={onEditAppInfo}>Edit</Button>
                    }
                </Box>

                <Grid container alignItems="center" sx={{mt: 3}}>
                    <Grid item xs={3}>
                        <img src="/icon128.png" alt="icon"/>
                    </Grid>
                    <Grid item xs={6}>
                        {isEditable ?
                            <TextField size="small" variant="standard" inputRef={appNameRef}
                                       inputProps={{style: {fontSize: 48}}} sx={{width: 500}}
                                       defaultValue={appInfo.name} /> :
                            <Typography variant="h3">{appInfo.name}</Typography>
                        }
                        <Typography variant="subtitle1">{appInfo.team}</Typography>
                        <Rating name="read-only" value={3} size="small" sx={{mt: 2}}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{width: 2/3, height: 50}}>インストール</Button>
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">このアプリについて</Typography>
                    {isEditable ?
                        <TextField fullWidth multiline size="small" variant="standard"
                                   inputRef={appDescriptionRef}
                                   defaultValue={appInfo.description}/>:
                        <Typography component="div">{appInfo.description}</Typography>
                    }
                </Stack>
                <Stack sx={{mt: 5}} direction="row" alignItems="center">
                    <ScreenshotCarousel imgList={appInfo.details.imgScreenshot} editable={isEditable} onDelete={onDeleteScreenshot}/>
                    {isEditable &&
                        <IconButton size="large" sx={{height: 50}}><AddCircleOutlineIcon /></IconButton>
                    }
                </Stack>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">紹介動画</Typography>
                    {isEditable ?
                        <TextField size="small" variant="standard" inputRef={appYoutubeRef}
                                   defaultValue={appInfo.youtube} sx={{width: 500}}/> :
                        <Box className="video">
                            <iframe width="560" height="315" src={convertYoutubeLink(appInfo.youtube)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        </Box>
                    }
                </Stack>
            </Container>
        </>
    );
}