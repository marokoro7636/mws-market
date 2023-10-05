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
        if (!year || !(2015 < year && year < 2030)) {
            enqueueSnackbar("Year should be between 2015 and 2030", { variant: "error" })
            return null
        }
        let description = "None"
        if(data.description && data.description !== "") {
            description = data.description
        }
        return {
            name: data.name,
            year: data.year,
            description: description,
        }
    }

    const submit = (data: FormDataValidated) => {
        fetch('/api/v0/teams/', {
            method: 'POST',
            headers: {
                "X-AUTH-TOKEN": session.access_token as string,
            }
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("Team created successfully", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("Failed to create team", { variant: "error" })
            }
        }).then((e) => {
            router.push(`/teams/${e.id}`)
        })
    }

    return (
        <Container sx={{ p: 3 }}>
            <SnackbarProvider />

            <Typography variant="h3">Register New Team</Typography>

            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="Team Info"
                />
                <CardContent>
                    <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }}>
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
                    </Grid>

                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <ThemeProvider theme={theme}>
                            <Button color="primary" variant="contained" disableElevation={true} onClick={() => {
                                console.log(data)
                                const validated = validate(data)
                                if(validated === null) {
                                    return
                                }
                                console.log(validated)
                                submit(validated)
                            }}>Create Team</Button>
                        </ThemeProvider>
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    );
}