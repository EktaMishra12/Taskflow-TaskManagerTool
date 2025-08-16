 import Task  from "../models/taskModel.js";

 export const createTask = async (req, res) => {
  const owner = req.user._id;
  const { title, description, priority, dueDate, completed } = req.body;

  try {
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      owner,
      completed: completed === "Yes" || completed === true,
    });

    const saved = await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task: saved,
      success: true,
    });
  } catch (err) {
    res.status(400).json({ message: "Error creating task", err, success: false });
  }
};

// Get All Tasks for a User
    export const getTasks = async (req, res) => {
        

        try {
            const tasks = await Task.find({  owner :req.user.id }).sort({ createdAt: -1 });
          
            res.status(200).json({
                message: "Tasks fetched successfully",
                tasks,
                success: true,
            });
        } catch (err) {
            res.status(500).json({ message: "Error fetching tasks", err, success: false });
        }
    }

    // Get Task by ID
    export const getTaskById = async (req, res) => {
        try {
            const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
            if (!task) return res.status(404).json({ message: "Task not found", success: false });
            res.status(200).json({
                message: "Task fetched successfully",
                task,
                success: true,
            });
        } catch (err) {
            res.status(500).json({ message: "Error fetching task", err, success: false });
        }
    }


//
    export const updateTask = async (req, res) => {
        try {
            const date = { ...req.body };
            if (date.completed !== undefined) {
                date.completed = date.completed === "Yes" || date.completed === true;
            }

            const update = await Task.findByIdAndUpdate(
                { _id: req.params.id, owner: req.user.id },
                date,
                { new: true, runValidators: true }
            );

            if (!update) return res.status(404).json({ message: "Task not found", success: false });
            res.status(200).json({
                message: "Task updated successfully",
                task: update,
                success: true,
            });
        } catch (err) {
            res.status(500).json({ message: "Error updating task", err, success: false });
        }
    }


    // Delete Task
    export const deleteTask = async (req, res) => {
        try {
            const deleted = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user.id });
            if (!deleted) return res.status(404).json({ message: "Task not found", success: false });
            res.status(200).json({
                message: "Task deleted successfully",
                deleted,
                success: true,
            });
        } catch (err) {
            res.status(400).json({ message: "Error deleting task", err, success: false });
        }
    }


 