"use client"
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import {grey} from "@mui/material/colors";
import React, {useRef, useState} from "react";
import {MuiFileInput} from "mui-file-input";

interface AppInfo {
    id: string
    name: string,
    description: string,
    youtube: string,
    icon: File | null,
    screenshots: File[]
}

export default function Register() {
    const appInfoMock: AppInfo = {
        id: "0",
        name: "App 0",
        description: "description 0 ".repeat(50),
        youtube: "https://youtu.be/ZaZMZ9jePKw?si=x96UEomj8VWoHw0-",
        icon: null,
        screenshots: [],
    }

    const appNameRef = useRef<HTMLInputElement>()
    const appDescriptionRef = useRef<HTMLInputElement>()
    const appYoutubeRef = useRef<HTMLInputElement>()
    const appIconRef = useRef<File>()

    const [isAppInfoEditable, setAppInfoEditable] = useState<boolean>(false)
    const [isAppImageEditable, setAppImageEditable] = useState<boolean>(false)
    const [appInfo, setAppInfo] = useState<AppInfo>(appInfoMock)

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
        if (appYoutubeRef.current?.value != appInfo.youtube) {
            console.log("youtube changed")
            setAppInfo({...appInfo, youtube: (appYoutubeRef.current?.value as string)})
        }
        setAppInfoEditable(false)
    }

    const onSaveAppImage = () => {
        // TODO: update images by API
        setAppImageEditable(false)
    }

    const onChangeAppIcon = (iconFile: File | null) => {
        setAppInfo({...appInfo, icon: iconFile})
    }

    const onChangeScreenshot = (screenshotFile: File[], ) => {
        setAppInfo({...appInfo, screenshots: screenshotFile})
    }

    return (
        <>
            <Container sx={{bgcolor: grey[100]}}>
                <Typography variant="h3" sx={{mt: 3}}>アプリの登録</Typography>
                <Card sx={{minWidth: 275, mt: 3}}>
                    <CardHeader title="App Info"/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>App Name :</Grid>
                            <Grid item xs={9}>
                                {isAppInfoEditable ?
                                    <TextField size="small" variant="standard" inputRef={appNameRef}
                                               defaultValue={appInfo.name}/> :
                                    <Typography variant="body1">{appInfo.name}</Typography>
                                }
                            </Grid>
                            <Grid item xs={3}>Description :</Grid>
                            <Grid item xs={9}>
                                {isAppInfoEditable ?
                                    <TextField fullWidth multiline size="small" variant="standard"
                                               inputRef={appDescriptionRef}
                                               defaultValue={appInfo.description}/> :
                                    <Typography variant="body1">{appInfo.description}</Typography>
                                }
                            </Grid>
                            <Grid item xs={3}>YouTube Link :</Grid>
                            <Grid item xs={9}>
                                {isAppInfoEditable ?
                                    <TextField size="small" variant="standard" inputRef={appYoutubeRef}
                                               defaultValue={appInfo.youtube} sx={{width: 500}}/> :
                                    <Typography component="a" variant="body1"
                                                href={appInfo.youtube}>{appInfo.youtube}</Typography>
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            {isAppInfoEditable ?
                                <Button size="small" onClick={onSaveAppInfo}>Save</Button> :
                                <Button size="small" onClick={() => setAppInfoEditable(true)}>Edit</Button>
                            }
                        </Grid>
                    </CardActions>
                </Card>
                <Card sx={{minWidth: 275, mt: 3}}>
                    <CardHeader title="App Images"/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>App Icon :</Grid>
                            <Grid item xs={3}>
                                {appInfo.icon ?
                                    <img src={window.URL.createObjectURL(appInfo.icon)} width={128} /> :
                                    <img src="icon128.png" width={128} />
                                }
                            </Grid>
                            <Grid item xs={6}>
                                {isAppImageEditable &&
                                    <MuiFileInput value={appInfo.icon} onChange={onChangeAppIcon}/>
                                }
                            </Grid>
                            <Grid item xs={3}>Screenshot :</Grid>
                            {
                                appInfo.screenshots.length !== 0 ?
                                    appInfo.screenshots.map((item) => (
                                        item &&
                                            <Grid item xs={3}>
                                                <img src={window.URL.createObjectURL(item)} width={128} />
                                            </Grid>
                                    )) :
                                    <img src="placeholder.jpg" width={300} />
                            }
                        </Grid>
                        <Grid item xs={9}>
                            {isAppImageEditable &&
                                <MuiFileInput multiple value={appInfo.screenshots} onChange={onChangeScreenshot}/>
                            }
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            {isAppImageEditable ?
                                <Button size="small" onClick={onSaveAppImage}>Save</Button> :
                                <Button size="small" onClick={() => setAppImageEditable(true)}>Edit</Button>
                            }
                        </Grid>
                    </CardActions>
                </Card>
            </Container>
        </>
    )
}