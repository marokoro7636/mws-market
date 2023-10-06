'use client'

import React, { useEffect, useState } from 'react';
import { Box, Grid } from "@mui/material";
import AppCard from "@/components/AppCard";

import { CircularProgress } from '@mui/material';

type AppSummaryData = {
    id: string,
    name: string,
    description: string,
    youtube: string,
    team: string
    rating: {
        total: number,
        count: number
    }
}

const AppList = () => {
    // TODO: 無限スクロール
    // https://qiita.com/masasami/items/8a9ff0cabcaa2ce54aee

    const [data, setData] = useState<AppSummaryData[] | null>(null)

    useEffect(() => {
        fetch('/api/v0/projects/')
            .then((response) => response.json())
            .then((data) => setData(data))
    }, [])

    if (data === null) {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </div>
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={2} rowSpacing={5}>
                {
                    data.map((item, i) => (
                        <Grid item xs={4} key={i}>
                            <AppCard id={item.id} name={item.name} team={item.team} description={item.description} rating={item.rating} />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
};

export default AppList;