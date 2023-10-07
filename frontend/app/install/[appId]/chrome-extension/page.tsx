'use client'

import React from "react"
import {Container, Stack, Typography} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

export default function Page({ params }: { params: { appId: string } }) {
    return (
        <Container>
            <Typography variant="h3" mt={3}>利用方法</Typography>
            <Stack spacing={5} mt={5}>
                <Stack spacing={1} sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LinkIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">アクセス先</Typography>
                    </Stack>
                    <Typography variant="body1">リンク先にあるファイルをダウンロードしてください。</Typography>
                </Stack>
                <Stack spacing={1} sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <InstallDesktopIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">インストール手順</Typography>
                    </Stack>
                    <Typography variant="body1"> 1. 上記のダウンロード先から必要なファイルをダウンロードしてください。</Typography>
                    <Typography variant="body1"> 2. ダウンロードした圧縮ファイルを展開してください。</Typography>
                    <Typography variant="body1"> 3. 展開したフォルダの中身を確認し、「manifest.json」が含まれるフォルダを確認してください。</Typography>
                    <Typography variant="body1"> 4. Google Chromeの右上にあるメニューボタン (︙)から、「拡張機能」 → 「拡張機能を管理」を押してください。</Typography>
                    <Typography variant="body1"> 5. 拡張機能の管理画面で「パッケージ化されていない拡張機能を読み込む」を押してください。</Typography>
                    <Typography variant="body1"> 6. ファイル選択画面が表示されたら、先ほど確認した「manifest.json」が含まれるフォルダを選択してください。</Typography>
                </Stack>
                <Stack spacing={1} bgcolor="#FFCF5F" sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <WarningIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">リスク</Typography>
                    </Stack>
                    <Typography variant="body1">拡張機能のインストール時に表示される権限をご確認ください。</Typography>
                    <Typography variant="body1">インストール後の場合は、以下の手順でご確認ください。</Typography>
                    <Typography variant="body1">Google Chromeの右上にあるメニューボタン (︙)から、「拡張機能」 → 「拡張機能を管理」を押してください。</Typography>
                    <Typography variant="body1">拡張機能の管理画面で本拡張機能の「詳細」ボタンを押し、「権限」を確認してください。</Typography>
                </Stack>
                <Stack spacing={1} bgcolor="#b3bac1" sx={{padding: 4, borderRadius: 5}}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <InfoIcon fontSize="inherit" sx={{fontSize: 48}}/>
                        <Typography variant="h4">詳細説明</Typography>

                    </Stack>
                </Stack>

            </Stack>


        </Container>
    )
}