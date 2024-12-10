import Task from '../model/task.js';
import TaskApproval from '../model/taskApproval.js';
import User from '../model/user.js';

export async function createTask(req, res) {
    const { created_by, name, description } = req.body;

        const task = await Task.create({ created_by, name, description });
        // For multi-approval, assume the creator selects 3 users to approve the task
        const usersForApproval = await User.findAll({ limit: 3 }); // Just an example, assume you fetch users dynamically
        usersForApproval.forEach(async (user) => {
            await TaskApproval.create({ task_id: task.id, user_id: user.id });
        });

        return {task}
    
}

// Get all tasks
export async function getTasks(req, res) {
        const tasks = await Task.findAll();
        return { tasks };
}

// Approve a task
export async function approveTask(req, res) {
    const { task_id, user_id } = req.body;

        const approval = await TaskApproval.findOne({ where: { task_id, user_id } });
        if (!approval) {
            return { error: 'Approval not found' };
        }

        approval.approved = true;
        await approval.save();

        // Check if all approvals are complete
        const totalApprovals = await TaskApproval.count({ where: { task_id, approved: true } });
        const task = await Task.findByPk(task_id);

        if (totalApprovals >= 3) {
            task.status = 'Approved';
            await task.save();
        }

        return { message: 'Task approved' };
}
