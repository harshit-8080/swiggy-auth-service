import { DataSource } from 'typeorm';

export const truncateTables = async (connection: DataSource) => {
  const entites = connection.entityMetadatas;

  for (const entity of entites) {
    const repository = connection.getRepository(entity.name);
    await repository.clear();
  }
};

export const isJwtValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length != 3) {
    return false;
  }

  try {
    parts.forEach((part) => {
      Buffer.from(part, 'base64').toString('utf-8');
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const isJwt = (token: string | null): boolean => {
  if (token === null) {
    return false;
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    parts.forEach((part) => {
      Buffer.from(part, 'base64').toString('utf-8');
    });
    return true;
  } catch (err) {
    return false;
  }
};
