import Viewer from '@/components/MdViewer'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
const Editor = dynamic(() => import('@/components/MdEdtior'), { ssr: false })

let markdown = `
# Hello world!
Check the EditorComponent.tsx file for the code .
`

const save = (md:string) => { markdown = md }

// TODO 状態管理方法 ←Zustandが良さそう

export default function Page({ params }: { params: { appId: string } }) {
    return <div>
        <Suspense fallback={null}>
            <Editor markdown={markdown} />
            <Viewer markdown={markdown} />

        </Suspense>
    </div>
}