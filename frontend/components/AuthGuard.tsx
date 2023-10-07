'use client'
import { useSession, signIn } from "next-auth/react"
import { CircularProgress } from '@mui/material';

interface AuthGuardProps {
    enabled: boolean
}

const AuthGuard = ({ enabled }: AuthGuardProps) => {
    const { data: session, status } = useSession()

    if (!enabled) {
        return (
            <div />
        )
    }

    if (status === "loading") {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </div>
    }

    if (status === "authenticated") {
        return (
            <div />
        );
    } else {
        signIn()
    }
};

export default AuthGuard;
