import { Router } from 'express';

const testsRouter = Router();

testsRouter.get('/example-get/', (request, response) => {
    return response.json({ message: "Hello World!" });
});

testsRouter.post('/example-body/', (request, response) => {
    const { message } = request.body;

    if (!message) response.status(400).json({ message: "Parâmetro message não enviado" })

    return response.json({ message });
});

testsRouter.post('/example-params/:id', (request, response) => {
        const { id } = request.params;

        return response.json({ message: `O id recebido no parâmetro de rota foi ${id}` });
});

export default testsRouter;
