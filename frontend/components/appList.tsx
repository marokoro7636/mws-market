import React from 'react';
import {Button, List, ListItemButton, ListItemText} from "@mui/material";

interface App {
    id: number,
    name: string
}

const AppList = () => {
    const appList: App[] = [...Array(10)].map((_, i): App => ({id: i, name: `app ${i}`}))

    return (
        <div>
            <List component="nav">
                {
                    appList.map((item) => (
                        <ListItemButton divider href={`/apps/${item.id}`}>
                            <ListItemText primary={item.name} />
                            <Button variant="contained">インストール</Button>
                        </ListItemButton>
                    ))
                }
            </List>
        </div>
    );
};

export default AppList;