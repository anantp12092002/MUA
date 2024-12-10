import { createTask, getTasks, approveTask } from '../service/taskService.js';


export async function handleCreateTask(req, res) {
    try {
        const task = await createTask(req);
        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
}


export async function handleGetTasks(req, res) {
    try {
        const tasks = await getTasks();
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export async function handleApproveTask(req, res) {
    const { task_id, user_id } = req.body;
    try {
        const message = await approveTask({ task_id, user_id });
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


