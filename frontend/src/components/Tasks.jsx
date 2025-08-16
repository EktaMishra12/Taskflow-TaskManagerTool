import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    completed: false,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { API_URL, token } = useContext(AuthContext);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/tasks/gp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setTasks(response.data.tasks);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingTask) {
        const response = await axios.put(`${API_URL}/tasks/${editingTask._id}/gp`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setTasks(tasks.map((task) => (task._id === editingTask._id ? response.data.task : task)));
          setEditingTask(null);
          toast.success('Task updated successfully');
        }
      } else {
        const response = await axios.post(`${API_URL}/tasks/gp`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setTasks([response.data.task, ...tasks]);
          toast.success('Task created successfully');
        }
      }
      setFormData({ title: '', description: '', priority: 'Low', dueDate: '', completed: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      completed: task.completed,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.delete(`${API_URL}/tasks/${id}/gp`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setTasks(tasks.filter((task) => task._id !== id));
        toast.success('Task deleted successfully');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-700 drop-shadow-lg">
        {editingTask ? 'Edit Task' : 'Create Task'}
      </h2>
      {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}
      {loading && <p className="text-center text-gray-600 mb-4">Loading...</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-2xl space-y-4 mb-10 transform hover:scale-[1.01] transition duration-300">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
        />
        <label className="block text-gray-700">
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            className="mr-2"
          />
          Completed
        </label>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md disabled:opacity-50"
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setFormData({ title: '', description: '', priority: 'Low', dueDate: '', completed: false });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 shadow-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-3xl font-extrabold mb-4 text-blue-700 drop-shadow-lg">Your Tasks</h2>
      {loading && <p className="text-center text-gray-600 mb-4">Loading...</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-blue-600 transform hover:scale-[1.01] transition duration-300">
            <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="mt-1 text-sm">Priority: <span className={`font-medium ${priorityColor(task.priority)}`}>{task.priority}</span></p>
            <p className="text-sm text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
            <p className={`text-sm ${task.completed ? 'text-green-600' : 'text-red-600'}`}>Status: {task.completed ? 'Completed' : 'Pending'}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 shadow-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;