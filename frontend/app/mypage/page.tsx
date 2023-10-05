'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import AuthGuard from "@/components/AuthGuard";
import { Session } from "next-auth"
import { grey } from "@mui/material/colors";

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';

import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@mui/material/styles';

import AddIcon from '@mui/icons-material/Add';

const theme = createTheme({
    palette: {
        primary: {
            main: "#003893",
        }
    },
});

interface Team {
    id: string,
    name: string,
    year: string,
    description: string | null,
    members: string[]
    previous: string | null
}

export default function Home() {
    const { data: _session, status } = useSession()

    if (status !== "authenticated") {
        return <AuthGuard enabled={true} />
    }

    const session = _session as Session

    const [data, setData] = useState<Team[] | null>(null)

    useEffect(() => {
        fetch('/api/v0/teams/')
            .then((response) => response.json())
            .then((data) => setData(data))
    }, [])

    console.log(data)

    if (data === null) {
        return <div>loading...</div>
    }

    data.sort((a, b) => {
        if (a.year > b.year) {
            return -1
        } else if (a.year < b.year) {
            return 1
        } else {
            return 0
        }
    })

    return (
        <div>
            <Container sx={{ mt: 3 }}>
                <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                    <CardHeader
                        title={
                            <Typography variant="h3">
                                {session.user?.name}
                            </Typography>
                        }
                        avatar={
                            <Avatar
                                alt={session.user?.name as string}
                                src={session.user?.image as string}
                                sx={{ width: 80, height: 80 }}
                            />
                        }
                    />
                    <CardContent>

                    </CardContent>
                </Card>
                <Card sx={{ m: 5, "border": "1px solid #0055df50", }} elevation={0}>

                    <CardHeader
                        sx={{ zIndex: 0, position: "relative" }}
                        title={
                            <>
                                <Typography variant="h4" sx={{ p: 2 }}>
                                    Teams
                                </Typography>
                            </>

                        }
                    >
                    </CardHeader>
                    <CardContent sx={{ px: 5, pb: 5, bgcolor: grey[200] }}>
                        {data.map((e) => (
                            <Card sx={{ m: 2, p: 1 }}>
                                <CardHeader
                                    title={
                                        <>
                                            <Typography variant="body1" display="inline" sx={{ mr: 3 }}>
                                                {e.year}
                                            </Typography>
                                            <Typography variant="h5" display="inline" >
                                                {e.name}
                                            </Typography>
                                        </>
                                    }
                                />
                                <CardContent>
                                    <Typography sx={{ p: 1 }}>

                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </Container>
            <ThemeProvider theme={theme}>
                <Fab
                    color='primary'
                    variant='extended'
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <AddIcon />
                    Add Team
                </Fab>
            </ThemeProvider>
        </div >
    )
}