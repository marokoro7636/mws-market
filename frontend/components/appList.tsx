import React from 'react';
import {Grid} from "@mui/material";
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
        <div style={{marginTop: "20px"}}>
            <Grid container spacing={2} rowSpacing={5}>
                {
                    appListData.map((item) => (
                        <Grid item xs={4}>
                            <AppCard id={item.id} name={item.name} team={item.team} description={item.description}/>
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    );
};

export default AppList;