"use client"
import {Button, Container, Stack, TextField, Typography} from "@mui/material";
import {MuiFileInput} from "mui-file-input";
import {Controller, SubmitHandler, useForm} from "react-hook-form";

interface Inputs {
    name: string,
    description: string,
    youtube: string,
    icon: File,
    screenshots: File[]
}
export default function Register() {
    const {control, handleSubmit} = useForm<Inputs>({
        defaultValues: {
            name: "",
            description: "",
            youtube: "",
            icon: undefined,
            screenshots: [undefined, undefined, undefined]
        }
    })

    const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
        try {
            alert(JSON.stringify(inputs))
        } catch (e) {
            alert(e)
        }
    }

    return (
        <>
            <Container sx={{mt: 3}}>
                <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
                    <Typography variant="h3">アプリの登録</Typography>
                    <Controller
                        control={control}
                        rules={{
                            required: "入力してください"
                        }}
                        render={({field, fieldState: {error}}) => {
                            // console.log(!!errors)
                            return (
                                <TextField
                                    label="アプリ名"
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message as string}
                                />
                            )}}
                        name="name"
                    />
                    <Controller
                        control={control}
                        rules={{
                            required: "入力してください"
                        }}
                        render={({field, fieldState: {error}}) => (
                                <TextField
                                    label="アプリの説明"
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message as string}
                                />
                            )}
                        name="description"
                    />
                    <Controller
                        control={control}
                        rules={{
                            required: "入力してください"
                        }}
                        render={({field, fieldState: {error}}) => (
                                <TextField
                                    label="YouTubeリンク"
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message as string}
                                />
                            )}
                        name="youtube"
                    />
                    <Typography variant="h5">アプリアイコン</Typography>
                    <Controller
                        control={control}
                        rules={{
                            required: "入力してください"
                        }}
                        render={({field, fieldState: {error}}) => (
                                <MuiFileInput
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message as string}
                                />
                            )}
                        name="icon"
                    />

                    <Typography variant="h5">スクリーンショット(3枚)</Typography>
                    <Stack direction="row" spacing={2}>
                        <Controller
                            control={control}
                            rules={{
                                required: "入力してください"
                            }}
                            render={({field, fieldState: {error}}) => (
                                <MuiFileInput
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message as string}
                                />
                            )}
                            name="screenshots.0"
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: "入力してください"
                            }}
                            render={({field, fieldState: {error}}) => (
                                <MuiFileInput
                                    {...field}
                                    error={!!error}
                                    helperText={error?.message as string}
                                />
                            )}
                            name="screenshots.1"
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: "入力してください"
                            }}
                            render={({field, fieldState: {error}}) => (
                                    <MuiFileInput
                                        {...field}
                                        error={!!error}
                                        helperText={error?.message as string}
                                    />
                                )}
                            name="screenshots.2"
                        />
                    </Stack>
                    <Button type="submit" variant="contained">登録</Button>
                </Stack>

            </Container>
        </>
    )
}