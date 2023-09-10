export default function Page({ params }: { params: { appId: string } }) {
    return <h1>App{params.appId}</h1>
}