export interface IDeal {
  id: number;
  name: string;
  price: number;
  _embedded?: {
    tasks?: ITask[];
  };
}

export interface ITask {
  complete_till: string;
}
