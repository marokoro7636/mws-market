'use client'
import { useSession, signIn } from "next-auth/react"
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface AuthGuardProps {
    enabled: boolean
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#003893',
        },
    },
});

const AuthGuard = ({ enabled }: AuthGuardProps) => {
    const { data: session, status } = useSession()

    if (!enabled) {
        return (
            <div />
        )
    }

    if (status === "loading") {
        return <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            <ThemeProvider theme={theme}>
                <CircularProgress
                    size={75}
                    disableShrink
                />
            </ThemeProvider>
        </Box>
    }

    if (status === "authenticated") {
        return (
            <div />
        );
    } else {
        signIn()
    }
};

export default AuthGuard;
