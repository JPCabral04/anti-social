import { AppDataSource } from '../data-source';
import { Incentive } from '../entities/Incentive';
import { Activity } from '../entities/Activity';
import { User } from '../entities/User';
import { CreateIncentiveDto } from '../schemas/incentiveSchema';

const incentiveRepo = AppDataSource.getRepository(Incentive);
const activityRepo = AppDataSource.getRepository(Activity);
const userRepo = AppDataSource.getRepository(User);

export const getIncentivesByActivity = async (activityId: string) => {
  const incentives = await incentiveRepo.find({
    where: { activityId },
    relations: ['author'],
  });
  return incentives;
};

export const createIncentive = async (
  data: CreateIncentiveDto & { authorId: string },
) => {
  const activity = await activityRepo.findOneBy({ id: data.activityId });
  if (!activity) throw { status: 404, message: 'Activity não encontrada' };

  const author = await userRepo.findOneBy({ id: data.authorId });
  if (!author) throw { status: 404, message: 'Usuário autor não encontrado' };

  const existing = await incentiveRepo.findOne({
    where: {
      authorId: data.authorId,
      activityId: data.activityId,
      type: data.type,
    },
  });

  if (existing) throw { status: 409, message: 'Incentivo já concedido' };

  const newIncentive = incentiveRepo.create({
    type: data.type,
    authorId: data.authorId,
    activityId: data.activityId,
  });

  return incentiveRepo.save(newIncentive);
};

export const clearIncentives = async () => {
  await incentiveRepo.createQueryBuilder().delete().from(Incentive).execute();
};
