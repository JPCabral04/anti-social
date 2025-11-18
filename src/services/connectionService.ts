import { AppDataSource } from '../data-source';
import { Connection } from '../entities/Connection';
import { CreateConnectionDto } from '../schemas/connectionSchema';

const getConnectionRepo = () => AppDataSource.getRepository(Connection);

export const getConnectionsByUser = async (userId: string) => {
  const connections = await getConnectionRepo()
    .createQueryBuilder('connection')
    .leftJoinAndSelect('connection.user1', 'user1')
    .leftJoinAndSelect('connection.user2', 'user2')
    .where('user1.id = :userId', { userId })
    .orWhere('user2.id = :userId', { userId })
    .getMany();

  return connections;
};

export const createConnection = async (data: CreateConnectionDto) => {
  const connectionRepo = getConnectionRepo();

  const existing = await connectionRepo
    .createQueryBuilder('c')
    .leftJoinAndSelect('c.user1', 'user1')
    .leftJoinAndSelect('c.user2', 'user2')
    .where(
      '(user1.id = :u1 AND user2.id = :u2) OR (user1.id = :u2 AND user2.id = :u1)',
      {
        u1: data.user1,
        u2: data.user2,
      },
    )
    .getOne();

  if (existing) throw { status: 409, message: 'Conexão já existe' };

  const connection = connectionRepo.create({
    user1: { id: data.user1 } as any,
    user2: { id: data.user2 } as any,
  });

  return connectionRepo.save(connection);
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
