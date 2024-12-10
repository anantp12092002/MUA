# MUA
Task Management API
This project is a Node.js-based backend application that provides APIs for managing tasks. It allows users to create tasks, fetch all tasks, and approve tasks. The project is built using Express and Sequelize for handling database interactions.

Features
Create Task: API to create new tasks.
Get All Tasks: API to fetch all tasks.
Approve Task: API to approve a task with specified conditions.
Modular design with separation of concerns between services and controllers.

Project Structure


├── controllers
│   └── taskController.js   # API route handlers
├── models
│   └── Task.js             # Task model
│   └── TaskApproval.js     # TaskApproval model
├── routes
│   └── taskRoutes.js       # Task-related routes
├── services
│   └── taskService.js      # Business logic for tasks
├── app.js                  # Main application file
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation


Not covered -
○ User creating task to choose the 3 other users from a dropdown
list and send email notifications to each user when a new task is
created.
○ Add the functionality for users to add comments.
○ Ensure the process creator receives a notification on their page
when anyone signs off, and notify all parties involved via email
when everyone signs off.
