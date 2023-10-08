"use client"

import React, { Suspense, useState, useRef, MutableRefObject, useEffect } from 'react'
import { Box, Fab, Modal, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Card, CardContent, CardActions, CardHeader, TextField, Chip, ButtonBase } from "@mui/material";
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

import { useRouter } from 'next/navigation'

import AuthGuard from "@/components/AuthGuard";
import SimpleGraph from '@/components/RelationGraph';
import RelationGraph from '@/components/RelationGraph';
import AppCard from '@/components/AppCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const theme = createTheme({
    palette: {
        primary: {
            main: "#003893",
        }
    },
});

interface Member {
    id: string,
    name: string,
    image: string,
}

interface TeamInternalInfo {
    id: string
    name: string,
    year: string,
    description: string,
    members: Member[],
    secret: string,
    previous: string,
    relations: TeamInternalInfo[],
    project: string,
}

interface ProjectInfo {
    id: string
    name: string,
    description: string,
    rating: {
        total: number,
        count: number,
    },
    youtube: string,
    team: string,
    icon: string,
    img: string,
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
    const [userDelete, setUserDelete] = React.useState({} as Member)

    const [teamRelationSecret, setTeamRelationSecret] = useState<string>("")
    const [projInfo, setProjInfo] = useState<ProjectInfo | null>(null)

    const router = useRouter()

