import React from 'react';
import AliceCarousel from "react-alice-carousel";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Grid,
    IconButton,
    Rating,
    Stack,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AppCard from "@/components/AppCard";
import {StableAvatar, StableImgCardMedia} from "@/components/StableImages";
import App from "next/app";

type CardCarouselProps = {
    projects: AppSummaryData[]
}

type AppSummaryData = {
    id: string,
    name: string,
    description: string,
    youtube: string,
    team: string
    team_id: string
    rating: {
        total: number,
        count: number
    }
    icon: string,
    img: string
}
const CardCarousel = ({projects}: CardCarouselProps) => {
    return (
        <Box>
            <Stack direction="row" spacing={5} sx={{overflowX: "scroll", maxWidth: 800}}>
                {
                    projects.map((item) => {
                        const {id, name, team, description, rating, icon, img, team_id} = item
                        return (
                            <Card sx={{width: 200, "border": "1px solid #0055df10", borderRadius: 4}} elevation={0}>
                                <CardActionArea href={`/apps/${id}`}>
                                    <StableImgCardMedia
                                        height={200 * 9 / 16}
                                        width={200}
                                        image={img}
                                        hash={id}
                                    />
                                    <CardContent>
                                        <Grid container columns={{xs: 4}}>
                                            <Grid xs={2} sx={{p: 1}}>
                                                <StableAvatar
                                                    sx={{width: 60, height: 60, bgcolor: "#2222"}}
                                                    src={icon}
                                                    variant='rounded'
                                                    hash={team_id}
                                                />
                                            </Grid>
                                            <Grid xs={2} sx={{pt: 2}}>
                                                <Typography gutterBottom variant="h5" content="div" sx={{
                                                    wordBreak: "break-all",
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: '2rem',
                                                }} minHeight="calc( 2rem * 2 )">
                                                    {name}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    wordBreak: "break-all",
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}>
                                                    {team}
                                                </Typography>
                                                <Rating value={rating?.total / rating?.count} size="small" sx={{mt: 1}} readOnly
                                                        precision={0.25}/> ({rating?.count})
                                            </Grid>
                                        </Grid>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            wordBreak: "break-all",
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: '1.4rem',
                                        }} minHeight="calc( 1.4rem * 3 )">
                                            {
                                                description ?? "説明文がありません"
                                            }
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                {/* <CardActions>
                <Button variant="contained" fullWidth={true}>インストール</Button>
            </CardActions> */}
                            </Card>
                        )
                    })
                };
            </Stack>
        </Box>
    )
}
;

export default CardCarousel;