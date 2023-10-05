"use client"
import React, {useCallback, useRef, useState} from 'react'
import {Box, Button, Container, Grid, IconButton, Rating, Stack, TextField, Typography} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import {useDropzone} from "react-dropzone";

interface AppInfo {
    id: string,
    name: string,
    team: string,
    description: string,
    youtube: string,
    icon: string,
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

export default function Page({params}: { params: { appId: string } }) {
    const appId = params.appId
    // TODO /api/mock/projects/[appId]から情報を取ってくる

    const appInfoMock: AppInfo = {
        id: appId,
        name: `App ${appId}`,
        team: `team ${appId}`,
        description: `description ${appId} `.repeat(50),
        youtube: "https://youtu.be/ZaZMZ9jePKw?si=x96UEomj8VWoHw0-",
        icon: "/icon128.png",
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

    const iconConfig = {width: 180, height: 180}
    const screenshotConfig = {width: 800, height: 450}

    const appNameRef = useRef<HTMLInputElement>()
    const appDescriptionRef = useRef<HTMLInputElement>()
    const appYoutubeRef = useRef<HTMLInputElement>()

    const [isEditable, setEditable] = useState<boolean>(false)
    const [appInfo, setAppInfo] = useState<AppInfo>(appInfoMock)
    const [prevAppInfo, setPrevAppInfo] = useState<AppInfo>(appInfoMock)
    const [appIcon, setAppIcon] = useState<File>()
    const [appScreenshot, setAppScreenshot] = useState<File[]>([])

    const imageSize = async (url: string): Promise<{width: number, height: number}> => {
        return new Promise((resolve, reject) => {
            const img = new Image()

            img.onload = () => {
                const size = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                }

                resolve(size)
            }

            img.onerror = (error) => {
                reject(error)
            }

            img.src = url
        })
    }

    const onDropIcon = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles[0].type !== "image/png" && acceptedFiles[0].type !== "image/jpeg") {
            alert("pngファイルまたはjpegファイルを選択してください")
            return
        }

        const url = window.URL.createObjectURL(acceptedFiles[0])
        const {width, height} = await imageSize(url)
        if (!(width === iconConfig.width && height === iconConfig.height)) {
            alert(`"スクリーンショットのサイズは${iconConfig.width}x${iconConfig.height}にしてください`)
            return
        }

        setAppIcon(acceptedFiles[0])
        setAppInfo({...appInfo, icon: url})
    }, [appIcon, appInfo])

    const onDropSs = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles[0].type !== "image/png" && acceptedFiles[0].type !== "image/jpeg") {
            alert("pngファイルまたはjpegファイルを選択してください")
            return
        }

        const url = window.URL.createObjectURL(acceptedFiles[0])
        const {width, height} = await imageSize(url)
        if (!(width === screenshotConfig.width && height === screenshotConfig.height)) {
            alert(`画像サイズは${screenshotConfig.width}x${screenshotConfig.height}にしてください`)
            return
        }

        setAppScreenshot([...appScreenshot, acceptedFiles[0]])
        const newScreenshotUrl = [...appInfo.details.imgScreenshot, url]
        console.log(newScreenshotUrl)
        const newDetails = {...appInfo.details, imgScreenshot: newScreenshotUrl}
        setAppInfo({...appInfo, details: newDetails})
    }, [appScreenshot, appInfo])

    const {getRootProps: getRootPropsIcon, getInputProps: getInputPropsIcon} = useDropzone({onDrop: onDropIcon})
    const {getRootProps: getRootPropsSs, getInputProps: getInputPropsSs, open} = useDropzone({onDrop: onDropSs, noDrag: true, noClick: true})

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
                            <Button variant="contained" color="secondary" onClick={onSaveAppInfo}
                                    sx={{mr: 1}}>Save</Button>
                            <Button variant="contained" color="error" onClick={onCancelEdit}>Cancel</Button>
                        </> :
                        <Button variant="contained" color="secondary" onClick={onEditAppInfo}>Edit</Button>
                    }
                </Box>

                <Grid container alignItems="center" sx={{mt: 3}}>
                    <Grid item xs={3}>
                        {isEditable ?
                            <div {...getRootPropsIcon()}>
                                <input {...getInputPropsIcon()}/>
                                    <Box sx={{position: "relative"}}>
                                        <img src={appInfo.icon} alt="icon" style={{width: 180, height: 180}}/>
                                        <Box sx={{backgroundColor: "white", opacity: 0.7, width: 180, height: 180, position: "absolute", top: 0, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                            <Box sx={{textAlign: "center"}}>ここに画像を<br/>ドロップ<br/>{`(${iconConfig.width}x${iconConfig.height})`}</Box>
                                        </Box>
                                    </Box>
                            </div> :
                            <img src={appInfo.icon} alt="icon" style={{width: 180, height: 180}}/>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {isEditable ?
                            <TextField size="small" variant="outlined" inputRef={appNameRef}
                                       inputProps={{style: {fontSize: 48}}} sx={{width: 500}}
                                       defaultValue={appInfo.name}/> :
                            <Typography variant="h3">{appInfo.name}</Typography>
                        }
                        <Typography variant="subtitle1">{appInfo.team}</Typography>
                        <Rating name="read-only" value={3} size="small" sx={{mt: 2}}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" sx={{width: 2 / 3, height: 50}}
                                disabled={isEditable}>インストール</Button>
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">このアプリについて</Typography>
                    {isEditable ?
                        <TextField fullWidth multiline size="small" variant="outlined"
                                   inputRef={appDescriptionRef}
                                   defaultValue={appInfo.description}/> :
                        <Typography component="div">{appInfo.description}</Typography>
                    }
                </Stack>
                <Stack sx={{mt: 5}} direction="row" alignItems="center">
                    <ScreenshotCarousel imgList={appInfo.details.imgScreenshot} editable={isEditable}
                                        onDelete={onDeleteScreenshot}/>
                    {isEditable &&
                        <div {...getRootPropsSs()}>
                            <input {...getInputPropsSs()}/>
                            <IconButton size="large" onClick={open} sx={{height: 50}} disabled={appInfo.details.imgScreenshot.length >= 5}>
                                <AddCircleOutlineIcon/>
                            </IconButton>
                        </div>
                    }
                </Stack>
                {isEditable &&
                    <Box sx={{textAlign: "center"}}>スクリーンショットのサイズは{`${screenshotConfig.width}x${screenshotConfig.height}`}にしてください</Box>
                }
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">紹介動画</Typography>
                    {isEditable ?
                        <TextField size="small" variant="outlined" inputRef={appYoutubeRef}
                                   defaultValue={appInfo.youtube} sx={{width: 500}}/> :
                        <Box className="video">
                            <iframe width="560" height="315" src={convertYoutubeLink(appInfo.youtube)}
                                    title="YouTube video player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen></iframe>
                        </Box>
                    }
                </Stack>
            </Container>
        </>
    );
}