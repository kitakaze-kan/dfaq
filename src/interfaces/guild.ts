export type GuildForm = {
  name: string;
  icon?: string;
};

export type Guild = GuildForm & {
  id: number;
  topicTable: string;
  answerTable: string;
};

export type TopicForm = {
  title: string;
  detail?: string;
};

export type Topic = {
  id: number;
  issuer: string;
  topic: string;
  tags?: string;
  genre?: string;
  createdAt: number;
  updatedAt: number;
};

export type Answer = {
  id: number;
  topicId: number;
  answerer: string;
  answer: string;
  isBestAnswer: number;
  createdAt: number;
  updatedAt: number;
};
