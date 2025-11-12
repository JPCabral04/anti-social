import { AppDataSource } from '../data-source';
import { Incentive } from '../entities/Incentive';

const incentiveRepo = AppDataSource.getRepository(Incentive);

export const getIncentivesByActivity = async (activityId: string) => {
  const incentives = await incentiveRepo.find({
    where: { activityId },
    relations: ['author'],
  });
  if (incentives.length === 0)
    throw { status: 404, message: 'Nenhum incentivo encontrado' };
  return incentives;
};

export const createIncentive = async (data: any) => {
  const newIncentive = incentiveRepo.create({
    type: data.type,
    authorId: data.authorId,
    activityId: data.activityId,
    creationDate: new Date(),
  });
  return incentiveRepo.save(newIncentive);
};

export const clearIncentives = async () => {
  await incentiveRepo.createQueryBuilder().delete().from(Incentive).execute();
};
