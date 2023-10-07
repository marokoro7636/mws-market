import React from 'react';
import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardActions,
    Grid,
    CardContent,
    CardMedia,
    Rating,
    Typography
} from "@mui/material";

interface AppCardProps {
    id: string,
    name: string,
    team: string,
    team_id: string,
    img: string,
    icon: string,
    description: string
    rating: {
        total: number,
        count: number
    }
}

import { StableAvatar, StableImgCardMedia } from "@/components/StableImages";

const AppCard = ({ id, name, team, description, rating, icon, img, team_id }: AppCardProps) => {
    return (
        <Card sx={{ maxWidth: 345, "border": "1px solid #0055df10", borderRadius: 4 }} elevation={0}>
            <CardActionArea href={`/apps/${id}`}>
                <StableImgCardMedia
                    height={225}
                    width={400}
                    image={img}
                    hash={id}
                />
                <CardContent>
                    <Grid container columns={{ xs: 4 }}>
                        <Grid xs={2} sx={{ p: 1 }}>
                            <StableAvatar
                                sx={{ width: 100, height: 100, bgcolor: "#2222" }}
                                src={icon}
                                variant='rounded'
                                hash={team_id}
                            />
                        </Grid>
                        <Grid xs={2} sx={{ pt: 2 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {team}
                            </Typography>
                            <Rating value={rating?.total / rating?.count} size="small" sx={{ mt: 1 }} readOnly precision={0.25} /> ({rating?.count})
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" sx={{
                        wordBreak: "break-all",
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4rem',
                    }} minHeight="calc( 1.4rem * 3 )" >
                        {
                            description ?? "説明文がありません"
                        }
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/* <CardActions>
                <Button variant="contained" fullWidth={true}>インストール</Button>
            </CardActions> */}
        </Card >
    );
};

export default AppCard;