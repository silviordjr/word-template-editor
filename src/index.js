import app from "./app.js";
import FileController from './controller/FileController.js';
import UserController from './controller/UserController.js';

const fileController = new FileController()
const userController = new UserController()

app.post("/signup", userController.create)
app.put("/login", userController.login)

app.get("/users", userController.getAll)

app.post("/file", fileController.create)