// Firebase is deactivated. The database is MongoDB via backend Express API (/api/*).

export const app = null as any;
export const db = null as any;
export const auth = { currentUser: null } as any;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError() {
  return { error: 'Database is MongoDB' };
}

export async function testFirestoreConnection() {
  // MongoDB is active
}
