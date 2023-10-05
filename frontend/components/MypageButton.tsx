"use client";

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import { CircularProgress } from '@mui/material';


// ログインボタン
export const MypageButton = () => {
    const router = useRouter()
    const { data: session, status } = useSession()

    const LoginAvator = (
        <IconButton onClick={() => {
            router.push("/mypage")
        }} sx={{ p: 0 }}>
            <Avatar alt="Login" src="https://placehold.jp/50/003893/ffffff/150x150.png?text=Login" />
        </IconButton>)

    const LoadingAvator = (
        <CircularProgress sx={{ p: 0 }} />
    )

    if (status === "loading") {
        return LoadingAvator
    }

    const LoginedAvator = (
        <IconButton onClick={() => {
            router.push("/mypage")
        }} sx={{ p: 0 }}>
            <Avatar alt={session?.user?.name as string} src={session?.user?.image as string} />
        </IconButton>
    )

    if (status === "authenticated") {
        // for debug
        console.log(session)
        return LoginedAvator
    } else {
        return LoginAvator
    }
};