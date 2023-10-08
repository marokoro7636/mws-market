"use client"

import React from 'react'
import { Button, Container, Grid, Typography, Card, CardContent, CardActions, CardHeader, TextField, FormControl } from "@mui/material";

import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@mui/material/styles';

import { SnackbarProvider, enqueueSnackbar } from 'notistack';

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

type FormData = {
    name: string | null,
    year: string | null,
    description: string | null,
}

type FormDataValidated = {
    name: string,
    year: string,
    description: string,
    members: string[]
}

export default function Page() {
    const { data: _session, status } = useSession()
    const router = useRouter()

    if (status !== "authenticated") {
        return <AuthGuard enabled={true} />
    }

    const session = _session as Session

    let data = {} as FormData

    const validate = (data: FormData): FormDataValidated | null => {
        if (!data.name && data.name !== "") {
            enqueueSnackbar("Team name is required", { variant: "error" })
            return null
        }
        if (!data.year) {
            enqueueSnackbar("Year is required", { variant: "error" })
            return null
        }
        const year = parseFloat(data.year)
        if (!year || !(2015 <= year && year <= 2030)) {
            enqueueSnackbar("Year should be between 2015 and 2030", { variant: "error" })
            return null
        }
        let description = "None"
        if (data.description && data.description !== "") {
            description = data.description
        }
        return {
            name: data.name,
            year: data.year,
            description: description,
            members: [session.uid as string]
        }
    }

    const submit = (data: FormDataValidated) => {
        fetch('/api/v0/teams/', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "X-AUTH-TOKEN": session.access_token as string,
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("Team created successfully", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("Failed to create team", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            if (e.id) {
                router.push(`/teams/${e.id}`)
            }
            console.log(e)
        })
    }

    return (
        <Container sx={{ mt: 3 }}>
            <SnackbarProvider />

            <Typography variant="h3">新規チームの登録</Typography>

            <Card sx={{ p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="チーム情報"
                />
                <CardContent>
                    <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }}>
                        <Grid item xs={3} md={3}>
                            チーム名 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <TextField size="small"
                                       variant="standard"
                                       onChange={(e) => { data.name = e.target.value }}
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            年度 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <TextField size="small"
                                       variant="standard"
                                       onChange={(e) => { data.year = e.target.value }}
                            >
                            </TextField>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            チーム説明 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            <TextField size="small"
                                       multiline fullWidth
                                       variant="standard"
                                       onChange={(e) => { data.description = e.target.value }}
                            >
                            </TextField>
                        </Grid>
                    </Grid>

                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <ThemeProvider theme={theme}>
                            <Button color="primary" variant="contained" disableElevation={true} onClick={() => {
                                const validated = validate(data)
                                if (validated === null) {
                                    return
                                }
                                submit(validated)
                            }}>チーム作成</Button>
                        </ThemeProvider>
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    );
}