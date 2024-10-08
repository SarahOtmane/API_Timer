import express, { Application } from 'express';

const app: Application = express();
const port: number = 3000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default server;
