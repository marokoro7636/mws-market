"use client"
import {Container, Stack} from "@mui/material";
import CardCarousel from "@/components/CardCarousel";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";

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
export default function Page({ params }: { params: { appId: string } }) {
    const project: AppSummaryData = {
        id: "a",
        name: "test",
        description: "testtest",
        youtube: "test",
        team: "team",
        team_id: "b",
        rating: {
            total: 30,
            count: 10
        },
        icon: "https://placehold.jp/180x180.png",
        img: "https://placehold.jp/800x450.png"
    }

    return (
        <CardCarousel projects={[project, project, project, project, project, project, project, project, project]}/>
        // <ScreenshotCarousel imgList={["https://placehold.jp/800x450.png", "https://placehold.jp/800x450.png"]} editable={false} onDelete={() => {}}/>
    )

}