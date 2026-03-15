import { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://task8-todo-backend.onrender.com";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/tasks`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      if (!res.ok) throw new Error("Failed to add todo");

      setTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed })
      });

      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "DELETE"
      });

      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;

    try {
      await fetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle })
      });

      setEditingId(null);
      setEditTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="todo-app">
        <h1>📝 To-Do List</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <input
          className="search"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p className="info">Loading...</p>}
        {error && <p className="error">{error}</p>}

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo._id} className={todo.completed ? "done" : ""}>
              {editingId === todo._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(todo._id)}>✔</button>
                </>
              ) : (
                <>
                  <span onClick={() => toggleTodo(todo._id, todo.completed)}>
                    {todo.title}
                  </span>

                  <div className="actions">
                    <button onClick={() => startEdit(todo)}>✏️</button>
                    <button onClick={() => deleteTodo(todo._id)}>✕</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}