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

interface AppInfo {
    id: string
    name: string,
    description: string,
    youtube: string,
}

export default function Register() {
    const appInfoMock: AppInfo = {
        id: "0",
        name: "App 0",
        description: "description 0 ".repeat(50),
        youtube: "https://youtu.be/ZaZMZ9jePKw?si=x96UEomj8VWoHw0-"
    }

    const app_name = useRef<HTMLInputElement>()
    const app_description = useRef<HTMLInputElement>()
    const app_youtube = useRef<HTMLInputElement>()

    const [isAppInfoEditable, setAppInfoEditable] = useState<boolean>(false)
    const [appInfo, setAppInfo] = useState<AppInfo>(appInfoMock)

    const onSaveAppInfo = () => {
        if (app_name.current?.value != appInfo.name) {
            console.log("name changed")
            // TODO: update name by API
            setAppInfo({...appInfo, name: (app_name.current?.value as string)})
        }
        if (app_description.current?.value != appInfo.description) {
            console.log("description changed")
            setAppInfo({...appInfo, description: (app_description.current?.value as string)})
        }
        if (app_youtube.current?.value != appInfo.youtube) {
            console.log("youtube changed")
            setAppInfo({...appInfo, youtube: (app_youtube.current?.value as string)})
        }
        setAppInfoEditable(false)
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
                                    <TextField size="small" variant="standard" inputRef={app_name}
                                               defaultValue={appInfo.name}/> :
                                    <Typography variant="body1">{appInfo.name}</Typography>
                                }
                            </Grid>
                            <Grid item xs={3}>Description :</Grid>
                            <Grid item xs={9}>
                                {isAppInfoEditable ?
                                    <TextField fullWidth multiline size="small" variant="standard"
                                               inputRef={app_description}
                                               defaultValue={appInfo.description}/> :
                                    <Typography variant="body1">{appInfo.description}</Typography>
                                }
                            </Grid>
                            <Grid item xs={3}>YouTube Link :</Grid>
                            <Grid item xs={9}>
                                {isAppInfoEditable ?
                                    <TextField size="small" variant="standard" inputRef={app_youtube}
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

            </Container>
        </>
    )
}