// Import Sequelize and pg
import { Sequelize, DataTypes } from 'sequelize';
import{sequelize} from '../config/database.js'

// ** Sequelize ORM Implementation **
// const sequelize = new Sequelize('postgres://user:password@localhost:5432/dbname', {
//     dialect: 'postgres',
//     logging: false,  // Disable logging SQL queries
// });

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',  // Refers to the 'users' table (make sure 'users' table exists)
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',  // Default status for new tasks
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, {
    tableName: 'tasks',
    timestamps: false, // Sequelize will automatically add 'createdAt' and 'updatedAt' if true
});

// Sync Sequelize model with the database (ensure it is created if it does not exist)
TaskSequelize.sync()
    .then(() => console.log("Sequelize Task table created successfully"))
    .catch((error) => console.log("Error creating Task table with Sequelize:", error));



// Native `pg` - Create a task
async function createTaskPg(created_by, name, description, status = 'Pending') {
    const query = `
        INSERT INTO tasks (created_by, name, description, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [created_by, name, description, status];
    
    try {
        const res = await sequelize.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error creating task with pg:', error);
        throw error;
    }
}

// Native `pg` - Get all tasks
async function getTasksPg() {
    const query = 'SELECT * FROM tasks;';
    try {
        const res = await sequelize.query(query);
        return res.rows;
    } catch (error) {
        console.error('Error fetching tasks with pg:', error);
        throw error;
    }
}

// Native `pg` - Update a task status
async function updateTaskStatusPg(id, status) {
    const query = 'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *;';
    const values = [status, id];
    try {
        const res = await sequelize.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error updating task with pg:', error);
        throw error;
    }
}

// ** Export Sequelize and Native `pg` Methods **
export {
    Task,           // Sequelize model for tasks
    createTaskPg,            // Native `pg` function to create a task
    getTasksPg,              // Native `pg` function to get all tasks
    updateTaskStatusPg       // Native `pg` function to update task status
};
