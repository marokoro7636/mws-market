import React from 'react';
import {Box, Grid} from "@mui/material";
import AppCard from "@/components/AppCard";

interface App {
    id: string,
    name: string,
    description: string,
    youtube: string,
    team: string
}

const AppList = () => {
    const appListData: App[] = [...Array(10)].map((_, i): App => (
        {id: i.toString(), name: `app ${i}`, description: `description ${i}`, youtube: `youtube ${i}`, team: "team"})
    )

    return (
        <Box sx={{mt: 3}}>
            <Grid container spacing={2} rowSpacing={5}>
                {
                    appListData.map((item, i) => (
                        <Grid item xs={4} key={i}>
                            <AppCard id={item.id} name={item.name} team={item.team} description={item.description}/>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
};

export default AppList;