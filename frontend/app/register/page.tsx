"use client"
import React, { useCallback, useRef, useState } from 'react'
import {Box, Button, Container, Grid, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import { useDropzone } from "react-dropzone";

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

type AppInfoData = {
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

const NullAppData = {
    id: "",
    name: "",
    team: "",
    description: "",
    youtube: "",
    icon: "",
    details: {
        imgScreenshot: [],
        requiredSpec: [],
        install: [],
        forJob: ""
    }
}

export default function Page({ params }: { params: { teamId : string } }) {
    const teamId = params.teamId
    const [data, setData] = useState<AppInfoData | null>(null)

    const iconConfig = { width: 180, height: 180 }
    const screenshotConfig = { width: 800, height: 450 }

    const appNameRef = useRef<HTMLInputElement>()
    const appDescriptionRef = useRef<HTMLInputElement>()
    const appYoutubeRef = useRef<HTMLInputElement>()
    const appDownloadLink = useRef<HTMLInputElement>()

    const [appInfo, setAppInfo] = useState<AppInfo>(NullAppData)
    const [appIcon, setAppIcon] = useState<File>()
    const [appScreenshot, setAppScreenshot] = useState<File[]>([])

    const imageSize = async (url: string): Promise<{ width: number, height: number }> => {
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
        const { width, height } = await imageSize(url)
        if (!(width === iconConfig.width && height === iconConfig.height)) {
            alert(`"スクリーンショットのサイズは${iconConfig.width}x${iconConfig.height}にしてください`)
            return
        }

        setAppIcon(acceptedFiles[0])
        setAppInfo({ ...appInfo, icon: url })
    }, [appIcon, appInfo])

    const onDropSs = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles[0].type !== "image/png" && acceptedFiles[0].type !== "image/jpeg") {
            alert("pngファイルまたはjpegファイルを選択してください")
            return
        }

        const url = window.URL.createObjectURL(acceptedFiles[0])
        const { width, height } = await imageSize(url)
        if (!(width === screenshotConfig.width && height === screenshotConfig.height)) {
            alert(`画像サイズは${screenshotConfig.width}x${screenshotConfig.height}にしてください`)
            return
        }

        setAppScreenshot([...appScreenshot, acceptedFiles[0]])
        const newScreenshotUrl = [...appInfo.details.imgScreenshot, url]
        console.log(newScreenshotUrl)
        const newDetails = { ...appInfo.details, imgScreenshot: newScreenshotUrl }
        setAppInfo({ ...appInfo, details: newDetails })
    }, [appScreenshot, appInfo])

    const { getRootProps: getRootPropsIcon, getInputProps: getInputPropsIcon } = useDropzone({ onDrop: onDropIcon })
    const { getRootProps: getRootPropsSs, getInputProps: getInputPropsSs, open } = useDropzone({ onDrop: onDropSs, noDrag: true, noClick: true })

    const onSaveAppInfo = () => {
        if (appNameRef.current?.value != appInfo.name) {
            console.log("name changed")
            // TODO: update name by API
            setAppInfo({ ...appInfo, name: (appNameRef.current?.value as string) })
        }
        if (appDescriptionRef.current?.value != appInfo.description) {
            console.log("description changed")
            setAppInfo({ ...appInfo, description: (appDescriptionRef.current?.value as string) })
        }
        if (appYoutubeRef.current?.value != appInfo.youtube && appYoutubeRef.current?.value.startsWith("https://youtu.be/")) {
            console.log("youtube changed")
            setAppInfo({ ...appInfo, youtube: (appYoutubeRef.current?.value as string) })
        }
    }

    const onDeleteScreenshot = (url: string) => {
        const newScreenshot = appInfo.details.imgScreenshot.filter((item) => item !== url)
        const newDetails = { ...appInfo.details, imgScreenshot: newScreenshot }
        setAppInfo({ ...appInfo, details: newDetails })
    }

    const installMethods = ["Chrome拡張機能", "実行ファイル", "Webアプリ"]

    return (
        <>
            <Container sx={{ mt: 3 }}>
                <Grid container alignItems="center" sx={{ mt: 3 }}>
                    <Grid item xs={3}>
                        <div {...getRootPropsIcon()}>
                            <input {...getInputPropsIcon()} />
                            <Box sx={{ position: "relative" }}>
                                {appInfo.icon ?
                                    <img src={appInfo.icon} alt="icon"
                                      style={{width: iconConfig.width, height: iconConfig.height}}/> :
                                    <Box sx={{width: iconConfig.width, height: iconConfig.height}}></Box>
                                }
                                <Box sx={{ bgcolor: "#cccccc", opacity: 0.7, width: iconConfig.width, height: iconConfig.height, position: "absolute", top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box sx={{ textAlign: "center" }}>アプリアイコン画像を<br />ドロップ<br />{`(${iconConfig.width}x${iconConfig.height})`}</Box>
                                </Box>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h4">アプリ名</Typography>
                        <TextField variant="outlined" inputRef={appNameRef}
                                   inputProps={{ style: { fontSize: 48 } }} sx={{ width: 500, mt: 2 }} />
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={onSaveAppInfo}
                                sx={{ width: 2 / 3, height: 50 }}>Save</Button>
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">アプリの説明</Typography>
                    <TextField fullWidth multiline rows={5} variant="outlined"
                               inputRef={appDescriptionRef} />
                </Stack>
                <Grid container>
                    <Grid item xs={4}>
                        <Stack spacing={2} mt={5}>
                            <Typography variant="h4">アプリの種類</Typography>
                            <Select
                                defaultValue=""
                                sx={{width: 300}}
                            >
                                {
                                    installMethods.map((item, i) => <MenuItem value={i} key={i}>{item}</MenuItem>)
                                }
                            </Select>
                        </Stack>
                    </Grid>
                    <Grid item xs={8}>
                        <Stack spacing={2} mt={5}>
                            <Typography variant="h4">アプリのダウンロードリンク</Typography>
                            <TextField variant="outlined" inputRef={appDownloadLink} />
                        </Stack>
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">スクリーンショット({`${screenshotConfig.width}x${screenshotConfig.height}`})</Typography>
                    <div {...getRootPropsSs()}>
                        <input {...getInputPropsSs()} />
                        <Button size="large" onClick={open} variant="contained" disabled={appInfo.details.imgScreenshot.length >= 5}>
                            追加
                        </Button>
                    </div>
                    <ScreenshotCarousel imgList={appInfo.details.imgScreenshot} editable={true}
                                        onDelete={onDeleteScreenshot} />

                </Stack>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">紹介動画 (YouTube URL)</Typography>
                        <TextField variant="outlined" inputRef={appYoutubeRef} sx={{ width: 500 }} />
                </Stack>
            </Container>
        </>
    )
}