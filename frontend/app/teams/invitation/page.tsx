"use client"

import React, { useState, useEffect } from 'react'
import { Button, Container, Grid, Typography, Card, CardContent, CardActions, CardHeader, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";

import Divider from '@mui/material/Divider';

import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@mui/material/styles';

import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import { useSearchParams } from "next/navigation";

import { useSession } from "next-auth/react"
import AuthGuard from "@/components/AuthGuard";
import { Session } from "next-auth"
import { useRouter } from 'next/navigation';

const theme = createTheme({
    palette: {
        primary: {
            main: "#003893",
        }
    },
});

interface Member {
    id: string,
    name: string,
    image: string,
}

interface TeamInternalInfo {
    id: string
    name: string,
    year: string,
    description: string,
    members: Member[],
    secret: string,
    previous: string,
    relations: TeamInternalInfo[],
}

export default function Page() {
    const { data: _session, status } = useSession()
    const router = useRouter()

    const searchParams = useSearchParams();

    const [teamInternalInfo, setTeamInternalInfo] = useState<TeamInternalInfo>({} as TeamInternalInfo)

    const updateTeamInfo = () => {
        if (!searchParams.has("secret")) {
            return
        }
        if (status !== "authenticated") {
            return
        }
        const secret = searchParams.get("secret") as string
        const session = _session as Session
        fetch(`/api/v0/teams/invitation/${secret}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": session?.access_token as string,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.detail) {
                    enqueueSnackbar(data.detail, { variant: "error" })
                    enqueueSnackbar("3秒後にメインページに戻ります", { variant: "info" })
                    setTimeout(() => router.push(`/`), 3000)
                }
                const alreadyJoined = data.members.some((e: Member) => {
                    return e.id === session?.uid
                })
                if (alreadyJoined) {
                    // console.log("already joined")
                    router.push(`/teams/${data.id}`)
                }
                setTeamInternalInfo(data)
            })
    }

    useEffect(updateTeamInfo, [status, searchParams, _session, router])

    if (status !== "authenticated") {
        return <AuthGuard enabled={true} />
    }

    const joinTeam = () => {
        const secret = searchParams.get("secret") as string
        const session = _session as Session
        fetch(`/api/v0/teams/invitation/${secret}?member_id=${session.uid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": session?.access_token as string,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.detail) {
                    enqueueSnackbar("参加できませんでした", { variant: "error" })
                }
                if (data.status === "ok") {
                    enqueueSnackbar("参加しました", { variant: "success" })
                    setTimeout(() => router.push(`/teams/${teamInternalInfo.id}`), 1000)
                }
            })
    }

    return (
        <Container sx={{ p: 3 }}>
            <SnackbarProvider />

            <Typography variant="h3">新しいチームに参加</Typography>

            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardContent>
                    <Typography variant='h4' sx={{ mb: 3 }}>Team Info</Typography>
                    <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }}>
                        <Grid item xs={3} md={3}>
                            チーム名 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <Typography variant="body1">{teamInternalInfo.name}</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            年度 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <Typography variant="body1">{teamInternalInfo.year}</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            説明 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <Typography variant="body1">{teamInternalInfo.description}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }}></Divider>
                    <Typography variant='h6'>メンバー</Typography>
                    <List >
                        {teamInternalInfo.members?.map((e) => (
                            <ListItem key={e.id}           >
                                <ListItemAvatar>
                                    <Avatar
                                        src={e.image}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={e.name}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 2 }}></Divider>
                    <Typography variant='h6'>関係のあるチーム</Typography>
                    <List >
                        {teamInternalInfo.relations?.map((e) => (
                            <ListItem key={e.id}>
                                <ListItemText
                                    primary={e.name}
                                    secondary={e.year}
                                />
                            </ListItem>
                        ))}
                    </List>

                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <ThemeProvider theme={theme}>
                            <Button color="primary" variant="contained" disableElevation={true} onClick={() => {
                                joinTeam()
                            }}>チームへ参加</Button>
                        </ThemeProvider>
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    );
}