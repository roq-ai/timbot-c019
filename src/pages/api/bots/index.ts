import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { botValidationSchema } from 'validationSchema/bots';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBots();
    case 'POST':
      return createBot();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBots() {
    const data = await prisma.bot
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'bot'));
    return res.status(200).json(data);
  }

  async function createBot() {
    await botValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.trade_history?.length > 0) {
      const create_trade_history = body.trade_history;
      body.trade_history = {
        create: create_trade_history,
      };
    } else {
      delete body.trade_history;
    }
    const data = await prisma.bot.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
