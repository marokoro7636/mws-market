'use client'
import { useSession, signIn } from "next-auth/react"
import { useRouter, usePathname } from 'next/navigation';

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
        return <p>Loading...</p>
    }
    console.log(session)
    const router = useRouter();

    if (status === "authenticated") {
        return (
            <div />
        );
    } else {
        signIn("slack", { callbackUrl: usePathname() })
    }
};

export default AuthGuard;

export const getAccessToken = (): string | undefined => {
    const { data: session, status } = useSession()
    if (status === "loading") {
        return undefined
    }

    if (status === "authenticated") {
        return session.access_token
    } else {
        return undefined
    }
}