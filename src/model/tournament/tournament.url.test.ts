import {IUserCreate, IUserPatch} from "../user/user.interfaces";

const request = require("supertest");

import app from "../../server/app";
import {AMongoDb, MongoInMemory} from "../../server/mongodb";

import {IConfig} from "../../config/config.interface";
import {ITournamentCreate, ITournamentPatch} from "./tournament.interfaces";
import {TOURNAMENT_DEFAULTS, TOURNAMENT_STATE, TOURNAMENT_TYPE} from "./tournament.constants";
let config: IConfig = require('../../config/config.dev.json');

describe("Tournament URL Tests", () => {
    let mongodb: AMongoDb;
    let eid: string;
    let name: string;					// Must be unique and at least 15 characters long
    let city: string;          		// Must be in the cities table;
    let country: string;       		// Must be in the countries table;
    let year: number;          		// Must be in the cities table;
    let rounds: number;        			// Must be a number less than 25;
    let maxPlayers: number;				// Must be a number less than 129;
    let minRate: number;        		// Must be a positive number;
    let maxRate: number;        		// Must be a positive number;
    let type: string; 					// Must be a TOURNAMENT_TYPE;
    let players: string[]; 				// Must be empty to start
    let state: string; 					// Must be a TOURNAMENT_STATE;
    let winPoints: number;     			// Must be a positive number; default is 1
    let tiePoints: number; 				// Must be a positive number; default is 0.5
    let scheduledStartDate: number; 	// milliseconds since epoch to date
    let scheduledEndDate: number; 		// milliseconds since epoch to date
    let actualStartDate: number; 		// milliseconds since epoch to date
    let actualEndDate: number; 		// milliseconds since epoch to date


    beforeAll(async done => {
        mongodb = new MongoInMemory(config.mongoDbInMemoryURI, config.mongodbOptions)
        mongodb.connect()
            .then(() => {
                console.log(`MongoDB Server running`);
                done();
            })
            .catch((err: any) => {
                done (err);
            })
        done();
    });

    // afterEach(async done => {
    // 	await mongodb.clear();
    // 	done();
    // });

    afterAll(async done => {
        await mongodb.close();
        done();
    });
    describe("Canonical Tests", () => {
        it('this pipeline', async done => {
            expect(1+1).toEqual(2);
            done();
        });
        it("Swiss Pairing up and running", async () => {
            return request(app)
                .get("/hello")
                .then((response: any) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.text).toEqual("Swiss Pairing up and running!")
                });
        });
    });
    describe("URL Tests", () => {
        describe("`CREATE` a tournament", () => {
            it("is successful", async () => {
                let newEntity: ITournamentCreate = {
                    eid: "somecrazynumber",
                    name: "USA OPEN 2020"
                }
                return request(app)
                    .post("/tournament")
                    .send(newEntity)
                    .then((response: any) => {
                        expect(response.statusCode).toBe(201);
                        expect(response.body.eid).not.toEqual(newEntity.eid);
                        expect(response.body.name).toEqual(newEntity.name);
                        expect(response.body.city).toEqual(TOURNAMENT_DEFAULTS.city);
                        expect(response.body.country).toEqual(TOURNAMENT_DEFAULTS.country);
                        expect(response.body.year).toEqual(TOURNAMENT_DEFAULTS.year);
                        expect(response.body.rounds).toEqual(TOURNAMENT_DEFAULTS.rounds);
                        expect(response.body.maxPlayers).toEqual(TOURNAMENT_DEFAULTS.maxPlayers);
                        expect(response.body.minRate).toEqual(TOURNAMENT_DEFAULTS.minRate);
                        expect(response.body.maxRate).toEqual(TOURNAMENT_DEFAULTS.maxRate);
                        expect(response.body.type).toEqual(TOURNAMENT_DEFAULTS.type);
                        expect(response.body.players).toEqual([]);
                        expect(response.body.state).toEqual(TOURNAMENT_DEFAULTS.state);
                        expect(response.body.winPoints).toEqual(TOURNAMENT_DEFAULTS.winPoints);
                        expect(response.body.scheduledStartDate).toEqual(TOURNAMENT_DEFAULTS.scheduledStartDate);
                        expect(response.body.scheduledEndDate).toEqual(TOURNAMENT_DEFAULTS.scheduledEndDate);
                        expect(response.body.actualStartDate).toEqual(TOURNAMENT_DEFAULTS.actualStartDate);
                        expect(response.body.actualEndDate).toEqual(TOURNAMENT_DEFAULTS.actualEndDate);
                        eid = response.body.eid;
                        name = response.body.name;
                        city = response.body.city;
                        country = response.body.country;
                        year = response.body.year;
                        rounds = response.body.rounds;
                        maxPlayers = response.body.maxPlayers;
                        minRate = response.body.minRate;
                        maxRate = response.body.maxRate
                        type = response.body.type;
                        players = response.body.players;
                        state = response.body.state;
                        winPoints = response.body.winPoints;
                        tiePoints = response.body.tiePoints;
                        scheduledStartDate = response.body.scheduledStartDate;
                        scheduledEndDate = response.body.scheduledEndDate;
                        actualStartDate = response.body.actualStartDate;
                        actualEndDate = response.body.actualEndDate
                    });
            });
        })
        describe("`READ` a tournament",  () => {
            it("is successful", async () => {
                return request(app)
                    .get(`/tournament/${eid}`)
                    .then((response: any) => {
                        expect(response.statusCode).toBe(200);
                        expect(response.body.name).toEqual(name);
                        expect(response.body.city).toEqual(city);
                        expect(response.body.country).toEqual(country);
                        expect(response.body.year).toEqual(year);
                        expect(response.body.rounds).toEqual(rounds);
                        expect(response.body.maxPlayers).toEqual(maxPlayers);
                        expect(response.body.minRate).toEqual(minRate);
                        expect(response.body.maxRate).toEqual(maxRate);
                        expect(response.body.type).toEqual(type);
                        expect(response.body.players).toEqual(players);
                        expect(response.body.state).toEqual(state);
                        expect(response.body.winPoints).toEqual(winPoints);
                        expect(response.body.tiePoints).toEqual(tiePoints);
                        expect(response.body.scheduledStartDate).toEqual(scheduledStartDate);
                        expect(response.body.scheduledEndDate).toEqual(scheduledEndDate);
                        expect(response.body.actualStartDate).toEqual(actualStartDate);
                        expect(response.body.actualEndDate).toEqual(actualEndDate);
                    });
            });
        })
        describe("`PATCH` a tournament", () => {
            it("name works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    name: "USA OPEN 2029"
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.name).toEqual(entityPatch.name);
                    });
            });
            it("country works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    country: "USA"
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.country).toEqual(entityPatch.country);
                    });
            });
            it("city works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    city: "San Francisco"
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.city).toEqual(entityPatch.city);
                    });
            });
            it("year works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    year: 2029
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.year).toEqual(entityPatch.year);
                    });
            });
            it("rounds works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    rounds: 7
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.rounds).toEqual(entityPatch.rounds);
                    });
            });
            it("maxPlayers works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    maxPlayers: 11
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.maxPlayers).toEqual(entityPatch.maxPlayers);
                    });
            });
            it("minRate works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    minRate: 1111
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.minRate).toEqual(entityPatch.minRate);
                    });
            });
            it("maxRate works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    maxRate: 3111
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.maxRate).toEqual(entityPatch.maxRate);
                    });
            });
            it("type works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    type: TOURNAMENT_TYPE.ELIMINATION
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.type).toEqual(entityPatch.type);
                    });
            });
            it("state works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    state: TOURNAMENT_STATE.UNDERWAY
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.state).toEqual(entityPatch.state);
                    });
            });
            it("winPoints works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    winPoints: 3
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.winPoints).toEqual(entityPatch.winPoints);
                    });
            });
            it("tiePoints works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    tiePoints: 2
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.tiePoints).toEqual(entityPatch.tiePoints);
                    });
            });
            it("scheduledStartDate works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    scheduledStartDate: 2
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.scheduledStartDate).toEqual(entityPatch.scheduledStartDate);
                    });
            });
            it("scheduledEndDate works", async () => {
                let entityPatch: ITournamentPatch = {
                    eid: eid,
                    scheduledEndDate: 3
                }
                return request(app)
                    .patch(`/tournament/${eid}`)
                    .send(entityPatch)
                    .then((response: any) => {
                        expect(response.statusCode).toEqual(200);
                        expect(response.body.scheduledEndDate).toEqual(entityPatch.scheduledEndDate);
                    });
            });
        });
    })
});