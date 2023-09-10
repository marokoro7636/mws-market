import {AppBar, Container, Toolbar, Typography} from "@mui/material";
import AppList from "@/components/appList";

export default function Home() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{flexGrow: 1}}>
                        MWS market
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <AppList/>
            </Container>
        </>
    )
}
