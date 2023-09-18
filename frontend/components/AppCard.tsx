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
    description: string
}

const AppCard = ({ id, name, team, description }: AppCardProps) => {
    return (
        <div>
            <Card sx={{ maxWidth: 345 }}>
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
                        <Rating name="read-only" value={3} size="small" sx={{mt: 1}}/>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button variant="contained" fullWidth={true}>インストール</Button>
                </CardActions>
            </Card>
        </div>
    );
};

export default AppCard;