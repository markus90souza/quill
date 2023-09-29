import { FC, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export const Container: FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-screen-xl px-2.5 md:px-20',
        className,
      )}
    >
      {children}
    </div>
  )
}
