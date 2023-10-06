'use client'

import React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

export default function Home() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </div>
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