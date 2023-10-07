'use client'

import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Select, MenuItem, } from "@mui/material";
import AppCard from "@/components/AppCard";

import { CircularProgress } from '@mui/material';

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
        <Box sx={{ mt: 2 }}>
            <Box>
                <Grid container spacing={2}
                    columns={{ xs: 12 }}
                    sx={{ height: "2rem", m: 3 }}>
                    {/* <Grid xs={2}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"

                            inputProps={{
                                name: 'age',
                                id: 'age-native-simple',
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid xs={2}>
                        <Button variant="outlined">新規作成</Button>
                    </Grid>
                    <Grid xs={2}>
                        <Button variant="outlined">新規作成</Button>
                    </Grid>
                    <Grid xs={2}>
                        <Button variant="outlined">新規作成</Button>
                    </Grid> */}
                    {/* <Grid xs={4}>
                        読み込みサイズ
                        <RadioGroup
                            row
                            defaultValue="6"
                        >
                            <FormControlLabel value="6" control={<Radio />} label="6" />
                            <FormControlLabel value="12" control={<Radio />} label="12" />
                            <FormControlLabel value="24" control={<Radio />} label="24" />
                        </RadioGroup>
                    </Grid> */}
                </Grid>
            </Box>
            <Grid container spacing={2} rowSpacing={5}>
                {
                    data.map((item, i) => (
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