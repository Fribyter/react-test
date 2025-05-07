import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, editTodo, setFilter, loadTodos } from './features/todos/todosSlice';

const FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

function App() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.todos);
  const filter = useSelector(state => state.todos.filter);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if(stored) {
      try {
        dispatch(loadTodos(JSON.parse(stored)));
      } catch {}
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter(todo => {
    if(filter === FILTERS.ACTIVE) return !todo.completed;
    if(filter === FILTERS.COMPLETED) return todo.completed;
    return true;
  });

  const handleAdd = () => {
    const trimmed = input.trim();
    if(!trimmed) return;
    dispatch(addTodo({
      id: Date.now(),
      text: trimmed,
      completed: false
    }));
    setInput('');
  };

  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if(trimmed) {
      dispatch(editTodo({ id, text: trimmed }));
    }
    setEditId(null);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>Todo List with Redux Toolkit</h2>
      <div>
        <input
          type="text"
          value={input}
          placeholder="Add todo..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div style={{ marginTop: 10 }}>
        {Object.values(FILTERS).map(f => (
          <button
            key={f}
            onClick={() => dispatch(setFilter(f))}
            style={{ marginRight: 5, fontWeight: filter === f ? 'bold' : 'normal' }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', marginTop: 8, backgroundColor: '#f9f9f9', padding:'5px 10px', borderRadius: 4 }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />
            {editId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo.id)}
                onKeyDown={e => {
                  if(e.key === 'Enter') saveEdit(todo.id);
                  if(e.key === 'Escape') setEditId(null);
                }}
                autoFocus
                style={{ flexGrow: 1, marginLeft: 8 }}
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setEditId(todo.id);
                  setEditText(todo.text);
                }}
                style={{ textDecoration: todo.completed ? 'line-through' : 'none', marginLeft: 8, flexGrow:1, cursor:'pointer' }}
              >
                {todo.text}
              </span>
            )}

            <button onClick={() => dispatch(deleteTodo(todo.id))} style={{ marginLeft: 10, color: 'red' }} title="Delete">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
