import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { privateProcedure, publicProcedure, router } from './trpc'
import { TRPCError } from '@trpc/server'
import { db } from '@/db'
import { z } from 'zod'
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()

    const user = getUser()

    if (!user || !user.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    // [status: isDone] verificar se o usuario esta na base de dados

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    })

    if (!dbUser) {
      // [status: isDone] cria o usuario  na base de dados
      const userCreate = await db.user.create({
        data: {
          id: user.id,
          email: user.email!,
        },
      })

      console.log(userCreate)
    }

    return {
      success: true,
    }
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { user_id } = ctx

    const files = await db.file.findMany({
      where: { user_id },
    })

    return files
  }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user_id } = ctx

      const file = await db.file.findFirst({
        where: { id: input.id, user_id },
      })

      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      await db.file.delete({
        where: { id: input.id },
      })

      return file
    }),
})

export type AppRouter = typeof appRouter
