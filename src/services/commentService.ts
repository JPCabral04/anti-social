import { AppDataSource } from '../data-source';
import { Comment } from '../entities/Comment';
import { Activity } from '../entities/Activity';
import { User } from '../entities/User';
import { CreateCommentDto } from '../schemas/commentSchema';

const commentRepo = AppDataSource.getRepository(Comment);
const activityRepo = AppDataSource.getRepository(Activity);
const userRepo = AppDataSource.getRepository(User);

export const createComment = async (
  data: CreateCommentDto & { authorId: string },
) => {
  const activity = await activityRepo.findOneBy({ id: data.activityId });
  if (!activity) throw { status: 404, message: 'Post não encontrado' };

  const author = await userRepo.findOneBy({ id: data.authorId });
  if (!author) throw { status: 404, message: 'Usuário não encontrado' };

  const newComment = commentRepo.create({
    content: data.content,
    activity,
    author,
  });

  return commentRepo.save(newComment);
};

export const getCommentsByActivity = async (activityId: string) => {
  return commentRepo.find({
    where: { activity: { id: activityId } },
    relations: ['author'],
    order: { creationDate: 'ASC' },
  });
};
