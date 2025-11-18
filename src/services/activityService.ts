import { AppDataSource } from '../data-source';
import { Activity } from '../entities/Activity';
import {
  CreateActivityDto,
  UpdateActivityDto,
} from '../schemas/activitySchema';
import { User } from '../entities/User';

const getActivityRepo = () => AppDataSource.getRepository(Activity);
const getUserRepo = () => AppDataSource.getRepository(User);

export const getAllActivities = async () => {
  const activities = await getActivityRepo().find({
    relations: ['author', 'incentives'],
    order: { creationDate: 'DESC' },
  });
  return activities;
};

export const getActivityById = async (id: string) => {
  const activity = await getActivityRepo().findOne({
    where: { id },
    relations: ['author', 'incentives', 'incentives.author'],
  });
  if (!activity) throw { status: 404, message: 'Atividade não encontrada' };
  return activity;
};

export const createActivity = async (
  data: CreateActivityDto & { authorId: string },
) => {
  const author = await getUserRepo().findOneBy({ id: data.authorId });
  if (!author) throw { status: 404, message: 'Usuário autor não encontrado' };

  const newActivity = getActivityRepo().create({
    title: data.title,
    description: data.description,
    authorId: data.authorId,
  });

  return getActivityRepo().save(newActivity);
};

export const updateActivity = async (id: string, data: UpdateActivityDto) => {
  const activityRepo = getActivityRepo();
  const activity = await activityRepo.findOneBy({ id });
  if (!activity) throw { status: 404, message: 'Atividade não encontrada' };

  activity.title = data.title ?? activity.title;
  activity.description = data.description ?? activity.description;
  activity.editDate = new Date();

  return activityRepo.save(activity);
};

export const deleteActivity = async (id: string) => {
  const result = await getActivityRepo().delete(id);
  if (result.affected === 0)
    throw { status: 404, message: 'Atividade não encontrada' };
};

export const clearActivities = async () => {
  await getActivityRepo().createQueryBuilder().delete().from(User).execute();
};
