import { Card, CardContent, CardHeader } from "@mui/material"

type Props = {
    title: string;
    children: React.ReactNode;
}


export const SectionCard = ({ title, children }: Props) => {
    return (
        <Card sx={{ mb:2 }}>
            <CardHeader title={title}/>
            <CardContent>{children}</CardContent>
        </Card>
    )
}