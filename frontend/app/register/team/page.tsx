"use client"

import React, { Suspense, useState, useRef, MutableRefObject } from 'react'
import { Box, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Card, CardContent, CardActions, CardHeader, TextField, Chip, FormControl } from "@mui/material";
import { grey, pink, teal } from '@mui/material/colors';

import LogoutIcon from '@mui/icons-material/Logout';

// TODO: あとでコンポーネントに分ける
import TeamInfoEditor from "@/components/TeamInfoEditor"

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
            return <Button size="small" onClick={() => {
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
        return <Button size="small" onClick={() => {
            setEditable(true)
        }}>Edit</Button>
    }

    // TODO: フロントで生成すべきではないが、とりあえず
    const generateInviteLinkMock = () => {
        const seed = teamInternalInfo.team_secret + teamInternalInfo.app_id
        const hash = seed // HASH書くのがだるかった
        return `https://mws2023.pfpf.dev/teams/invitation?token=${hash}`
    }

    return (
        <Container sx={{ p: 3 }}>

            <Typography variant="h3">Register New Team</Typography>

            <Card sx={{ mt: 5, p: 3, "border": "1px solid #0055df50", }} elevation={0}>
                <CardHeader
                    title="Team Info"
                />
                <CardContent>
                    <FormControl>
                        <Grid container spacing={2} columns={{ xs: 3, sm: 8, md: 12 }}>
                            <Grid item xs={3} md={3}>
                                Team Name :
                            </Grid>
                            <Grid item xs={3} md={9}>
                                <TextField size="small"
                                    variant="standard">
                                </TextField>
                            </Grid>
                            <Grid item xs={3} md={3}>
                                Year:
                            </Grid>
                            <Grid item xs={3} md={9}>
                                <TextField size="small"
                                    variant="standard">
                                </TextField>
                            </Grid>
                            <Grid item xs={3} md={3}>
                                Description:
                            </Grid>
                            <Grid item xs={3} md={9}>
                                <TextField size="small"
                                    multiline fullWidth
                                    variant="standard">
                                </TextField>
                            </Grid>
                        </Grid>
                    </FormControl>

                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        {editModeButton(isEditable)}
                    </Grid>
                </CardActions>
            </Card>
        </Container>
    );
}