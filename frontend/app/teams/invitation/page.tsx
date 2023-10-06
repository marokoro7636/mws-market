"use client"

import React, { useState, useEffect } from 'react'
import { Button, Container, Grid, Typography, Card, CardContent, CardActions, CardHeader, TextField, FormControl } from "@mui/material";

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
    name: string,
    year: string,
    description: string,
    members: Member[],
    secret: string,
    previous: string,
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
                    router.push(`/teams/${data.id}`)
                }
                setTeamInternalInfo(data)
            })
    }

    useEffect(updateTeamInfo, [status, searchParams])

    if (status !== "authenticated") {
        return <AuthGuard enabled={true} />
    }

    const session = _session as Session



    return (
        <Container sx={{ p: 3 }}>
            <SnackbarProvider />

            <Typography variant="h3">Register New Team</Typography>

            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="Team Info"
                />
                <CardContent>
                    {/* <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }}>
                        <Grid item xs={3} md={3}>
                            Team Name :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <TextField size="small"
                                variant="standard"
                                onChange={(e) => { data.name = e.target.value }}
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            Year:
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <TextField size="small"
                                variant="standard"
                                onChange={(e) => { data.year = e.target.value }}
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            Description:
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <TextField size="small"
                                multiline fullWidth
                                variant="standard"
                                onChange={(e) => { data.description = e.target.value }}
                            >
                            </TextField>
                        </Grid>
                    </Grid> */}

                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <ThemeProvider theme={theme}>
                            <Button color="primary" variant="contained" disableElevation={true} onClick={() => {
                                // const validated = validate(data)
                                // if (validated === null) {
                                //     return
                                // }
                                // submit(validated)
                            }}>Create Team</Button>
                        </ThemeProvider>
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    );
}