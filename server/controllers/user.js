const Task = require("../models/task")
const User = require("../models/user")

exports.fetchUserList = async (req, res) => {
    try {
        const { user } = req

        const users = await User.find({}).select("name")

        return res.status(200).json({
            success: true,
            message: "User list fetched successfully",
            userList: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}

//fetch by filtering 
exports.fetchTasks = async (req, res) => {

    try {
        const { status, priority } = req.query

        const { user } = req

        if (status || priority) {

            const userData = await User.findById(user._id)
                .populate({
                    path: "tasks",
                    match: {
                        ...(status && { status }),
                        ...(priority && { priority }),
                    },
                    options: { sort: { createdAt: -1 } },
                    populate: [
                        { path: "createdBy", select: "name" },
                        { path: "assignedTo", select: "name" }
                    ]
                    // populate: ({
                    //     path: "createdBy",
                    //     select: "name"
                    // }),
                    // populate: ({
                    //     path: "assignedTo",
                    //     select: "name"
                    // })
                })
                .populate({
                    path: "tasksCreated",
                    match: {
                        ...(status && { status }),
                        ...(priority && { priority }),
                    },
                    options: { sort: { createdAt: -1 } },
                    populate: ({ path: "assignedTo", select: "name" })
                });

            const tasks = userData?.tasks || [];
            const tasksCreated = userData?.tasksCreated || [];


            // if (tasks.length > 0) {
            return res.status(200).json({
                success: true,
                message: "User tasks fetched",
                tasks,
                tasksCreated
            });

            // } else {
            //     return res.status(404).json({
            //         success: false,
            //         message: "No task found"
            //     });
            // }

        } else {

            const userData = await User.findById(user?._id)
                .populate({
                    path: "tasks",
                    options: { sort: { createdAt: -1 } },
                    populate: [
                        { path: "createdBy", select: "name" },
                        { path: "assignedTo", select: "name" }
                    ]
                })
                .populate({
                    path: "tasksCreated",
                    options: { sort: { createdAt: -1 } },
                    populate: ({ path: "assignedTo", select: "name" })
                });

            const tasks = userData?.tasks || [];
            const tasksCreated = userData?.tasksCreated || [];


            // if (tasks?.length > 0) {
            return res.status(200).json({
                success: true,
                message: "User tasks fetched",
                tasks,
                tasksCreated
            })
            // } else {
            //     return res.status(404).json({
            //         success: false,
            //         message: "No task found"
            //     })
            // }
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.addTask = async (req, res) => {
    try {
        //  title, description, due date, priority, and status.
        const { title, description, dueDate, priority, status, assignTo } = req.body
        const { user } = req

        if (!title || !description || !dueDate || !priority || !status || !assignTo) {
            return res.status(400).json({
                success: false,
                message: "All feilds required"
            })
        }

        const assignee = await User.findById(assignTo)

        if (!assignee) {
            return res.status(404).json({
                success: false,
                message: "Assigned user not found"
            })
        }

        try {
            const newTask = await Task.create({
                title, description, dueDate: new Date(dueDate), priority, status, createdBy: user._id,
                assignedTo: assignTo
            })
            const newPopulatedTask = await Task.findById(newTask._id)
            // .populate("assignedTo", "name email")
            // .populate("createdBy", "name email");

            await User.findByIdAndUpdate(assignTo, {
                $push: {
                    "tasks": newTask._id
                }
            })

            const currUser = await User.findByIdAndUpdate(user._id, {
                $push: {
                    "tasksCreated": newTask._id
                }
            }, { new: true })
                .populate({
                    path: "tasks",
                    options: { sort: { createdAt: -1 } },
                    populate: [
                        { path: "createdBy", select: "name" },
                        { path: "assignedTo", select: "name" }
                    ]

                })
                .populate({
                    path: "tasksCreated",
                    options: { sort: { createdAt: -1 } },
                    populate: { path: "assignedTo" }
                });



            return res.status(200).json({
                success: true,
                message: "New task created",
                // task: newPopulatedTask
                tasksCreated: currUser.tasksCreated,
                tasks: currUser.tasks
            })


        } catch (error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: "Error while creating new Task"
            })

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}

exports.updateTask = async (req, res) => {
    try {
        const { title = "", description = "", dueDate = "", priority = "", status = "", assignTo = "", _id } = req.body
        const { user } = req

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Task id required"
            })
        }

        const task = await Task.findById(_id)

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        if (title && task.title !== title) {
            task.title = title
        }
        if (description && task.description !== description) {
            task.description = description
        }
        if (dueDate && new Date(task.dueDate).getTime() !== new Date(dueDate).getTime()) {
            task.dueDate = new Date(dueDate)
        }
        if (priority && task.priority !== priority) {
            task.priority = priority
        }
        if (status && task.status !== status) {
            task.status = status
        }

        if (assignTo && (task.assignedTo).toString() !== assignTo) {

            const newAssignee = await User.findById(assignTo);
            if (!newAssignee) {
                return res.status(404).json({
                    success: false,
                    message: "Assigned user not found"
                });
            }
            // find assigned user and remove task
            await User.findByIdAndUpdate(task.assignedTo, {
                $pull: {
                    tasks: task._id
                }
            })

            // find new assignee and add task id to tasks
            await User.findByIdAndUpdate(assignTo, {
                $push: {
                    tasks: _id
                }
            })

            task.assignedTo = assignTo
        }
        await task.save()

        const userData = await User.findById(user._id)
            .populate({
                path: "tasks",
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: "createdBy", select: "name" },
                    { path: "assignedTo", select: "name" }
                ]
            })
            .populate({
                path: "tasksCreated",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "assignedTo",
                    select: "name"
                }
            })

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            tasks: userData.tasks,
            tasksCreated: userData.tasksCreated
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.body
        const { user } = req

        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: "Task id required"
            })
        }

        const task = await Task.findOne({ _id: taskId })
            .populate("createdBy").populate("assignedTo")

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        const userTaskCreator = await User.findByIdAndUpdate({ _id: task.createdBy._id }, {
            $pull: {
                "tasksCreated": task._id
            }
        })

        const userTaskAssigned = await User.findByIdAndUpdate({ _id: task.assignedTo._id }, {
            $pull: {
                tasks: task._id
            }
        })

        await Task.findByIdAndDelete(task._id)

        const currUser = await User.findById(user._id)
            .populate({
                path: "tasks",
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: "createdBy", select: "name" },
                    { path: "assignedTo", select: "name" }
                ]
            })
            .populate({
                path: "tasksCreated",
                options: { sort: { createdAt: -1 } },
                populate: ({
                    path: "assignedTo",
                    select: "name"

                })
            })

        return res.status(200).json({
            success: true,
            message: "Task deleted",
            tasks: currUser.tasks,
            tasksCreated: currUser.tasksCreated
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}