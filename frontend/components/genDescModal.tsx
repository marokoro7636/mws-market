import React from 'react';
import { Modal } from "@mui/material";
import { Box, Typography, List, ListItem, Checkbox, Button, Grid } from "@mui/material";
import { CircularProgress } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DescriptionIcon from '@mui/icons-material/Description';
import { start } from 'repl';

const theme = createTheme({
    palette: {
        primary: {
            main: '#003893',
        },
    },
});

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const colorDesc = "#003893"
const colorYoutube = "#FF0000"
const colorGithub = "#1a7f37"

interface StartContentProps {
    youtube?: string,
    github?: string,
    description?: string,
    onClick: (youtube: string, github: string, description: string) => void,
}

const StartContent = (props: StartContentProps) => {
    const {
        youtube, description, github,
    } = props;

    const [useDesc, setUseDesc] = React.useState((description as string !== "") ? true : false)
    const [useYoutube, setUseYoutube] = React.useState((youtube as string !== "") ? true : false)
    const [useGithub, setUseGithub] = React.useState((github as string !== "") ? true : false)
    return <Box sx={modalStyle}>
        <Typography
            variant='h5'
        >
            プロジェクト説明文の自動生成
        </Typography>
        <Typography
            variant='body1'
            sx={{ pt: 2 }}
        >
            注意：実行することで既存の説明文を上書きします
        </Typography>
        <List>
            <ListItem onClick={() => {
                if (!description) return
                setUseDesc(!useDesc)
            }}>
                <Checkbox
                    checked={useDesc}
                    sx={{
                        '&.Mui-checked': {
                            color: colorDesc,
                        },
                    }}
                />
                {useDesc ?
                    <>
                        <DescriptionIcon sx={{ color: colorDesc }} />
                        <Typography variant='h6' color={colorDesc}>既存の説明文</Typography>
                    </>
                    :
                    <>
                        <DescriptionIcon />
                        <Typography variant='h6' >既存の説明文</Typography>
                    </>
                }
            </ListItem>
            <ListItem onClick={() => {
                if (!youtube) return
                setUseYoutube(!useYoutube)
            }}>
                <Checkbox
                    checked={useYoutube}
                    sx={{
                        '&.Mui-checked': {
                            color: colorYoutube,
                        },
                    }}
                />
                {useYoutube ?
                    <>
                        <YouTubeIcon sx={{ color: colorYoutube }} />
                        <Typography variant='h6' color={colorYoutube}>YouTube</Typography>
                    </>
                    :
                    <>
                        <YouTubeIcon />
                        <Typography variant='h6' >YouTube</Typography>
                    </>
                }
            </ListItem>
            <ListItem onClick={() => {
                if (!github) return
                setUseGithub(!useGithub)
            }}>
                <Checkbox
                    checked={useGithub}
                    sx={{
                        '&.Mui-checked': {
                            color: colorGithub,
                        },
                    }}
                />
                {useGithub ?
                    <>
                        <GitHubIcon sx={{ color: colorGithub }} />
                        <Typography variant='h6' color={colorGithub}>GitHub</Typography>
                    </>
                    :
                    <>
                        <GitHubIcon />
                        <Typography variant='h6' >GitHub</Typography>
                    </>
                }
            </ListItem>
        </List>
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <ThemeProvider theme={theme}>
                <Button
                    variant="contained"
                    disableElevation
                    disabled={!(useYoutube || useGithub)}
                    onClick={() => {
                        props.onClick(
                            useYoutube ? youtube as string : "",
                            useGithub ? github as string : "",
                            useDesc ? description as string : "",
                        )
                    }}
                >生成</Button>
            </ThemeProvider>
        </Box>
    </Box>
}

interface LoadingContentProps {
    secs: number,
}

const LoadingContent = ({ secs }: LoadingContentProps) => {

    return <Box sx={modalStyle}>
        <Typography
            variant='h5'
        >
            プロジェクト説明文の自動生成
        </Typography>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            m: 4,
        }}>
            <ThemeProvider theme={theme}>
                <CircularProgress
                    disableShrink
                />
            </ThemeProvider>
        </Box>
        <Typography
            variant='body1'
            align='center'
        >
            生成には約1分程度かかります
        </Typography>
        <Typography
            variant='body1'
            align='center'
            sx={{ pt: 2 }}
        >
            {secs}秒経過<br />
            生成中{'.'.repeat((secs % 5) + 1)}
        </Typography>
    </Box>
}

interface ResultContentProps {
    result: string,
    onClick: () => void,
}

const ResultContent = ({ result, onClick }: ResultContentProps) => {
    return <Box sx={modalStyle}>
        <Typography
            variant='h5'
        >
            プロジェクト説明文の自動生成
        </Typography>
        <Typography
            variant='h6'
            sx={{ pt: 2 }}
        >生成された説明文</Typography>
        <Box sx={{
            border: '1px solid #00000010',
            borderRadius: 4,
            p: 2,
            bgcolor: "#ddd"
        }}>
            <Typography
                variant='body1'
            >{result === "" ? "生成に失敗しました" : result}</Typography>
        </Box>

        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2,
        }}>
            <ThemeProvider theme={theme}>
                <Button
                    variant="contained"
                    disableElevation
                    disabled={result === ""}
                    onClick={onClick}
                >保存</Button>
            </ThemeProvider>
        </Box>
    </Box>
}

interface GenDescModalProps {
    open: boolean,
    onClose: () => void,
    onSave: (description: string) => void,
    youtube?: string,
    github?: string,
    description?: string,
    appId: string,
    access_token: string,
}

const GenDescModal: React.FC<GenDescModalProps> = (props) => {
    const { open,
        onClose, onSave,
        youtube, description, github,
        appId, access_token
    } = props;

    type GenDescModalMode = "start" | "loading" | "result"

    const [mode, setMode] = React.useState<GenDescModalMode>("start")
    const [result, setResult] = React.useState<string>("")
    const [progress, setProgress] = React.useState<number>(0)

    const generate = (youtube: string, github: string, description: string) => {
        setMode("loading")
        const timer = setInterval(() => {
            console.log(progress)
            setProgress((e) => e + 1)
        }, 1000)
        let params = new URLSearchParams()
        if (youtube !== "") {
            params.append("youtube", youtube)
        }
        if (github !== "") {
            params.append("github", github)
        }
        if (description !== "") {
            params.append("description", description)
        }
        fetch('/api/v0/projects/generate/description?' + params)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.description) {
                    setResult(data.description)
                    setMode("result")
                }
                setMode("result")
                clearInterval(timer)
            })
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                if (mode === "loading") {
                    return
                }
                onClose()
            }}
        >
            <>
                {
                    mode === "start" ?
                        <StartContent
                            youtube={youtube}
                            github={github}
                            description={description}
                            onClick={(youtube, github, description) => {
                                generate(youtube, github, description)
                            }}
                        /> : <></>
                }
                {
                    mode === "loading" ?
                        <LoadingContent secs={progress} /> : <></>
                }
                {
                    mode === "result" ?
                        <ResultContent result={result} onClick={
                            async () => {
                                onSave(result)
                                onClose()
                            }
                        } /> : <></>
                }
            </>
        </Modal>
    );
};

export default GenDescModal;