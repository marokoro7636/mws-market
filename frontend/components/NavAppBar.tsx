import React from 'react';
import {AppBar, Box, Button, Container, Link, Toolbar, Typography} from "@mui/material";

const NavAppBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h5"
                    component="a"
                    href="/"
                    sx={{
                        flexGrow: 1,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    MWS market
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default NavAppBar;