'use client'
import { UploadButton } from '@/components/upload-button'
import { trpc } from '@/app/_trpc/client'
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { format } from 'date-fns'
import { Button } from './ui/button'
import { useState } from 'react'
export const Dashboard = () => {
  const [currentDeleteFile, setCurrentDeleteFile] = useState<string | null>(
    null,
  )
  const utils = trpc.useContext()
  const { data: files, isLoading } = trpc.getUserFiles.useQuery()
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess() {
      utils.getUserFiles.invalidate()
    },

    onMutate({ id }) {
      setCurrentDeleteFile(id)
    },

    onSettled() {
      setCurrentDeleteFile(null)
    },
  })
  return (
    <div className="mx-auto max-w-7xl md:p-10">
      <div className="flex flex-col items-start justify-between mt-8 gap-4 border-b border-b-gray-200 pb-5 sm:flex-row sm:gap-0 ">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">My Files</h1>

        <UploadButton />
      </div>

      {files && files.length !== 0 ? (
        <ul className="grid grid-cols-1 gap-6 mt-8 divide-y divide-zinc-800 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((file) => (
              <li
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                key={file.id}
              >
                <Link
                  href={`dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="w-full flex pt-6 px-6 items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />

                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <strong className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </strong>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="grid grid-cols-3 place-items-center mt-4 px-6 py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), 'MM yyyy')}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>

                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    className="w-full"
                    size={'sm'}
                    variant={'destructive'}
                  >
                    {currentDeleteFile === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 mt-16">
          <Ghost className="w-8 h-8 text-zinc-800" />

          <strong className="text-xl font-semibold">Pretty </strong>
          <span>Opps! Faça upload do seu primerio PDF</span>
        </div>
      )}
    </div>
  )
}
