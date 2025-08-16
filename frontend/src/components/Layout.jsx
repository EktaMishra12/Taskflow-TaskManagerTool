import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { Circle, Zap } from 'lucide-react';

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const { data } = await axios.get('http://localhost:4000/api/tasks/gp', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not load tasks');
      if (err.response && err.response.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length;

    const totalCount = tasks.length;
    const pendingTasks = totalCount - completedTasks;
    const completionRate = totalCount ? Math.round((completedTasks / totalCount) * 100) : 0;

    return {
      completedTasks,
      pendingTasks,
      totalCount,
      completionRate,
    };
  }, [tasks]);

  const Startcard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 rounded-xl bg-white shadow-md border border-purple-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500 group-hover:from-fuchsia-500/20 ">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex bg-gray-50 items-center justify-center min-h-screen flex-col gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-50 items-center justify-center min-h-screen flex-col">
        <p className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 max-w-md">
          Error loading tasks
        </p>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchTasks}
          className="mt-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />
      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-6 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 sm:mb-4">
                Task Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Startcard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={<Circle className="w-4 h-4 text-purple-500" />}
                />
                <Startcard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={<Circle className="w-4 h-4 text-green-500" />}
                />
                <Startcard
                  title="Pending"
                  value={stats.pendingTasks}
                  icon={<Circle className="w-4 h-4 text-fuchsia-500" />}
                />
                <Startcard
                  title="Completion Rate"
                  value={`${stats.completionRate}%`}
                  icon={<Zap className="w-4 h-4 text-purple-500" />}
                />
              </div>

              <hr className="my-3 sm:my-4 border-purple-100" />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-sm flex items-center gap-1.5 font-medium">
                    Total Progress
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 sm:px-2 rounded-full">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 h-2 sm:h-3 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-xl p-4 sm:p-5 shadow-md border border-purple-100'>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 sm:mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task._id|| task.id } className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{task.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Layout;