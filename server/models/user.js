const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    tasksCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
