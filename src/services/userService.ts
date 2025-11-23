import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const getUserRepo = () => AppDataSource.getRepository(User);

export const getUserById = async (id: string) => {
  const user = await getUserRepo().findOneBy({ id });
  if (!user) throw { status: 404, message: 'Usuário não encontrado' };
  return user;
};

export const updateUser = async (id: string, data: any) => {
  const userRepo = getUserRepo();
  const user = await userRepo.findOneBy({ id });
  if (!user) throw { status: 404, message: 'Usuário não encontrado' };

  if (data.email) {
    const exists = await userRepo.findOne({ where: { email: data.email } });
    if (exists && exists.id !== id) {
      throw { status: 400, message: 'Email já está em uso' };
    }
  }

  user.name = data.name ?? user.name;
  user.email = data.email ?? user.email;
  user.bio = data.bio ?? user.bio;
  user.developmentGoals = data.developmentGoals ?? user.developmentGoals;

  return userRepo.save(user);
};

export const deleteUser = async (id: string) => {
  const result = await getUserRepo().delete(id);
  if (result.affected === 0)
    throw { status: 404, message: 'Usuário não encontrado' };
};

export const clearUsers = async () => {
  await getUserRepo().createQueryBuilder().delete().from(User).execute();
};
