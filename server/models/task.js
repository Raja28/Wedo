const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["Todo", "In-Progress", "Completed", "Blocked"],
        default: "Todo"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

// Middleware to update the `updatedAt` field on each save
// taskSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

const Task = mongoose.model("Task", taskSchema)
module.exports = Task