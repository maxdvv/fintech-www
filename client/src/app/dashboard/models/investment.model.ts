export interface ServerResponse<T> {
  status: string;
  data: T;
}

export interface CreateInvestmentResponse {
  userId: string;
  deposit: number;
  profit: number;
  bonus: number
  availableProfit: number
  availableBonus: number
  _id: string;
  createdAt: string,
  updatedAt: string,
}

export interface UserBonus {
  userId: string;
  userName: string;
  email: string;
  bonus: number;
}

