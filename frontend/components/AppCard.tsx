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
    img: string,
    icon: string,
    description: string
    rating: {
        total: number,
        count: number
    }
}
import { StableAvatar, StableImgCardMedia } from "@/components/StableImages";

const AppCard = ({ id, name, team, description, rating, icon, img }: AppCardProps) => {
    return (
        <Card sx={{ maxWidth: 345, "border": "1px solid #0055df10", borderRadius: 4 }} elevation={0}>
            <CardActionArea href={`/apps/${id}`}>
                <StableImgCardMedia
                    height="180"
                    width="180"
                    image={img}
                    fallbackImage="https://placehold.jp/4380E0/ffffff/180x180.png?text=no%20image"
                />
                <CardContent>
                    <Grid container columns={{ xs: 4 }}>
                        <Grid xs={2} sx={{ p: 1 }}>
                            <StableAvatar
                                sx={{ width: 100, height: 100 }}
                                src={icon}
                                variant='rounded'
                                fallbackSrc="https://placehold.jp/4380E0/ffffff/180x180.png?text=no%20image"
                            />
                        </Grid>
                        <Grid xs={2} sx={{ pt: 2 }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {team}
                            </Typography>
                            <Rating value={rating.total / rating.count} size="small" sx={{ mt: 1 }} readOnly precision={0.25} /> ({rating.count})
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, wordBreak: "break-all" }} height="3rem">
                        {
                            description ?
                                description.slice(0, Math.min(50, description.length)) + (description.length < 50 ? "" : "...") :
                                "説明文がありません"
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