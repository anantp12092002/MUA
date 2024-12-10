import { Sequelize, DataTypes } from 'sequelize';


import{sequelize} from '../config/database.js'

export const TaskApproval = sequelize.define('TaskApproval', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'task_approvals',
    timestamps: false
});


TaskApproval.sync()
    .then(() => console.log("Sequelize Task table created successfully"))
    .catch((error) => console.log("Error creating Task table with Sequelize:", error));

// ** Native `pg` Library Implementation **


// Create a new task approval
export async function createApproval(task_id, user_id) {
    const query = `
        INSERT INTO task_approvals (task_id, user_id, approved)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    
    const values = [task_id, user_id, false]; // Default 'approved' value is false
    
    try {
        const { rows } = await sequelize.query(query, values);
        return rows[0]; // Return the created approval record
    } catch (error) {
        console.error('Error creating task approval:', error);
        throw new Error('Error creating task approval');
    }
}

// Update task approval status (approve or reject)
export async function updateApproval(task_id, user_id, approved) {
    const query = `
        UPDATE task_approvals
        SET approved = $1, updated_at = NOW()
        WHERE task_id = $2 AND user_id = $3
        RETURNING *;
    `;
    
    const values = [approved, task_id, user_id];

    try {
        const { rows } = await sequelize.query(query, values);
        return rows[0]; // Return the updated approval record
    } catch (error) {
        console.error('Error updating task approval:', error);
        throw new Error('Error updating task approval');
    }
}

// Delete a task approval (if needed)
export async function deleteApproval(task_id, user_id) {
    const query = `
        DELETE FROM task_approvals
        WHERE task_id = $1 AND user_id = $2
        RETURNING *;
    `;
    
    const values = [task_id, user_id];
    
    try {
        const { rows } = await sequelize.query(query, values);
        return rows[0]; // Return the deleted approval record
    } catch (error) {
        console.error('Error deleting task approval:', error);
        throw new Error('Error deleting task approval');
    }
}

// Get all approvals for a specific task
export async function getApprovalsByTaskId(task_id) {
    const query = `
        SELECT * FROM task_approvals
        WHERE task_id = $1;
    `;
    
    const values = [task_id];

    try {
        const { rows } = await sequelize.query(query, values);
        return rows; // Return all approval records for the task
    } catch (error) {
        console.error('Error fetching task approvals:', error);
        throw new Error('Error fetching task approvals');
    }
}

// Get all task approvals for a specific user
export async function getApprovalsByUserId(user_id) {
    const query = `
        SELECT * FROM task_approvals
        WHERE user_id = $1;
    `;
    
    const values = [user_id];

    try {
        const { rows } = await sequelize.query(query, values);
        return rows; // Return all approval records for the user
    } catch (error) {
        console.error('Error fetching approvals for user:', error);
        throw new Error('Error fetching approvals for user');
    }
}

