import { AppDataSource } from '../data-source';
import { Connection } from '../entities/Connection';
import { CreateConnectionDto } from '../schemas/connectionSchema';

const connectionRepo = AppDataSource.getRepository(Connection);

export const getConnectionsByUser = async (userId: string) => {
  const connections = await connectionRepo
    .createQueryBuilder('connection')
    .where('connection.user1Id = :userId', { userId })
    .orWhere('connection.user2Id = :userId', { userId })
    .getMany();

  return connections;
};

export const createConnection = async (data: CreateConnectionDto) => {
  const existing = await connectionRepo
    .createQueryBuilder('c')
    .where(
      '(c.user1 = :u1 AND c.user2 = :u2) OR (c.user1 = :u2 AND c.user2 = :u1)',
      {
        u1: data.user1,
        u2: data.user2,
      },
    )
    .getOne();

  if (existing) throw { status: 409, message: 'Conexão já existe' };

  const connection = connectionRepo.create({
    user1: { id: data.user1 },
    user2: { id: data.user2 },
  });

  return connectionRepo.save(connection);
};

export const deleteConnection = async (id: string) => {
  const result = await connectionRepo.delete(id);
  if (result.affected === 0)
    throw { status: 404, message: 'Conexão não encontrada' };
};

export const clearConnections = async () => {
  await connectionRepo.createQueryBuilder().delete().from(Connection).execute();
};

export const findById = (id: string) => {
  return connectionRepo.findOne({
    where: { id },
    relations: ['user1', 'user2'],
  });
};
