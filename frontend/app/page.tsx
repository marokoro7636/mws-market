import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import AppList from "@/components/appList";

export default function Home() {
    return (
        <Container sx={{
            height: "100%"
        }}>
            <AppList />
        </Container>
    )
}
