'use client'

import React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#003893',
        },
    },
});

export default function Home() {
    const { data: session, status } = useSession()

    if (status === "loading") {
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
    console.log(session)

    if (status === "authenticated") {
        return (
            <>
                <p>You are logged in as {session.user?.name}</p>
                <Button onClick={() => signOut()}>Logout</Button>
            </>
        )
    } else {
        return (
            <Button onClick={() => signIn("slack")}>Login</Button>
        )
    }
}