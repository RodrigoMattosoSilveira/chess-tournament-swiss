import express from 'express';
import * as http from "http";

import {createExpressApp, createHttpServer, mongoDbAtlas} from "./server/server";

const app: express.Application = createExpressApp();
const server: http.Server = createHttpServer(app);
mongoDbAtlas(app);

export default app;
export { server }
