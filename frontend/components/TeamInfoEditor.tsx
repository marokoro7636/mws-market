"use client"

import React, { Suspense, useState, useRef, MutableRefObject } from 'react'
import { Box, Button, Container, Grid, Rating, Stack, Typography, Card, CardContent, CardActions, CardHeader, TextField, Chip } from "@mui/material";
import { grey, pink } from '@mui/material/colors';

interface TeamInternalInfoProps {
    name: string,
    year: string,
    description: string,
    team_secret: string,
}

const TeamInfoEditor = ({ name, year, description, team_secret }: TeamInternalInfoProps) => {

    const input_name = useRef<HTMLInputElement>()
    const input_description = useRef<HTMLInputElement>()
    const input_year = useRef<HTMLInputElement>()

    const [isEditable, setEditable] = useState<boolean>(false)
    const [teamInternalInfo, setTeamInternalInfo] = useState<TeamInternalInfoProps>({
        name: name,
        year: year,
        description: description,
        team_secret: team_secret,
    })

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

    return (
        <div>
            <Card>
                <CardHeader
                    title="Team Infomation"
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            Team Name :
                        </Grid>
                        <Grid item xs={9}>
                            {editableField(input_name, teamInternalInfo.name, isEditable)}
                        </Grid>
                        <Grid item xs={3}>
                            Year:
                        </Grid>
                        <Grid item xs={9}>
                            {/* Year must be fixed after linked  */}
                            {editableField(input_year, teamInternalInfo.year, isEditable)}
                        </Grid>
                        <Grid item xs={3}>
                            Description:
                        </Grid>
                        <Grid item xs={9}>
                            {editableArea(input_description, teamInternalInfo.description, isEditable)}
                        </Grid>
                        <Grid item xs={3}>
                            Team Secret:
                        </Grid>
                        <Grid item xs={9}>
                            {/* 変更しないので最初のInterfaceでOK */}
                            <Typography component="span" fontFamily='Ubuntu Mono' bgcolor={grey[300]} color={pink[500]} sx={{ padding: '8px', borderRadius: '10px' }}>
                                {team_secret}
                            </Typography>

                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        {editModeButton(isEditable)}
                    </Grid>
                </CardActions>
            </Card>
        </div>
    );
}

export default TeamInfoEditor;