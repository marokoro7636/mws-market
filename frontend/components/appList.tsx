'use client'

import React, { useEffect, useState } from 'react';
import { Box, Select, MenuItem, Typography, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppCard from "@/components/AppCard";

import { CircularProgress } from '@mui/material';
import ChipButton from './chipButton';
import { List, ListItem } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { json } from 'stream/consumers';

import Button from "@mui/material/Button"


const theme = createTheme({
    palette: {
        primary: {
            main: '#003893',
        },
        secondary: {
            main: '#888',
        }
    },
});

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
    img: string,
    year: number,
    method: string,
    relations: string[],
}

const deepCopy = (obj: any) => {
    return JSON.parse(JSON.stringify(obj))
}

const AppList = () => {
    // TODO: 無限スクロール
    // https://qiita.com/masasami/items/8a9ff0cabcaa2ce54aee

    const [data, setData] = useState<AppSummaryData[] | null>(null)
    const [viewData, setViewData] = useState<AppSummaryData[] | null>(null)
    const [selectedYear, setSelectedYear] = useState<Set<number>>(new Set())
    const [years, setYears] = useState<Set<number>>(new Set())

    const [selectedMethod, setSelectedMethod] = useState<Set<string>>(new Set())
    const [methods, setMethods] = useState<Set<string>>(new Set())

    const [modeTeam, setModeTeam] = useState<boolean>(false)
    const [selectedTeam, setSelectedTeam] = useState<Set<string>>(new Set())
    const [teams, setTeams] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetch('/api/v0/projects/?limit=100')
            .then((response) => response.json())
            .then((data) => {
                data = data.map((e: AppSummaryData) => ({
                    ...e,
                    method: e.method ? e.method : "未設定",
                }))
                setData(data)
                if (!data) {
                    return
                }
                const years = new Set<number>(data.map((item: AppSummaryData) => item.year))
                setYears(years)
                setSelectedYear(new Set(deepCopy(Array.from(years))))
                const methods = new Set<string>(data.map((item: AppSummaryData) => item.method))
                setMethods(methods)
                setSelectedMethod(new Set(deepCopy(Array.from(methods))))
                const teams = data.reduce((acc: Set<string>, cur: AppSummaryData) => {
                    cur.relations.forEach((item) => acc.add(item))
                    return acc
                }, new Set())
                setTeams(teams)
            })
    }, [])

    // const updateView = () => {
    //     let selected = data
    //     if (selected === null) {
    //         return
    //     }
    //     if (selectedYear !== null) {
    //         selected = selected.filter((item) => selectedYear.has(item.year))
    //     }
    //     setViewData(selected)
    // }

    useEffect(() => {
        let selected = data
        if (selected === null) {
            return
        }
        selected = selected.filter((item) => selectedYear.has(item.year))
        selected = selected.filter((item) => selectedMethod.has(item.method))
        if (modeTeam) {
            selected = selected.filter((item) => selectedTeam.has(item.relations[0]))
        }
        setViewData(selected)
    }, [data, selectedYear, selectedMethod, selectedTeam, modeTeam])

    const flipTeams = (team: string) => {
        const relations = data?.find((item) => item.relations.includes(team))?.relations
        if (selectedTeam.has(team)) {
            setSelectedTeam((e) => {
                relations?.forEach((item) => e.delete(item))
                return new Set(e)
            })
        } else {
            setSelectedTeam((e) => {
                relations?.forEach((item) => e.add(item))
                return new Set(e)
            })
        }
        console.log(selectedTeam)
    }

    if (data === null) {
        return <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            <ThemeProvider theme={theme}>
                <CircularProgress
                    size={75}
                    disableShrink
                />
            </ThemeProvider>
        </Box>
    }

    const listStyle = { display: 'flex', flexWrap: 'wrap', width: '100%' }
    const listItemStyle = { width: 'auto', ml: 1 }

    return (
        <Box sx={{
            px: 4
        }}>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    pb: 2,
                    mb: 2,
                    border: "1px solid #003893",
                    borderRadius: "3px"
                }}>
                    <Typography sx={{ px: 2, pt: 2 }}>
                        年度と種類ごとの絞り込み
                    </Typography>
                    <List sx={listStyle}>
                        {Array.from(years).sort().map((item) => {
                            return <ListItem sx={listItemStyle} key={item}>
                                <ChipButton defaultSelected={true} label={`${item}年`} onChange={(e) => {
                                    if (e) {
                                        setSelectedYear((e) => {
                                            e.add(item)
                                            const next = new Set(e)
                                            e.clear()
                                            return next
                                        })
                                    } else {
                                        setSelectedYear((e) => {
                                            e.delete(item)
                                            const next = new Set(e)
                                            e.clear()
                                            return next
                                        })
                                    }
                                    // updateView()
                                }} />
                            </ListItem>
                        })}
                    </List>
                    <List sx={listStyle}>
                        {Array.from(methods).sort().map((item) => {
                            return <ListItem sx={listItemStyle} key={item}>
                                <ChipButton defaultSelected={true} label={`${item}`} onChange={(e) => {
                                    if (e) {
                                        setSelectedMethod((e) => {
                                            e.add(item)
                                            const next = new Set(e)
                                            e.clear()
                                            return next
                                        })
                                    } else {
                                        setSelectedMethod((e) => {
                                            e.delete(item)
                                            const next = new Set(e)
                                            e.clear()
                                            return next
                                        })
                                    }
                                    // updateView()
                                }} />
                            </ListItem>
                        })}
                    </List>
                </Box>

                <Accordion
                    expanded={modeTeam}
                    onChange={() => {
                        setModeTeam(!modeTeam)
                    }}
                    elevation={0}
                    sx={{
                        my: 2,
                        border: "1px solid #003893",
                        borderRadius: "3px"
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>チームでの絞り込み</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List sx={listStyle}>
                            {Array.from(teams).sort().map((item) => {
                                const selected = selectedTeam.has(item)
                                return <ListItem sx={listItemStyle} key={item}>
                                    <Button
                                        variant={selected ? "contained" : "outlined"}
                                        color={selected ? "primary" : "secondary"}
                                        disableElevation
                                        size="small" sx={{
                                            borderRadius: "15px",
                                        }}
                                        onClick={() => {
                                            flipTeams(item)
                                        }}>{item}</Button>
                                </ListItem>
                            })}
                        </List>
                    </AccordionDetails>
                </Accordion>

            </ThemeProvider>
            <Grid container spacing={2} rowSpacing={5}>
                {
                    viewData?.map((item, i) => (
                        <Grid item xs={4} key={i} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <AppCard id={item.id} name={item.name} team={item.team} description={item.description} rating={item.rating} icon={item.icon} img={item.img} team_id={item.team_id} />
                        </Grid>
                    ))
                }
            </Grid>
        </Box >
    );
};

export default AppList;