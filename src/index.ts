import express from 'express';
import { Request, Response } from 'express';
import { userRouter } from './routes';
const app = express();
const {
	PORT = 3000,
} = process.env;
// app.get('/', (req: Request, res: Response) => {
// 	res.send({
// 		message: 'hello world',
// 	});
// });
app.use('/users', userRouter);
if (require.main === module) { // true if file is executed
	app.listen(PORT, () => {
		console.log('server started at http://localhost:'+PORT);
	});
}
export default app;
