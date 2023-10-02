'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import Dropzone from 'react-dropzone'
import { Cloud, File } from 'lucide-react'

const UploadDropZone = () => {
  const [isUploading, setIsUploading] = useState<boolean>(true)
  const [isProgressUpload, setIsProgressUpload] = useState<number>(0)

  const startProgress = () => {
    setIsProgressUpload(0)

    const interval = setInterval(() => {
      setIsProgressUpload((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval)
        }

        return prevProgress + 5
      })
    }, 500)

    return interval
  }

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true)

        const progress = startProgress()

        await new Promise((resolve) => setTimeout(resolve, 1500))

        clearInterval(progress)

        setIsProgressUpload(100)
      }}
    >
      {({ acceptedFiles, getInputProps, getRootProps }) => (
        <div
          {...getRootProps}
          className="h-64 m-4 border border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center w-full h-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="w-6 h-6 text-zinc-500 mb-2" />
                <p className="text-sm text-zinc-500 mb-2">
                  <span className="font-semibold">
                    Clique para fazer o UPLOAD
                  </span>{' '}
                  ou Arraste e Solte
                </p>

                <p className="text-xs text-zinc-500">PDF (max 4MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs rounded-md flex items-center bg-white overflow-hidden outline outline-1 outline-zinc-200 divide-x divide-zinc-200 ">
                  <div className="grid place-items-center px-3 py-2 h-full">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>

                  <div className="h-full px-3 py-2 text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="max-w-xs mx-auto w-full mt-4">
                  <Progress
                    value={isProgressUpload}
                    className="w-full h-1 bg-zinc-200"
                  />
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  )
}

export const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Dialog onOpenChange={toggle} open={isOpen}>
      <DialogTrigger asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropZone />
      </DialogContent>
    </Dialog>
  )
}
