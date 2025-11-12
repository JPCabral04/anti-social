import { AppDataSource } from '../data-source';
import { Connection } from '../entities/Connection';

const connectionRepo = AppDataSource.getRepository(Connection);

export const getConnectionsByUser = async (userId: string) => {
  const connections = await connectionRepo
    .createQueryBuilder('connection')
    .where('connection.user1 = :userId', { userId })
    .orWhere('connection.user2 = :userId', { userId })
    .getMany();

  if (connections.length === 0)
    throw { status: 404, message: 'Nenhuma conexão encontrada' };
  return connections;
};

export const createConnection = async (data: any) => {
  const newConnection = connectionRepo.create({
    user1: data.user1,
    user2: data.user2,
    creationDate: new Date(),
  });
  return connectionRepo.save(newConnection);
};

export const deleteConnection = async (id: string) => {
  const result = await connectionRepo.delete(id);
  if (result.affected === 0)
    throw { status: 404, message: 'Conexão não encontrada' };
};

export const clearConnections = async () => {
  await connectionRepo.createQueryBuilder().delete().from(Connection).execute();
};
