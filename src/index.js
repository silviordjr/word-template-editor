import app from "./app.js";
import FileController from './controller/FileController.js';
import UserController from './controller/UserController.js';

const fileController = new FileController()
const userController = new UserController()

app.post("/signup", userController.create)
app.put("/login", userController.login)
app.get("/users", userController.getAll)
app.get("/users/:id", userController.getById)
app.get("/current", userController.getCurrent)
app.get("/token", userController.validateToken)
app.put("/users/:id", userController.update)

app.post("/files/:model", fileController.create)
app.get("/files/:userId", fileController.getByUser)
app.get("/download/:id/:token", fileController.download)
app.get("/models/download/:model/:token", fileController.downloadModel)