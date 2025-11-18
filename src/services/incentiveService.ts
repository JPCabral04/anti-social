import { AppDataSource } from '../data-source';
import { Incentive } from '../entities/Incentive';
import { Activity } from '../entities/Activity';
import { User } from '../entities/User';
import { CreateIncentiveDto } from '../schemas/incentiveSchema';

const getIncentiveRepo = () => AppDataSource.getRepository(Incentive);
const getActivityRepo = () => AppDataSource.getRepository(Activity);
const getUserRepo = () => AppDataSource.getRepository(User);

export const getIncentivesByActivity = async (activityId: string) => {
  const incentives = await getIncentiveRepo().find({
    where: { activityId },
    relations: ['author'],
    order: { creationDate: 'DESC' },
  });
  return incentives;
};

export const createIncentive = async (
  data: CreateIncentiveDto & { authorId: string },
) => {
  const activity = await getActivityRepo().findOneBy({ id: data.activityId });
  if (!activity) throw { status: 404, message: 'Activity não encontrada' };

  const author = await getUserRepo().findOneBy({ id: data.authorId });
  if (!author) throw { status: 404, message: 'Usuário autor não encontrado' };

  const existing = await getIncentiveRepo().findOne({
    where: {
      authorId: data.authorId,
      activityId: data.activityId,
      type: data.type,
    },
  });

  if (existing) throw { status: 409, message: 'Incentivo já concedido' };

  const newIncentive = getIncentiveRepo().create({
    type: data.type,
    authorId: data.authorId,
    activityId: data.activityId,
  });

  return getIncentiveRepo().save(newIncentive);
};

export const clearIncentives = async () => {
  await getIncentiveRepo()
    .createQueryBuilder()
    .delete()
    .from(Incentive)
    .execute();
};
