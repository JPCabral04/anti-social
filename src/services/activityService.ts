import { AppDataSource } from '../data-source';
import { Activity } from '../entities/Activity';

const activityRepo = AppDataSource.getRepository(Activity);

export const getAllActivities = async () => {
  const activities = await activityRepo.find({
    relations: ['author', 'incentives'],
  });
  if (activities.length === 0)
    throw { status: 404, message: 'Nenhuma atividade encontrada' };
  return activities;
};

export const getActivityById = async (id: string) => {
  const activity = await activityRepo.findOne({
    where: { id },
    relations: ['author', 'incentives', 'incentives.author'],
  });
  if (!activity) throw { status: 404, message: 'Atividade não encontrada' };
  return activity;
};

export const createActivity = async (data: any) => {
  const newActivity = activityRepo.create({
    title: data.title,
    description: data.description,
    authorId: data.authorId,
    creationDate: new Date(),
    editDate: new Date(),
  });
  return activityRepo.save(newActivity);
};

export const updateActivity = async (id: string, data: any) => {
  const activity = await activityRepo.findOneBy({ id });
  if (!activity) throw { status: 404, message: 'Atividade não encontrada' };

  activity.title = data.title ?? activity.title;
  activity.description = data.description ?? activity.description;
  activity.editDate = new Date();

  return activityRepo.save(activity);
};

export const deleteActivity = async (id: string) => {
  const result = await activityRepo.delete(id);
  if (result.affected === 0)
    throw { status: 404, message: 'Atividade não encontrada' };
};

export const clearActivities = async () => {
  await activityRepo.createQueryBuilder().delete().from(Activity).execute();
};
