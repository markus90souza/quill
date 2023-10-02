import { ChatContainer } from '@/components/chat-container'
import { PDFViewer } from '@/components/pdf-viewer'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { FC } from 'react'

type Params = {
  fileId: string
}

type FilePageProps = {
  params: Params
}

const FilePage: FC<FilePageProps> = async ({ params: { fileId } }) => {
  const { getUser } = getKindeServerSession()

  const user = getUser()

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=${fileId}`)
  }

  const file = await db.file.findFirst({
    where: { id: fileId, user_id: user.id },
  })

  if (!file) {
    notFound()
  }

  return (
    <div className="flex flex-col flex-1 justify-between h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFViewer />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatContainer />
        </div>
      </div>
    </div>
  )
}

export default FilePage