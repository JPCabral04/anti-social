import { AppDataSource } from '../data-source';
import { Connection } from '../entities/Connection';
import { User } from '../entities/User';
import { CreateConnectionDto } from '../schemas/connectionSchema';

const getConnectionRepo = () => AppDataSource.getRepository(Connection);
const getUserRepo = () => AppDataSource.getRepository(User);

export const createConnection = async (data: CreateConnectionDto) => {
  const user1 = await getUserRepo().findOneBy({ id: data.user1 });
  const user2 = await getUserRepo().findOneBy({ id: data.user2 });

  if (!user1 || !user2) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  const existing = await getConnectionRepo().findOne({
    where: {
      user1: { id: data.user1 },
      user2: { id: data.user2 },
    },
  });

  if (existing) {
    return existing;
  }

  const connection = getConnectionRepo().create({
    user1,
    user2,
  });

  return getConnectionRepo().save(connection);
};

export const getConnectionsByUser = async (userId: string) => {
  const connections = await getConnectionRepo().find({
    where: { user1: { id: userId } },
    relations: ['user2'],
  });
  return connections;
};

export const getFollowers = async (userId: string) => {
  const followers = await getConnectionRepo().find({
    where: { user2: { id: userId } },
    relations: ['user1'],
  });
  return followers;
};

export const deleteConnection = async (id: string) => {
  const result = await getConnectionRepo().delete(id);
  if (result.affected === 0)
    throw { status: 404, message: 'Conexão não encontrada' };
};

export const clearConnections = async () => {
  await getConnectionRepo().clear();
};

export const findById = (id: string) => {
  return getConnectionRepo().findOne({
    where: { id },
    relations: ['user1', 'user2'],
  });
};
