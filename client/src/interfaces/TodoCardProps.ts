import { Todo } from "../models/todo";

export interface TodoCardProps {
  todo: Todo;
  index: number;
  updateTodoStatus: (todo: Todo, newStatus: string) => void;
  currentPage: number;
}