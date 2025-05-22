export interface CardDTO {
  id: number;
  question: string;
  answer: string;
  questionImageId?: number | null;
  answerImageId?: number | null;
}

export interface TagDTO {
  id: number;
  tagName: string;
  color: string;
  textColor: string;
}

export interface CardBoxDTO {
  id: number;
  title: string;
  public: boolean;
  ownerUsername: string;
  tags: TagDTO[];
  description: string;
}

export interface UserBoxDTO {
  id: number;
  user: number;
  cardBoxId: number;
  successPercentage: number;
}
