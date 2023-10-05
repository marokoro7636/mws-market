"use client"

import React, { Suspense, useState, useRef, MutableRefObject } from 'react'
import { Box, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Card, CardContent, CardActions, CardHeader, TextField, Chip } from "@mui/material";
import { grey, pink, teal } from '@mui/material/colors';

import LogoutIcon from '@mui/icons-material/Logout';

import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@mui/material/styles';

// TODO: あとでコンポーネントに分ける
import TeamInfoEditor from "@/components/TeamInfoEditor"

const theme = createTheme({
    palette: {
        primary: {
            main: "#003893",
        }
    },
});

interface TeamInternalInfo {
    id: string,
    name: string,
    year: string,
    description: string,
    team_secret: string,
    app_id: string,
}

export default function Page({ params }: { params: { teamId: string } }) {
    const teamId = params.teamId

    const teamInternalInfoMock: TeamInternalInfo = {
        id: teamId,
        name: `Team ${teamId}`,
        year: `2023`,
        description: `description ${teamId} `.repeat(50),
        team_secret: "5vxZLlInRMrR0CM5G8qG",
        app_id: "0",
    }

    const input_name = useRef<HTMLInputElement>()
    const input_description = useRef<HTMLInputElement>()
    const input_year = useRef<HTMLInputElement>()

    const [isEditable, setEditable] = useState<boolean>(false)
    const [teamInternalInfo, setTeamInternalInfo] = useState<TeamInternalInfo>(teamInternalInfoMock)

    const editableField = (inputRef: MutableRefObject<HTMLInputElement | undefined>, defaultValue: string, isEditable: boolean) => {
        if (isEditable) {
            return <TextField
                size="small"
                variant="standard"
                inputRef={inputRef}
                defaultValue={defaultValue}
            />
        }
        if (inputRef && inputRef.current) {
            return <Typography variant="body1">{inputRef.current.value}</Typography>
        }
        return <Typography variant="body1">{defaultValue}</Typography>
    }

    const editableArea = (inputRef: MutableRefObject<HTMLInputElement | undefined>, defaultValue: string, isEditable: boolean) => {
        if (isEditable) {
            return <TextField
                fullWidth multiline
                size="small"
                variant="standard"
                inputRef={inputRef}
                defaultValue={defaultValue}
            />
        }
        if (inputRef && inputRef.current) {
            return <Typography variant="body1">{inputRef.current.value}</Typography>
        }
        return <Typography variant="body1">{defaultValue}</Typography>
    }

    const editModeButton = (isEditable: boolean) => {
        if (isEditable) {
            return <Button size="small"
                color="primary" variant="contained" disableElevation={true}
                onClick={() => {
                    if (input_name.current?.value != teamInternalInfo.name) {
                        console.log("name changed")
                        // TODO: update name by API
                        setTeamInternalInfo({ ...teamInternalInfo, name: (input_name.current?.value as string) })
                    }
                    if (input_year.current?.value != teamInternalInfo.year) {
                        console.log("year changed")
                        setTeamInternalInfo({ ...teamInternalInfo, year: (input_year.current?.value as string) })
                    }
                    if (input_description.current?.value != teamInternalInfo.description) {
                        console.log("description changed")
                        setTeamInternalInfo({ ...teamInternalInfo, description: (input_description.current?.value as string) })
                    }
                    // TODO: 問題があればエラーを表示して編集状態を維持する
                    setEditable(false)
                }}>Save</Button>
        }
        return <Button
            size="small"
            color="primary" variant="contained" disableElevation={true}
            onClick={() => {
                setEditable(true)
            }}>Edit
        </Button>
    }

    // TODO: フロントで生成すべきではないが、とりあえず
    const generateInviteLinkMock = () => {
        const seed = teamInternalInfo.team_secret + teamInternalInfo.app_id
        const hash = seed // HASH書くのがだるかった
        return `https://mws2023.pfpf.dev/teams/invitation?token=${hash}`
    }

    return (
        <Container sx={{ p: 3 }}>

            <Typography variant="subtitle1">{teamInternalInfo.year}</Typography>
            <Typography variant="h3">{teamInternalInfo.name}</Typography>

            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="Team Info"
                />
                <CardContent>
                    <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }}>
                        <Grid item xs={3} md={3}>
                            Team Name :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            {editableField(input_name, teamInternalInfo.name, isEditable)}
                        </Grid>
                        <Grid item xs={3} md={3}>
                            Year:
                        </Grid>
                        <Grid item xs={3} md={9}>
                            {/* Year must be fixed after linked  */}
                            {editableField(input_year, teamInternalInfo.year, isEditable)}
                        </Grid>
                        <Grid item xs={3} md={3}>
                            Description:
                        </Grid>
                        <Grid item xs={3} md={9}>
                            {editableArea(input_description, teamInternalInfo.description, isEditable)}
                        </Grid>
                        <Grid item xs={3} md={3}>
                            Team Secret:
                        </Grid>
                        <Grid item md={9}>
                            {/* 変更しないので最初のInterfaceでOK */}
                            <Typography fontFamily='Ubuntu Mono'
                                bgcolor={grey[300]} color={pink[500]}
                                sx={{
                                    padding: '8px', borderRadius: '10px',
                                    wordBreak: "break-all"
                                }}
                            >
                                {teamInternalInfoMock.team_secret}
                            </Typography>

                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <ThemeProvider theme={theme}>
                            {editModeButton(isEditable)}
                        </ThemeProvider>
                    </Grid>
                </CardActions>
            </Card>
            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="Members"
                />
                <CardContent>
                    <List >
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete">
                                    <LogoutIcon />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar
                                // src="/public/placeholder.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary="Name1"
                            />
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete">
                                    <LogoutIcon />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar
                                // src="/public/placeholder.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary="Name2"
                            />
                        </ListItem>
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete">
                                    <LogoutIcon />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar
                                // src="/public/placeholder.jpg"
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary="Name3"
                            />
                        </ListItem>
                    </List>
                    <Typography sx={{ pb: 2 }}>
                        メンバーに以下のリンクを共有し，招待してください．
                    </Typography>
                    <Typography fontFamily='Ubuntu Mono' bgcolor={grey[300]} color={teal[500]} sx={{ padding: '8px', borderRadius: '10px' }}>
                        {generateInviteLinkMock()}
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="History"
                />
                <CardContent>
                    <Typography sx={{ pb: 4 }}>
                        過去のチームのsecretを設定することで，継承されたチームであることを表現できます(仮文)
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item md={6}>
                            <Typography align="center" variant="h5" >
                                リンク済み： Team {parseInt(teamInternalInfoMock.id) - 1}
                            </Typography>
                        </Grid>
                        <Grid item md={5}>
                            <TextField
                                fullWidth
                                disabled
                                defaultValue="cHZmydlYzXN2YdOPmFWf"
                            />
                        </Grid>
                        <Grid item md={1}>
                            <ThemeProvider theme={theme}>
                                <Button disabled variant="contained">設定</Button>
                            </ThemeProvider>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>
        </Container>
    );
}