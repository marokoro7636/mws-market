"use client"

import React, { Suspense, useState, useRef, MutableRefObject, useEffect } from 'react'
import { Box, Fab, Modal, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Card, CardContent, CardActions, CardHeader, TextField, Chip } from "@mui/material";
import { grey, pink, teal } from '@mui/material/colors';

import { Session } from "next-auth"
import { useSession } from "next-auth/react"

import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import LogoutIcon from '@mui/icons-material/Logout';

import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@mui/material/styles';

// TODO: あとでコンポーネントに分ける
import TeamInfoEditor from "@/components/TeamInfoEditor"

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import AuthGuard from "@/components/AuthGuard";

const theme = createTheme({
    palette: {
        primary: {
            main: "#003893",
        }
    },
});

interface TeamInternalInfo {
    name: string,
    year: string,
    description: string,
    members: string[],
    secret: string,
    previous: string,
}

export default function Page({ params }: { params: { teamId: string } }) {
    const { data: _session, status } = useSession()

    const teamId = params.teamId

    const input_name = useRef<HTMLInputElement>()
    const input_description = useRef<HTMLInputElement>()
    const input_year = useRef<HTMLInputElement>()

    const [isEditable, setEditable] = useState<boolean>(false)
    const [teamInternalInfo, setTeamInternalInfo] = useState<TeamInternalInfo>({} as TeamInternalInfo)

    const [modalOpen, setModalOpen] = React.useState(false)

    useEffect(() => {
        if (status !== "authenticated") {
            return
        }
        const session = _session as Session
        fetch(`/api/v0/teams/${teamId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": session?.access_token as string,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTeamInternalInfo(data)
            })
    }, [status])

    if (status !== "authenticated") {
        return <AuthGuard enabled={true} />
    }
    const session = _session as Session

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

    const submitName = (name: string) => {
        if (name === "") {
            enqueueSnackbar("Team name is required", { variant: "error" })
            return
        }
        const query = encodeURI(name)
        return fetch(`/api/v0/teams/${teamId}/name?name=${query}`, {
            method: 'POST',
            headers: {
                "X-AUTH-TOKEN": session.access_token as string,
            },
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("Name updated successfully", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("Failed to update name", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            return e.status === "ok"
        })
    }

    const submitYear = (year: string) => {
        if (year === "") {
            enqueueSnackbar("Year is required", { variant: "error" })
            return
        }
        const parsed = parseFloat(year)
        if (!parsed || !(2015 <= parsed && parsed <= 2030)) {
            enqueueSnackbar("Year should be between 2015 and 2030", { variant: "error" })
            return null
        }
        const query = encodeURI(year)
        return fetch(`/api/v0/teams/${teamId}/year?year=${query}`, {
            method: 'POST',
            headers: {
                "X-AUTH-TOKEN": session.access_token as string,
            },
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("Year updated successfully", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("Failed to update year", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            return e.status === "ok"
        })
    }

    const submitDescription = (description: string) => {
        if (description === "") {
            enqueueSnackbar("Description is required", { variant: "error" })
            return
        }
        const query = encodeURI(description)
        return fetch(`/api/v0/teams/${teamId}/description?description=${query}`, {
            method: 'POST',
            headers: {
                "X-AUTH-TOKEN": session.access_token as string,
            },
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("Description updated successfully", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("Failed to update description", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            return e.status === "ok"
        })
    }

    const deleteTeam = () =>{
        return fetch(`/api/v0/teams/${teamId}`, {
            method: 'DELETE',
            headers: {
                "X-AUTH-TOKEN": session.access_token as string,
            },
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("Team deleted successfully", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("Failed to delete team", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            return e.status === "ok"
        })
    }

    const editModeButton = (isEditable: boolean) => {
        if (isEditable) {
            return <Button size="small"
                color="primary" variant="contained" disableElevation={true}
                onClick={async () => {
                    if (input_name.current?.value != teamInternalInfo.name) {
                        console.log("name changed")
                        const res = await submitName(input_name.current?.value as string)
                        if (res) {
                            setTeamInternalInfo({ ...teamInternalInfo, name: (input_name.current?.value as string) })
                        }
                    }
                    if (input_year.current?.value != teamInternalInfo.year) {
                        console.log("year changed")
                        const res = await submitYear(input_year.current?.value as string)
                        if (res) {
                            setTeamInternalInfo({ ...teamInternalInfo, year: (input_year.current?.value as string) })
                        }
                    }
                    if (input_description.current?.value != teamInternalInfo.description) {
                        console.log("description changed")
                        const res = await submitDescription(input_description.current?.value as string)
                        if (res) {
                            setTeamInternalInfo({ ...teamInternalInfo, description: (input_description.current?.value as string) })
                        }
                    }
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

    const generateInviteLinkMock = () => {
        return `https://mws2023.pfpf.dev/teams/invitation?secret=${teamInternalInfo.secret}`
    }

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Container sx={{ p: 3 }}>

            <SnackbarProvider />

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* TODO: モーダルが汚い */}
                <Box sx={modalStyle}>
                    <Typography
                        variant='h6'
                        color={"#94200F"}
                    >
                        Delete Team
                    </Typography>
                    <Typography>Are you sure to delete this team?</Typography>

                    <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }} justifyItems="flex-end" display="flex" sx={{
                        pt: 4, pl: 8
                    }}>
                        <Grid md={6} justifyContent="flex-end">
                            <Button sx={{ color: "#94200F" }} onClick={async () => {
                                // const res = await deleteTeam()
                                // if (res) {
                                //     router.push("/mypage")
                                // }
                            }}
                            >Delete</Button>
                        </Grid>
                        <Grid md={6} justifyContent="flex-end" >
                            <Button sx={{ color: "#555" }} onClick={() => {
                                handleModalClose()
                            }}>Calcel</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            {/* <Fab sx={{ float: 'right', boxShadow: 'none', color: "#94200F", bgcolor: "#fff0", border: "solid 1px #94200F" }}
                onClick={() => {
                    handleModalOpen()
                }}
            >
                <DeleteForeverIcon />
            </Fab> */}
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
                                {teamInternalInfo.secret}
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
                                リンク済み： {teamInternalInfo.previous}
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