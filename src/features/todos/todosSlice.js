import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [], 
  filter: 'All'
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    loadTodos(state, action) {
      state.todos = action.payload;
    },
    addTodo(state, action) {
      state.todos.push(action.payload);
    },
    toggleTodo(state, action) {
      const todo = state.todos.find(t => t.id === action.payload);
      if(todo) todo.completed = !todo.completed;
    },
    deleteTodo(state, action) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    editTodo(state, action) {
      const { id, text } = action.payload;
      const todo = state.todos.find(t => t.id === id);
      if(todo) todo.text = text;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    }
  }
});

export const { loadTodos, addTodo, toggleTodo, deleteTodo, editTodo, setFilter } = todosSlice.actions;

export default todosSlice.reducer;
