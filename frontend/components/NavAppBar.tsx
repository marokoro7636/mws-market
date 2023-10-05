'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';


import { MypageButton } from './MypageButton';

const appName = "MWS Market"

function NavAppBar() {
    const appBarStyle = {
        color: "#003893",
        backgroundColor: "#0055df10",
        backdropFilter: "blur(8px)"
    }
    return (
        <AppBar
            position="sticky"
            elevation={0}
            style={appBarStyle}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* TODO: icon HERE */}
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'Gemunu Libre',
                            fontSize: '2rem',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {appName}
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

                    </Box>

                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            fontFamily: 'Gemunu Libre',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {appName}
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <MypageButton />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavAppBar;