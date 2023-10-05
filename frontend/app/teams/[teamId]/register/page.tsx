"use client"
import React, { useCallback, useRef, useState } from 'react'
import {Box, Button, Container, Grid, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import { useDropzone } from "react-dropzone";
import {useSession} from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import {Session} from "next-auth";

type Img = {
    url: string,
    img: File
}

export default function Page({ params }: { params: { teamId : string } }) {
    const teamId = params.teamId
    const { data: _session, status } = useSession()
    const session = _session as Session

    const iconConfig = { width: 180, height: 180 }
    const screenshotConfig = { width: 800, height: 450 }

    const appNameRef = useRef<HTMLInputElement>()
    const [appNameError, setAppNameError] = useState<boolean>(false)
    const appNameChange = () => {
        if (appNameRef.current) {
            if (appNameRef.current?.value === "") {
                setAppNameError(true)
            } else {
                setAppNameError(false)
            }
        }
    }

    const appDescriptionRef = useRef<HTMLInputElement>()
    const appYoutubeRef = useRef<HTMLInputElement>()
    const appDownloadLinkRef = useRef<HTMLInputElement>()
    const appInstallMethodRef = useRef<HTMLInputElement>()

    const [appIcon, setAppIcon] = useState<Img>()
    const [appScreenshot, setAppScreenshot] = useState<Img[]>([])

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

        setAppIcon({ url: url, img: acceptedFiles[0] })
    }, [appIcon])

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

        setAppScreenshot([...appScreenshot, { url: url, img: acceptedFiles[0] }])
    }, [appScreenshot])

    const { getRootProps: getRootPropsIcon, getInputProps: getInputPropsIcon } = useDropzone({ onDrop: onDropIcon })
    const { getRootProps: getRootPropsSs, getInputProps: getInputPropsSs, open } = useDropzone({ onDrop: onDropSs, noDrag: true, noClick: true })

    const onSaveAppInfo = async () => {
        if (appNameRef.current?.value === "") {
            return
        }
        try {
            // プロジェクトID取得
            const res: { id: string } = await (await fetch("/api/v0/projects/", {
                method: "post",
                headers: {
                    "x-auth-token": session.access_token as string,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ team: teamId, name: appNameRef.current?.value })
            })).json()
            const projectId = res.id
            // App name
            await fetch(`/api/v0/projects/${projectId}/name?name=${appNameRef.current?.value}`, {
                method: "post",
                headers: {
                    "x-auth-token": session.access_token as string
                }
            })
            // App description
            if (appDescriptionRef.current?.value !== "") {
                await fetch(`/api/v0/projects/${projectId}/description?description=${appDescriptionRef.current?.value}`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string
                    }
                })
            }
            // YouTube
            if (appYoutubeRef.current?.value !== "") {
                await fetch(`/api/v0/projects/${projectId}/youtube?youtube=${appYoutubeRef.current?.value}`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string
                    }
                })
            }
            // Install
            if (appInstallMethodRef.current?.value !== "" || appDownloadLinkRef.current?.value !== "") {
                await fetch(`/api/v0/projects/${projectId}/details/install`, {
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
                await fetch(`/api/v0/projects/${projectId}/img`, {
                    method: "post",
                    headers: {
                        "x-auth-token": session.access_token as string,
                    },
                    body: sendIcon
                })
            }
            // Screenshot
            if (appScreenshot.length >= 1) {
                for (let item of appScreenshot) {
                    const sendScreenshot = new FormData()
                    sendScreenshot.append("img", item.img)
                    await fetch(`/api/v0/projects/${projectId}/details/imgs`, {
                        method: "post",
                        headers: {
                            "x-auth-token": session.access_token as string,
                        },
                        body: sendScreenshot
                    })
                }
            }
        } catch (e) {
            alert("通信に失敗しました")
        }
    }

    const onDeleteScreenshot = (url: string) => {
        const newScreenshot = appScreenshot.filter((item) => {
            if (item.url === url) {
                window.URL.revokeObjectURL(url)
                return false
            }
            return true
        })
        setAppScreenshot(newScreenshot)
    }

    const installMethods = ["Chrome拡張機能", "実行ファイル", "Webアプリ"]

    if (status !== "authenticated") {
        return <AuthGuard enabled={true} />
    }

    return (
        <>
            <Container sx={{ mt: 3 }}>
                <Grid container alignItems="center" sx={{ mt: 3 }}>
                    <Grid item xs={3}>
                        <div {...getRootPropsIcon()}>
                            <input {...getInputPropsIcon()} />
                            <Box sx={{ position: "relative" }}>
                                {appIcon ?
                                    <img src={appIcon.url} alt="icon"
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
                                   inputProps={{ style: { fontSize: 48 } }} sx={{ width: 500, mt: 2 }}
                                   onChange={appNameChange} error={appNameError}
                                   helperText={appNameError && "アプリ名を入力してください"}
                        />
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
                            <Typography variant="h4">アプリのダウンロードリンク</Typography>
                            <TextField variant="outlined" inputRef={appDownloadLinkRef} />
                        </Stack>
                    </Grid>
                </Grid>
                <Stack spacing={2} mt={5}>
                    <Typography variant="h4">スクリーンショット({`${screenshotConfig.width}x${screenshotConfig.height}`})</Typography>
                    <div {...getRootPropsSs()}>
                        <input {...getInputPropsSs()} />
                        <Button size="large" onClick={open} variant="contained" disabled={appScreenshot.length >= 5}>
                            追加
                        </Button>
                    </div>
                    <ScreenshotCarousel imgList={appScreenshot.map((item) => item.url)} editable={true}
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