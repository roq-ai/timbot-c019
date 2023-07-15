import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { botValidationSchema } from 'validationSchema/bots';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bot
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBotById();
    case 'PUT':
      return updateBotById();
    case 'DELETE':
      return deleteBotById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBotById() {
    const data = await prisma.bot.findFirst(convertQueryToPrismaUtil(req.query, 'bot'));
    return res.status(200).json(data);
  }

  async function updateBotById() {
    await botValidationSchema.validate(req.body);
    const data = await prisma.bot.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBotById() {
    const data = await prisma.bot.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
