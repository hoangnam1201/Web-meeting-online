import authRoute from "./auth.router.js";
import userRoute from "./user.router.js";

const initRouter = (app) => {
    app.use('/api/auth', authRoute);
    app.use('/api/user', userRoute);
}

export default initRouter;