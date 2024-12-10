// Import Sequelize and pg
import { Sequelize, DataTypes } from 'sequelize';
import{ sequelize} from '../config/database.js'

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'users',
    timestamps: false, // Sequelize will automatically add 'createdAt' and 'updatedAt' if true
});

// Sync Sequelize model with the database (ensure it is created if it does not exist)
User.sync()
    .then(() => console.log("Sequelize User table created successfully"))
    .catch((error) => console.log("Error creating User table with Sequelize:", error));



// Native `pg` - Create a user
async function createUserPg(name, email, password_hash) {
    const query = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [name, email, password_hash];
    
    try {
        const res = await sequelize.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error creating user with pg:', error);
        throw error;
    }
}

// Native `pg` - Get all users
async function getUsersPg() {
    const query = 'SELECT * FROM users;';
    try {
        const res = await sequelize.query(query);
        return res.rows;
    } catch (error) {
        console.error('Error fetching users with pg:', error);
        throw error;
    }
}

// Native `pg` - Get a user by email
async function getUserByEmailPg(email) {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const values = [email];
    try {
        const res = await sequelize.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error fetching user by email with pg:', error);
        throw error;
    }
}

// ** Export Sequelize and Native `pg` Methods **
export {
    User,              // Sequelize model for users
    createUserPg,               // Native `pg` function to create a user
    getUsersPg,                 // Native `pg` function to get all users
    getUserByEmailPg            // Native `pg` function to get a user by email
};
