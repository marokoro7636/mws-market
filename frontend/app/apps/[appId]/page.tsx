"use client"
import React, { useCallback, useRef, useState, useEffect } from 'react'
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    MenuItem,
    Rating,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import { useDropzone } from "react-dropzone";

import { CircularProgress } from '@mui/material';
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {installMethods} from "@/app/const/const";
import {router} from "next/client";

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
    own: boolean,
    details: {
        img_screenshot: { id: string, img: string }[],
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

type Img = {
    url: string,
    img: File
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

export default function Page({ params }: { params: { appId: string } }) {
    const appId = params.appId
    const { data: _session, status } = useSession()
    const session = _session as Session

    const [data, setData] = useState<AppInfoData | null>(null)

    const initAppInfo = (data: AppInfoData | null): AppInfo => {
        if (data === null) {
            return NullAppData
        }
        return {
            id: data.id,
            name: data.name,
            team: data.team,
            description: data.short_description || "説明はまだ追加されていません",
            youtube: data.youtube,
            icon: data.img ?? "https://placehold.jp/4380E0/ffffff/180x180.png?text=no%20image",
            details: {
                imgScreenshot: data.details.img_screenshot.map((item) => item.img),
                requiredSpec: data.details.required_spec,
                install: data.details.install,
                forJob: data.details.forJob
            },
        }
    }

    const iconConfig = { width: 180, height: 180 }
    const screenshotConfig = { width: 800, height: 450 }

    const appNameRef = useRef<HTMLInputElement>()
    const appDescriptionRef = useRef<HTMLInputElement>()
    const appYoutubeRef = useRef<HTMLInputElement>()
    const appDownloadLinkRef = useRef<HTMLInputElement>()
    const appInstallMethodRef = useRef<HTMLInputElement>()

    const [isEditable, setEditable] = useState<boolean>(false)
    const [appInfo, setAppInfo] = useState<AppInfo>(NullAppData)
    const [prevAppInfo, setPrevAppInfo] = useState<AppInfo>(appInfo)
    const [appIcon, setAppIcon] = useState<Img>()
    const [appScreenshot, setAppScreenshot] = useState<Img[]>([])
    const [deleteImgId, setDeleteImgId] = useState<string[]>([])

    useEffect(() => {
        fetch(`/api/v0/projects/${appId}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data)
                setAppInfo(initAppInfo(data))
            })
    }, [])

    useEffect(() => {
        if (status === "authenticated") {
            fetch(`/api/v0/projects/${appId}`, {
                headers : {
                    "x-auth-token": session.access_token as string
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setData(data)
                    setAppInfo(initAppInfo(data))
                })
        }
    }, [session])

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
            enqueueSnackbar("pngファイルまたはjpegファイルを選択してください", { variant: "error" })
            return
        }

        const url = window.URL.createObjectURL(acceptedFiles[0])
        const { width, height } = await imageSize(url)
        if (!(width === iconConfig.width && height === iconConfig.height)) {
            enqueueSnackbar(`"スクリーンショットのサイズは${iconConfig.width}x${iconConfig.height}にしてください`, { variant: "error" })
            return
        }

        setAppIcon({ url: url, img: acceptedFiles[0] })
        setAppInfo({ ...appInfo, icon: url })
    }, [appIcon, appInfo])

    const onDropSs = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles[0].type !== "image/png" && acceptedFiles[0].type !== "image/jpeg") {
            enqueueSnackbar("pngファイルまたはjpegファイルを選択してください", { variant: "error" })
            return
        }

        const url = window.URL.createObjectURL(acceptedFiles[0])
        const { width, height } = await imageSize(url)
        if (!(width === screenshotConfig.width && height === screenshotConfig.height)) {
            enqueueSnackbar(`画像サイズは${screenshotConfig.width}x${screenshotConfig.height}にしてください`, { variant: "error" })
            return
        }

        setAppScreenshot([...appScreenshot, {url: url, img: acceptedFiles[0] }])
        const newScreenshotUrl = [...appInfo.details.imgScreenshot, url]
        const newDetails = { ...appInfo.details, imgScreenshot: newScreenshotUrl }
        setAppInfo({ ...appInfo, details: newDetails })
    }, [appScreenshot, appInfo])

    const { getRootProps: getRootPropsIcon, getInputProps: getInputPropsIcon } = useDropzone({ onDrop: onDropIcon })
    const { getRootProps: getRootPropsSs, getInputProps: getInputPropsSs, open } = useDropzone({ onDrop: onDropSs, noDrag: true, noClick: true })

    const onSaveAppInfo = async () => {
        if (appNameRef.current?.value === "") {
            enqueueSnackbar("アプリ名を入力してください", { variant: "error" })
            return
        }
        try {
            // App name
            if (appNameRef.current?.value !== "") {
                await fetch(`/api/v0/projects/${appId}/name?name=${appNameRef.current?.value}`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string
                    }
                })
                setAppInfo({ ...appInfo, name: (appNameRef.current?.value as string) })
            }
            // App description
            if (appDescriptionRef.current?.value !== "") {
                await fetch(`/api/v0/projects/${appId}/description?description=${appDescriptionRef.current?.value}`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string
                    }
                })
                setAppInfo({ ...appInfo, description: (appDescriptionRef.current?.value as string) })
            }
            // YouTube
            if (appYoutubeRef.current?.value !== "") {
                await fetch(`/api/v0/projects/${appId}/youtube?youtube=${appYoutubeRef.current?.value}`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string
                    }
                })
                setAppInfo({ ...appInfo, youtube: (appYoutubeRef.current?.value as string) })
            }
            // Install
            if (appInstallMethodRef.current?.value !== "" || appDownloadLinkRef.current?.value !== "") {
                await fetch(`/api/v0/projects/${appId}/details/install`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string,
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        method: appInstallMethodRef.current?.value,
                        info: appDownloadLinkRef.current?.value,
                        additional: ""
                    })
                })
            }
            // App icon
            if (appIcon) {
                const sendIcon = new FormData()
                sendIcon.append("img", appIcon.img)
                await fetch(`/api/v0/projects/${appId}/img`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string,
                    },
                    body: sendIcon
                })
            }
            // Send screenshot
            for (const item of appScreenshot) {
                const sendScreenshot = new FormData()
                sendScreenshot.append("img", item.img)
                await fetch(`/api/v0/projects/${appId}/details/imgs`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string,
                    },
                    body: sendScreenshot
                })
            }
            // Delete screenshot
            for (const imgId of deleteImgId) {
                await fetch(`/api/v0/projects/${appId}/details/imgs/${imgId}`, {
                    method: "delete",
                    headers: {
                        "x-auth-token": session.access_token as string,
                    }
                })
            }
            enqueueSnackbar("アプリの更新が完了しました", { variant: "success" })
            setEditable(false)
        } catch (e) {
            enqueueSnackbar("通信に失敗しました", { variant: "error" })
        }
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
        // 表示用
        const newAppInfoScreenshot = appInfo.details.imgScreenshot.filter((item) => item !== url)
        const newDetails = { ...appInfo.details, imgScreenshot: newAppInfoScreenshot }
        setAppInfo({ ...appInfo, details: newDetails })

        // POST用
        const newAppScreenshot = appScreenshot.filter((item) => item.url !== url)
        setAppScreenshot(newAppScreenshot)

        // Delete用
        if (data) {
            const newDeleteImgId = data.details.img_screenshot.map((item) => {
                if (item.img === url) {
                    return item.id
                }
            }) as string[]
            setDeleteImgId(newDeleteImgId)
        }
    }

    const convertYoutubeLink = (link: string): string => {
        const youtubeId = link.split("/").slice(-1)[0]
        return `https://www.youtube.com/embed/${youtubeId}`
    }

    if (data === null) {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress  />
        </div>
    }

    return (
        <>
            <Container sx={{ mt: 3 }}>
                <SnackbarProvider />
                {data.own &&
                    <Box sx={{ textAlign: "right" }}>
                        {isEditable ?
                            <>
                                <Button variant="contained" color="secondary" onClick={onSaveAppInfo}
                                        sx={{ mr: 1 }}>Save</Button>
                                <Button variant="contained" color="error" onClick={onCancelEdit}>Cancel</Button>
                            </> :
                            <Button variant="contained" color="secondary" onClick={onEditAppInfo}>Edit</Button>
                        }
                    </Box>
                }
                <Grid container alignItems="center" sx={{ mt: 3 }}>
                    <Grid item xs={3}>
                        {isEditable ?
                            <div {...getRootPropsIcon()}>
                                <input {...getInputPropsIcon()} />
                                <Box sx={{ position: "relative" }}>
                                    <img src={appInfo.icon} alt="icon" style={{ width: iconConfig.width, height: iconConfig.height }} />
                                    <Box sx={{ backgroundColor: "white", opacity: 0.7, width: iconConfig.width, height: iconConfig.height, position: "absolute", top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box sx={{ textAlign: "center" }}>ここに画像を<br />ドロップ<br />{`(${iconConfig.width}x${iconConfig.height})`}</Box>
                                    </Box>
                                </Box>
                            </div> :
                            <img src={appInfo.icon} alt="icon" style={{ width: 180, height: 180 }} />
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {isEditable ?
                            <TextField size="small" variant="outlined" inputRef={appNameRef}
                                       inputProps={{ style: { fontSize: 48 } }} sx={{ width: 500 }}
                                       defaultValue={appInfo.name} /> :
                            <Typography variant="h3">{appInfo.name}</Typography>
                        }
                        <Typography variant="subtitle1">{appInfo.team}</Typography>
                        <Rating name="read-only" value={3} size="small" sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={3}>
                        {appInfo.details.install.length >= 0 &&
                            <Button variant="contained" sx={{ width: 2 / 3, height: 50 }}
                                    href={appInfo.details.install[0].info}
                                    onClick={() => {router.push("/")}}
                                    disabled={isEditable || appInfo.details.install.length === 0}>ダウンロード</Button>
                        }
                        {/*TODO ボタンをクリックしたらダウンロードをするとともにインストール説明ページに遷移*/}
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">このアプリについて</Typography>
                    {isEditable ?
                        <TextField fullWidth multiline rows={5} size="small" variant="outlined"
                                   inputRef={appDescriptionRef}
                                   defaultValue={appInfo.description} /> :
                        <Typography component="div">{appInfo.description}</Typography>
                    }
                </Stack>
                <Stack sx={{ mt: 5 }} direction="row" alignItems="center">
                    <ScreenshotCarousel imgList={appInfo.details.imgScreenshot} editable={isEditable}
                                        onDelete={onDeleteScreenshot} />
                    {isEditable &&
                        <div {...getRootPropsSs()}>
                            <input {...getInputPropsSs()} />
                            <IconButton size="large" onClick={open} sx={{ height: 50 }} disabled={appInfo.details.imgScreenshot.length >= 5}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </div>
                    }
                </Stack>
                {isEditable &&
                    <Box sx={{ textAlign: "center" }}>スクリーンショットのサイズは{`${screenshotConfig.width}x${screenshotConfig.height}`}にしてください</Box>
                }
                {isEditable &&
                    <Grid container>
                        <Grid item xs={4}>
                            <Stack spacing={2} mt={5}>
                                <Typography variant="h4">アプリの種類</Typography>
                                <Select
                                    defaultValue={appInfo.details.install[0].method}
                                    sx={{width: 300}}
                                    inputRef={appInstallMethodRef}
                                >
                                    {
                                        installMethods.map((item, i) => <MenuItem value={item} key={i}>{item}</MenuItem>)
                                    }
                                </Select>
                            </Stack>
                        </Grid>
                        <Grid item xs={8}>
                            <Stack spacing={2} mt={5}>
                                <Typography variant="h4">GitHub Releasesのダウンロードリンク</Typography>
                                <TextField variant="outlined" inputRef={appDownloadLinkRef}
                                           defaultValue={appInfo.details.install[0].info}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                }
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">紹介動画</Typography>
                    {isEditable ?
                        <TextField size="small" variant="outlined" inputRef={appYoutubeRef}
                                   defaultValue={appInfo.youtube} sx={{ width: 500 }} /> :
                        <>
                            {appInfo.youtube &&
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Box sx={{ width: 0.7 }}>
                                        <Box className="video">
                                            <iframe width="560" height="315" src={convertYoutubeLink(appInfo.youtube)}
                                                    title="YouTube video player" frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen></iframe>
                                        </Box>
                                    </Box>
                                </Box>
                            }
                        </>

                    }
                </Stack>
            </Container>
        </>
    );
}