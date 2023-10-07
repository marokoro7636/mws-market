'use client'

import React, { useEffect, useState } from 'react';
import { Box, Select, MenuItem, Typography, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppCard from "@/components/AppCard";

import { CircularProgress } from '@mui/material';
import ChipButton from './chipButton';
import { List, ListItem } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#003893',
        },
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
    year: number
}

class BitSet<T> {
    private original: Set<T>;
    private bits: Set<T>;

    constructor(init: Set<T> = new Set()) {
        this.original = init;
        this.bits = new Set();
    }

    set(x: T): Set<T> {
        this.bits.add(x)
        return new Set(this.bits)
    }

    reset(x: T): Set<T> {
        this.bits.delete(x)
        return new Set(this.bits)
    }

    get(): Set<T> {
        return new Set(this.bits)
    }

    flush(mode: boolean): Set<T> {
        if (mode) {
            this.bits = new Set(this.original)
        } else {
            this.bits = new Set()
        }
        console.log(this, new Set(this.bits))
        return new Set(this.bits)
    }

    has(x: T): boolean {
        return this.bits.has(x)
    }

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

    useEffect(() => {
        fetch('/api/v0/projects/?limit=100')
            .then((response) => response.json())
            .then((data) => {
                setData(data)
                if (!data) {
                    return
                }
                const years = new Set<number>(data.map((item: AppSummaryData) => item.year))
                setYears(years)
                setSelectedYear(new Set(deepCopy(Array.from(years))))
            })
    }, [])

    const updateView = () => {
        let selected = data
        if (selected === null) {
            return
        }
        if (selectedYear !== null) {
            selected = selected.filter((item) => selectedYear.has(item.year))
        }
        setViewData(selected)
    }

    useEffect(() => {
        updateView()
    }, [selectedYear, data])

    if (data === null) {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </div>
    }

    const listStyle = { display: 'flex', flexWrap: 'wrap', width: '100%' }
    const listItemStyle = { width: 'auto', ml: 1 }

    return (
        <Box sx={{ mt: 2 }}>
            <ThemeProvider theme={theme}>
                <List sx={listStyle}>
                    {Array.from(years).sort().map((item) => {
                        console.log(years, selectedYear)
                        return <ListItem sx={listItemStyle}>
                            <ChipButton defaultSelected={true} label={`${item}年`} onChange={(e) => {
                                if (e) {
                                    selectedYear.add(item)
                                    setSelectedYear(new Set(selectedYear))
                                } else {
                                    selectedYear.delete(item)
                                    setSelectedYear(new Set(selectedYear))
                                }
                                updateView()
                            }} />
                        </ListItem>
                    })}
                </List>
            </ThemeProvider>
            <Grid container spacing={2} rowSpacing={5}>
                {
                    viewData?.map((item, i) => (
                        <Grid item xs={4} key={i}>
                            <AppCard id={item.id} name={item.name} team={item.team} description={item.description} rating={item.rating} icon={item.icon} img={item.img} team_id={item.team_id} />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
};

export default AppList;