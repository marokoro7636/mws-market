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

    if (status === "authenticated") {
        return (
            <div />
        );
    } else {
        signIn("slack")
    }
};

export default AuthGuard;
