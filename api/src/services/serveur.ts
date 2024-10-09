import { Application } from 'express';

const startServeur = async(app: Application) => {
    const isTestEnv: boolean = process.env.NODE_ENV === 'test';

    const port: number = isTestEnv ? 3001 : 3000;

    try {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.log(error)
    }
}

export default startServeur;
