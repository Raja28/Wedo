const Express = require("express")
const { addTask, fetchUserList, fetchTasks, deleteTask, updateTask } = require("../controllers/user")
const { auth } = require("../middlewares/auth")
const router = Express.Router()

router.post("/task", auth, addTask)
router.get("/task", auth, fetchTasks)
router.post("/task/delete", auth, deleteTask)
router.get("/userList", auth, fetchUserList)
router.post("/task/update", auth, updateTask)

module.exports = router