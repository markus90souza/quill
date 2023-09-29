'use client'
import { UploadButton } from '@/components/upload-button'
import { trpc } from '@/app/_trpc/client'
import { Ghost } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export const Dashboard = () => {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery()
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
                ></Link>
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
