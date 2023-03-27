import { application, Router } from 'express';
import testsRouter from './tests.routes';

const routes = Router();

routes.use('/tests', testsRouter);

export default routes;
