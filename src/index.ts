import 'dotenv/config'
import express from 'express'
import errorHandler from './middlewares/error-handler.middleware';
import authorizationRoute from './routes/authorization.route';
import statusRoute from './routes/status.route';
import usersRoute from './routes/users.route';

const PORT = process.env.PORT || 3333;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(usersRoute);
app.use(statusRoute);
app.use(authorizationRoute);

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`API executando na porta ${PORT}`);
});
