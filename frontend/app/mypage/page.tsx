'use client'

import React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import Button from '@mui/material/Button';
import AuthGuard from "@/components/AuthGuard";
import { Session } from "next-auth"

export default function Home() {
    const { data: _session, status } = useSession()

    if (status !== "authenticated") {
        return <AuthGuard enabled={true} />
    }

    const session = _session as Session

    return (
        <>  
            <p>You are logged in as {session.user?.name as string}</p>
        </>
    )
}