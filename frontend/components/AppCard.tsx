import React from 'react';
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Rating,
    Typography
} from "@mui/material";

interface AppCardProps {
    id: string,
    name: string,
    team: string,
    icon: string,
    description: string
    rating: {
        total: number,
        count: number
    }
}

const AppCard = ({ id, name, team, description, rating }: AppCardProps) => {
    return (
        <Card sx={{ maxWidth: 345, "border": "1px solid #0055df10", borderRadius: 4 }} elevation={0}>
            <CardActionArea href={`/apps/${id}`}>
                <CardMedia
                    component="img"
                    height="140"
                    image="https://t3.ftcdn.net/jpg/02/48/42/64/240_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {team}
                    </Typography>
                    <Rating value={rating.total / rating.count} size="small" sx={{ mt: 1 }} readOnly precision={0.25} /> ({rating.count})
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
        </Card>
    );
};

export default AppCard;