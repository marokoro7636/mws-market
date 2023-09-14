import { Suspense } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { FC } from 'react'

interface ViewerProps {
    markdown: string
}

const Viewer: FC<ViewerProps> = ({ markdown }) => {
    return <MDXRemote
        source={markdown}
    />
}

export default Viewer