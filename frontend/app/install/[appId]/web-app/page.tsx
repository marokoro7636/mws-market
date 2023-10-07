'use client'

import React, {useEffect, useState} from "react"
import {Container, Stack, Typography} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

type AppInfoData = {
    id: string,
    name: string,
    team: string,
    short_description: string,
    description: string,
    youtube: string,
    own: boolean,
    details: {
        img_screenshot: { id: string, path: string }[],
        required_spec: {
            item: string,
            required: string
        }[],
        install: {
            id: string,
            method: string,
            info: string,
            additional: string
        }[],
        forJob: string
    },
    review: {
        id: string,
        user: string,
        title: string,
        content: string,
        rating: number
    }[],
    rating: {
        total: number,
        count: number
    }
    icon: string,
    img: string,
    previous: AppSummaryData[]
}

type AppSummaryData = {
    id: string,
    name: string,
    description: string,
    youtube: string,
    team: string
    team_id: string
    rating: {
        total: number,
        count: number
    }
    icon: string,
    img: string
}

export default function Page({ params }: { params: { appId: string } }) {
    const appId = params.appId
    const [data, setData] = useState<AppInfoData | null>(null)

    useEffect(() => {
        fetch(`/api/v0/projects/${appId}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data)
            })
    }, [appId])

    return (
        <Container>
            <Typography variant="h3" mt={3}>利用方法</Typography>
            <Stack spacing={5} mt={5}>
                <Stack spacing={1} sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LinkIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">アクセス先</Typography>
                    </Stack>
                    <Typography component="a" href={data?.details.install[0].info}></Typography>
                    <Typography variant="body1">本リンク先はWebアプリです。</Typography>
                </Stack>
                <Stack spacing={1} sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <InstallDesktopIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">インストール手順</Typography>
                    </Stack>
                    <Typography variant="body1">上記のアクセス先リンクをクリックすることで、本ツールを利用できます。</Typography>
                    <Typography variant="body1">ツールの使用方法は、詳細説明をご確認ください。</Typography>
                </Stack>
                <Stack spacing={1} bgcolor="#FFCF5F" sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <WarningIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">リスク</Typography>
                    </Stack>
                    <Typography variant="body1">本ツールはトラッキング目的でユーザデータを収集する場合があります。</Typography>
                </Stack>
                <Stack spacing={1} bgcolor="#b3bac1" sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <InfoIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">詳細説明</Typography>
                        <Typography variant="body1">{data?.details.install[0].additional}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    )
}