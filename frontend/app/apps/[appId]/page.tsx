"use client"
import React, { useCallback, useRef, useState, useEffect } from 'react'
import {
    Box,
    Button, Card, CardContent,
    Checkbox,
    Container,
    Fab,
    Grid,
    IconButton,
    MenuItem,
    Rating,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import { useDropzone } from "react-dropzone";

import { CircularProgress } from '@mui/material';
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { installMethods } from "@/const/const";
import { useRouter } from "next/navigation";
import { getIdenticon } from "@/components/StableImages";
import { convertYoutubeLink, imageSize } from "@/util/util";

import { List, ListItem } from "@mui/material";

import { createTheme, ThemeProvider } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';
import GenDescModal from '@/components/genDescModal';

import InsertCommentIcon from '@mui/icons-material/InsertComment';
import CardCarousel from "@/components/CardCarousel";

const theme = createTheme({
    palette: {
        primary: {
            main: '#003893',
        },
    },
});

// Read and Write
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

// ReadOnly
type AppInfoData = {
    id: string,
    name: string,
    team: string,
    short_description: string,
    description: string,
    youtube: string,
    own: boolean,
    details: {
        img_screenshot: { id: string, path: string }[],
        required_spec: {
            item: string,
            required: string
        }[],
        install: {
            id: string,
            method: string,
            info: string,
            additional: string
        }[],
        forJob: string
    },
    review: {
        id: string,
        user: string,
        title: string,
        content: string,
        rating: number
    }[],
    rating: {
        total: number,
        count: number
    }
    icon: string,
    img: string,
    previous: AppSummaryData[]
}

type AppSummaryData = {
    id: string,
    name: string,
    description: string,
    youtube: string,
    team: string
    team_id: string
    rating: {
        total: number,
        count: number
    }
    icon: string,
    img: string
}

type Img = {
    url: string,
    img: File
}

type User = {
    id: string,
    name: string,
    team: string[]
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

    const router = useRouter()
    const [data, setData] = useState<AppInfoData | null>(null)


    const initAppInfo = (data: AppInfoData | null): AppInfo => {
        if (data === null) {
            return NullAppData
        }
        return {
            id: data.id,
            name: data.name,
            team: data.team,
            description: data.description || "説明はまだ追加されていません",
            youtube: data.youtube,
            icon: data.icon ?? getIdenticon(data.id),
            details: {
                imgScreenshot: data.details?.img_screenshot.map((item) => item.path) ?? [],
                requiredSpec: data.details?.required_spec ?? [],
                install: data.details?.install ?? [],
                forJob: data.details?.forJob ?? ""
            }
        }
    }

    const iconConfig = { width: 180, height: 180 }
    const screenshotConfig = { width: 800, height: 450 }

    const appNameRef = useRef<HTMLInputElement>()
    const appDescriptionRef = useRef<HTMLInputElement>()
    const appYoutubeRef = useRef<HTMLInputElement>()
    const appDownloadLinkRef = useRef<HTMLInputElement>()
    const appInstallMethodRef = useRef<HTMLInputElement>()
    const appInstallAditionalRef = useRef<HTMLInputElement>()
    const reviewTitleRef = useRef<HTMLInputElement>()
    const reviewContentRef = useRef<HTMLInputElement>()

    const [isEditable, setEditable] = useState<boolean>(false)
    const [appInfo, setAppInfo] = useState<AppInfo>(NullAppData)
    const [prevAppInfo, setPrevAppInfo] = useState<AppInfo>(appInfo)
    const [appIcon, setAppIcon] = useState<Img | null>(null)
    const [appScreenshot, setAppScreenshot] = useState<Img[]>([])
    const [deleteImgId, setDeleteImgId] = useState<string[]>([])
    const [rating, setRating] = useState<number | null>(null)
    const [reviewerName, setReviewerName] = useState<string[]>([])

    const [modalOpen, setModalOpen] = React.useState(false)

    useEffect(() => {
        fetch(`/api/v0/projects/${appId}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data)
                setAppInfo(initAppInfo(data))
            })
    }, [appId])

    useEffect(() => {
        if (status === "authenticated") {
            (async () => {
                const fetchData = await fetch(`/api/v0/projects/${appId}`, {
                    headers: {
                        "x-auth-token": session.access_token as string
                    }
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setData(data)
                        setAppInfo(initAppInfo(data))
                        return data
                    })
                // レビュアーを取ってくる処理
                // for (const reviewer of fetchData.review) {
                //     await fetch(`/api/v0/users/${reviewer.user}`, {
                //         headers: {
                //             "x-auth-token": session.access_token as string
                //         }
                //     })
                //         .then((response) => response.json())
                //         .then((user: User) => { if (user.name) setReviewerName([...reviewerName, user.name]) })
                // }
            })()
        }
    }, [session, appId, status])

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
    }, [appInfo, iconConfig.height, iconConfig.width])

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

        setAppScreenshot([...appScreenshot, { url: url, img: acceptedFiles[0] }])
        const newScreenshotUrl = [...appInfo.details.imgScreenshot, url]
        const newDetails = { ...appInfo.details, imgScreenshot: newScreenshotUrl }
        setAppInfo({ ...appInfo, details: newDetails })
    }, [appScreenshot, appInfo, screenshotConfig.height, screenshotConfig.width])

    const { getRootProps: getRootPropsIcon, getInputProps: getInputPropsIcon } = useDropzone({ onDrop: onDropIcon })
    const { getRootProps: getRootPropsSs, getInputProps: getInputPropsSs, open } = useDropzone({ onDrop: onDropSs, noDrag: true, noClick: true })

    const onSaveAppInfo = async () => {
        if (appNameRef.current?.value === "") {
            enqueueSnackbar("プロジェクト名を入力してください", { variant: "error" })
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
            if (appInstallMethodRef.current?.value !== "" || appDownloadLinkRef.current?.value !== "" || appInstallAditionalRef.current?.value !== "") {
                if (data?.details.install) {
                    await fetch(`/api/v0/projects/${appId}/details/install/${data?.details.install[0].id}`, {
                        method: "delete",
                        headers: {
                            "x-auth-token": session.access_token as string,
                        },
                    })
                }
                await fetch(`/api/v0/projects/${appId}/details/install`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string,
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        method: appInstallMethodRef.current?.value,
                        info: appDownloadLinkRef.current?.value,
                        additional: appInstallAditionalRef.current?.value
                    })
                })
            }
            // App icon
            if (appIcon) {
                const sendIcon = new FormData()
                sendIcon.append("icon", appIcon.img)
                await fetch(`/api/v0/projects/${appId}/icon`, {
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
            enqueueSnackbar("プロジェクトの更新が完了しました", { variant: "success" })
            setEditable(false)
            window.location.reload()
        } catch (e) {
            enqueueSnackbar("通信に失敗しました", { variant: "error" })
            console.log(e)
        }
    }

    const onEditAppInfo = () => {
        setPrevAppInfo(appInfo)
        setEditable(true)
    }

    const onCancelEdit = () => {
        setAppScreenshot([])
        setAppIcon(null)
        setDeleteImgId([])
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
        if (data && data.details.img_screenshot) {
            for (const img of data.details.img_screenshot) {
                if (img.path === url) {
                    setDeleteImgId([...deleteImgId, img.id])
                }
            }
        }
    }

    const onSubmitReview = async () => {
        await fetch(`/api/v0/projects/${appId}/review`, {
            method: "post",
            headers: {
                "x-auth-token": session.access_token as string,
                "Content-Type": "application/json"

            },
            body: JSON.stringify({
                user: session.uid,
                title: reviewTitleRef.current?.value ?? "",
                content: reviewContentRef.current?.value ?? "",
                rating: rating
            })
        })
        enqueueSnackbar("レビューが投稿されました", { variant: "success" })
        window.location.reload()
    }

    if (data === null) {
        return <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            <ThemeProvider theme={theme}>
                <CircularProgress
                    size={75}
                    disableShrink
                />
            </ThemeProvider>
        </Box>
    }

    const installMethodToValue = (installMethod: string): string => {
        if (installMethod === "Chrome拡張機能") {
            return "chrome-extension"
        } else if (installMethod === "実行ファイル") {
            return "exe"
        } else if (installMethod === "Webアプリ") {
            return "web-app"
        } else if (installMethod === "データセット") {
            return "dataset"
        } else {
            return "other"
        }
    }

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    return (
        <>
            <Container sx={{ mt: 3 }}>
                <SnackbarProvider />
                <Grid container alignItems="center" sx={{ mt: 3 }}>
                    <Grid item xs={3}>
                        {isEditable ?
                            <div {...getRootPropsIcon()}>
                                <input {...getInputPropsIcon()} />
                                <Box sx={{ position: "relative" }}>
                                    <Box component="img" src={appInfo.icon} alt="icon" width={iconConfig.width} height={iconConfig.height} />
                                    <Box sx={{ backgroundColor: "white", opacity: 0.7, width: iconConfig.width, height: iconConfig.height, position: "absolute", top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box sx={{ textAlign: "center" }}>ここに画像を<br />ドロップ<br />{`(${iconConfig.width}x${iconConfig.height})`}</Box>
                                    </Box>
                                </Box>
                            </div> :
                            <Box component="img" src={appInfo.icon} alt="icon" width={180} height={180} />
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
                        <Stack spacing={0.5} direction="row" sx={{ mt: 2 }}>
                            <Rating readOnly value={data ? data.rating.total / data.rating.count : 0} />
                            {data && <Typography>({data.rating.count})</Typography>}
                        </Stack>
                    </Grid>
                    <Grid item xs={3}>
                        {appInfo.details.install.length >= 0 &&
                            <ThemeProvider theme={theme}>
                                <Button variant="contained" sx={{ width: 2 / 3, height: 50 }} disableElevation color="primary"
                                    href={appInfo.details.install.length !== 0 ? `/install/${appId}/${installMethodToValue(appInfo.details.install[0].method)}` : "#"}
                                    disabled={isEditable || appInfo.details.install.length === 0}>ダウンロード</Button>
                            </ThemeProvider>
                        }
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <GenDescModal
                        open={modalOpen}
                        onClose={handleModalClose}
                        onSave={(description) => {
                            if (!appDescriptionRef.current) return
                            appDescriptionRef.current.value = description
                        }}
                        appId={appId} access_token={session?.access_token as string}
                        youtube={appYoutubeRef.current?.value}
                        github={appDownloadLinkRef.current?.value}
                        description={appDescriptionRef.current?.value}
                    ></GenDescModal>
                    {isEditable ?
                        <>
                            <Grid container columns={{ xs: 12 }}>
                                <Grid xs={8}>
                                    <Typography variant="h4" display="inline">このプロジェクトについて</Typography>
                                </Grid>
                                <Grid xs={4} sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center"
                                }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            handleModalOpen()
                                        }}
                                        sx={{
                                            color: "#003893",
                                            borderColor: "#003893",
                                            p: 1
                                        }}>
                                        <InsertCommentIcon sx={{
                                            mr: 1
                                        }} />
                                        ChatGPTによる自動生成
                                    </Button>
                                </Grid>
                            </Grid>
                            <TextField fullWidth multiline rows={5} size="small" variant="outlined"
                                inputRef={appDescriptionRef}
                                defaultValue={appInfo.description} />
                        </>
                        :
                        <>
                            <Typography variant="h4">このプロジェクトについて</Typography>
                            <Typography component="div">{appInfo.description}</Typography>
                        </>
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
                    <>
                        <Grid container>
                            <Grid item xs={4}>
                                <Stack spacing={2} mt={5}>
                                    <Typography variant="h4">プロジェクトの種類</Typography>
                                    <Select
                                        defaultValue={appInfo.details.install.length !== 0 ? appInfo.details.install[0].method : ""}
                                        sx={{ width: 300 }}
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
                                        defaultValue={appInfo.details.install.length !== 0 ? appInfo.details.install[0].info : ""}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Stack spacing={2} mt={5}>
                            <Typography variant="h4">GitHubリポジトリへのリンク</Typography>
                            <Typography>ダウンロードボタンを押下後に遷移する画面に表示されます。</Typography>
                            <TextField variant="outlined" inputRef={appInstallAditionalRef} />
                        </Stack>
                    </>
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
                {data.previous &&
                    <Stack spacing={2} mt={5}>
                        <Typography variant="h4">このチームの過去のプロジェクト</Typography>
                        <CardCarousel projects={data.previous} />
                    </Stack>
                }
                {(!isEditable) &&
                    <Stack spacing={2} mt={5}>
                        <Typography variant="h4">レビュー・コメント</Typography>
                        {
                            data.review.map((item, i) => {
                                if (item.title === null || item.title === "") {
                                    return <></>
                                }
                                return (
                                    <Card sx={{ bgcolor: "#e8e8e8" }} elevation={0} key={i}>
                                        <CardContent>
                                            <Stack>
                                                <Typography variant="h5">{item.title}</Typography>
                                                {/* <Typography variant="body2" color="text.secondary">{reviewerName.length > 0 ? reviewerName[i] : "Anonymous"}</Typography> */}
                                                <Rating readOnly value={item.rating} />
                                                <Typography>{item.content}</Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            )
                        }
                        {status === "authenticated" &&
                            <Stack>
                                <Typography variant="h5" sx={{ mt: 3 }}>レビューを投稿</Typography>
                                <Typography variant="h6" sx={{ mt: 2 }}>評価</Typography>
                                <Rating size="large" onChange={(e, newValue) => setRating(newValue)} sx={{ width: 100 }} />
                                <Typography variant="h6" sx={{ mt: 2 }}>タイトル</Typography>
                                <TextField size="small" variant="outlined" inputRef={reviewTitleRef} sx={{ width: 2 / 3 }} />
                                <Typography variant="h6" sx={{ mt: 2 }}>投稿</Typography>
                                <TextField multiline rows={5} size="small" variant="outlined" inputRef={reviewContentRef} />
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <ThemeProvider theme={theme}>
                                        <Button variant="contained" onClick={onSubmitReview} sx={{ m: 3, width: 200 }} disableElevation>送信</Button>
                                    </ThemeProvider>
                                </Box>
                            </Stack>
                        }
                    </Stack>
                }
                {data.own &&
                    <Box sx={{ textAlign: "right" }}>
                        <ThemeProvider theme={theme}>
                            {isEditable ?
                                <>
                                    <Button variant="contained" disableElevation
                                        color="primary" onClick={onSaveAppInfo}
                                        sx={{ mr: 1 }}>Save</Button>
                                    <Button variant="contained" disableElevation
                                        color="error" onClick={onCancelEdit}>Cancel</Button>
                                </> :
                                <Fab color="primary" aria-label="edit" onClick={onEditAppInfo}
                                    variant="extended"
                                    sx={{
                                        position: "fixed",
                                        bottom: 16,
                                        right: 16,
                                    }}>
                                    <EditIcon />
                                    編集
                                </Fab>
                            }
                        </ThemeProvider>
                    </Box>
                }
            </Container>
        </>
    );
}