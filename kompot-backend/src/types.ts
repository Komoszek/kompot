import { RoomData } from '@common/types';

export interface IDatabase {
  rooms: { [key: string]: RoomData};
}
