import express from "express";
import http from "http";

export interface ISwissPairingServers {
	applicationServer: express.Application,
	httpServer: http.Server
}