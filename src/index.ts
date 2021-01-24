import express from 'express';
import { Request, Response } from 'express';
import {playerController, playerRouter} from './model/player';
const app = express();
const {
	PORT = 3000,
} = process.env;
app.get('/', (req: Request, res: Response) => {
	res.send({
		message: 'hello world',
	});
});

// add this before any route or before using req.body
let bodyParser = require('body-parser');
app.use(bodyParser());

app.use('/player', playerRouter);
if (require.main === module) { // true if file is executed
	app.listen(PORT, () => {
		console.log('server started at http://localhost:'+PORT);
	});
}
export default app;