    const updateProjectInfo = (projId: string) => {
        if (projId === "") {
            return
        }
        fetch(`/api/v0/projects/${projId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?.name) {
                    setProjInfo(data)
                }
                console.log(data)
            })
    }

    const updateTeamInfo = () => {
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
                console.log(data)
                if (data.detail) {
                    enqueueSnackbar(data.detail, { variant: "error" })
                    enqueueSnackbar("3秒後にメインページに戻ります", { variant: "info" })
                    setTimeout(() => router.push(`/`), 3000)
                    return
                }
                setTeamInternalInfo(data)
                console.log(data)
                if (data.project) {
                    updateProjectInfo(data.project)
                }
            })
    }

    useEffect(updateTeamInfo, [status, _session, teamId, router])

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
            enqueueSnackbar("チーム名を入力してください", { variant: "error" })
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
                enqueueSnackbar("名前を更新しました", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("名前の更新に失敗しました", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            return e.status === "ok"
        })
    }

    const submitYear = (year: string) => {
        if (year === "") {
            enqueueSnackbar("年度を入力してください", { variant: "error" })
            return
        }
        const parsed = parseFloat(year)
        if (!parsed || !(2015 <= parsed && parsed <= 2030)) {
            enqueueSnackbar("2015年から2030年を入力してください", { variant: "error" })
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
                enqueueSnackbar("年度の更新を行いました", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("年度の更新に失敗しました", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            return e.status === "ok"
        })
    }

    const submitDescription = (description: string) => {
        if (description === "") {
            enqueueSnackbar("説明を入力してください", { variant: "error" })
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
                enqueueSnackbar("チーム説明を更新しました", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("チーム説明の更新に失敗しました", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            return e.status === "ok"
        })
    }

    const deleteMember = (id: string) => {
        return fetch(`/api/v0/teams/${teamId}/members?member_id=${id}`, {
            method: 'DELETE',
            headers: {
                "X-AUTH-TOKEN": session.access_token as string,
            },
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("メンバーを削除しました", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("メンバーの削除に失敗しました", { variant: "error" })
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
                }}>保存</Button>
        }
        return <Button
            size="small"
            color="primary" variant="contained" disableElevation={true}
            onClick={() => {
                setEditable(true)
            }}>編集
        </Button>
    }

    const linkTeams = (secert: string) => {
        return fetch(`/api/v0/teams/${teamId}/relations?secret=${secert}`, {
            method: 'POST',
            headers: {
                "X-AUTH-TOKEN": session.access_token as string,
            },
        }).then((response) => {
            if (response.status === 200) {
                enqueueSnackbar("関連付けに成功しました", { variant: "success" })
                return response.json()
            } else {
                enqueueSnackbar("関連付けに失敗しました", { variant: "error" })
                return response.json()
            }
        }).then((e) => {
            console.log(e)
            if (e.status === "ok") {
                router.refresh()
            }
        })
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(function () {
                enqueueSnackbar("クリップボードにコピーしました", { variant: "success" })
            }, function (err) {
                //    do nothing
            });
    }

    const generateInviteLink = () => {
        return `https://mws2023.pfpf.dev/teams/invitation?secret=${teamInternalInfo.secret}`
    }

    const genGraphData = () => {
        let ret = teamInternalInfo.relations || []
        ret.push(teamInternalInfo)
        return ret
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
                        チームメンバの削除
                    </Typography>
                    <Typography> {userDelete.name}? </Typography>

                    <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }} justifyItems="flex-end" display="flex" sx={{
                        pt: 4, pl: 8
                    }}>
                        <Grid md={6} justifyContent="flex-end">
                            <Button sx={{ color: "#94200F" }} onClick={async () => {
                                const res = await deleteMember(userDelete.id)
                                if (res) {
                                    updateTeamInfo()
                                    handleModalClose()
                                }
                            }}
                            >削除</Button>
                        </Grid>
                        <Grid md={6} justifyContent="flex-end" >
                            <Button sx={{ color: "#555" }} onClick={() => {
                                handleModalClose()
                            }}>キャンセル</Button>
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
                    title="チーム情報"
                />
                <CardContent>
                    <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }}>
                        <Grid item xs={3} md={3}>
                            チーム名 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            {editableField(input_name, teamInternalInfo.name, isEditable)}
                        </Grid>
                        <Grid item xs={3} md={3}>
                            年度 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            {/* Year must be fixed after linked  */}
                            {editableField(input_year, teamInternalInfo.year, isEditable)}
                        </Grid>
                        <Grid item xs={3} md={3}>
                            チーム説明 :
                        </Grid>
                        <Grid item xs={3} md={9}>
                            {editableArea(input_description, teamInternalInfo.description, isEditable)}
                        </Grid>
                        <Grid item xs={3} md={3}>
                            チームシークレット :
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
                    title="チームメンバー"
                />
                <CardContent>
                    <List >
                        {teamInternalInfo.members?.map((e) => (
                            <ListItem
                                key={e.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete"
                                        onClick={() => {
                                            setUserDelete(e)
                                            handleModalOpen()
                                        }}
                                    >
                                        <LogoutIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={e.image}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={e.name}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Typography sx={{ pb: 2 }}>
                        メンバーに以下のリンクを共有し，招待してください．
                    </Typography>
                    <ButtonBase
                        sx={{ width: '100%' }}
                        onClick={() => {
                            copyToClipboard(generateInviteLink())
                        }}>
                        <Typography fontFamily='Ubuntu Mono' bgcolor={grey[300]} color={teal[500]} sx={{ padding: '8px', borderRadius: '10px', width: "100%" }}>
                            {generateInviteLink()}
                        </Typography>
                    </ButtonBase>
                </CardContent>
            </Card>
            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="プロジェクト"
                />
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {
                            projInfo !== undefined && projInfo !== null ? (
                                <AppCard
                                    id={projInfo.id} name={projInfo.name}
                                    description={projInfo.description} rating={projInfo.rating}
                                    team={projInfo.team} team_id={teamId}
                                    icon={projInfo.icon} img={projInfo.img}
                                />
                            ) : (

                                <Button
                                    sx={{
                                        bgcolor: "#00389340",
                                        ':hover': {
                                            bgcolor: "#00389360",
                                        },
                                        width: "200px",
                                        height: "200px",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap',
                                        color: '#003893',

                                    }}
                                    onClick={() => {
                                        router.push(`/teams/${teamId}/register`)
                                    }}
                                >
                                    <AddCircleOutlineIcon sx={{ fontSize: 100 }} ></AddCircleOutlineIcon>
                                </Button>
                            )
                        }
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="チームの歴史"
                />
                <CardContent>
                    <Typography sx={{ pb: 4 }}>
                        過去のチームのチームシークレットを設定することで，継承されたチームであることを表現できます
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item md={5}>
                            <TextField
                                fullWidth
                                label="チームシークレット"
                                defaultValue=""
                                onChange={(e) => {
                                    setTeamRelationSecret(e.target.value)
                                }}
                            />
                        </Grid>
                        <Grid item md={1}>
                            <ThemeProvider theme={theme}>
                                <Button variant="contained"
                                    onClick={() => {
                                        linkTeams(teamRelationSecret)
                                    }}
                                >設定</Button>
                            </ThemeProvider>
                        </Grid>
                    </Grid>
                    <RelationGraph teams={genGraphData()} />
                </CardContent>
            </Card>
        </Container>
    );
}