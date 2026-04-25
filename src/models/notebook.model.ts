export interface INote {
  readonly id: string;
  readonly content: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly pinned?: boolean;
}
