import {UserUtil} from "../user/user.util";
import {IUserCreate, USER_CREATE_KEYS} from "../user/user.interfaces";
import * as utils from "../../utils/utils";
import {ITournamentCreate, TOURNAMENT_CREATE_KEYS} from "./tournament.interfaces";

describe('Tournament Middleware Unit Tests', () => {
    let userUtil: UserUtil;
    it('User Middleware canonical unit test', async done => {
        expect(1 + 1).toEqual(2);
        done();
    });
    describe('required create attributes', () => {
        it('are present', async done => {
            let body: ITournamentCreate = {
                name: "Tournament Name"         // Must be unique and at least 15 characters long
            }
            let missingAttributes = utils.hasRequiredKeys(body, TOURNAMENT_CREATE_KEYS)
            expect(missingAttributes).toEqual("");
            done();
        });
        it('the name is missing', async done => {
            let body: any = {
                city: "New York"
            }
            let missingAttributes = utils.hasRequiredKeys(body, TOURNAMENT_CREATE_KEYS)
            expect(missingAttributes).toEqual("name");
            done();
        });
        it('the name and some others are present', async done => {
            let body: any = {
                name: "Tournament Name",
                city: "New York",
                rounds: 4
            }
            let missingAttributes = utils.hasRequiredKeys(body, TOURNAMENT_CREATE_KEYS)
            expect(missingAttributes).toEqual("");
            done();
        });
    });
    describe('only required create attributes', () => {
        it('the name is missing', async done => {
            let body: any = {
                name: "Tournament Name",        // Must be unique and at least 15 characters long
                city: "New York"
            }
            let missingAttributes = utils.hasOnlyRequiredKeys(body, TOURNAMENT_CREATE_KEYS)
            expect(missingAttributes).toEqual("city");
            done();
        });
        it('the name and some others are present', async done => {
            let body: any = {
                name: "Tournament Name",        // Must be unique and at least 15 characters long
                city: "New York",
                rounds: 4
            }
            let missingAttributes = utils.hasOnlyRequiredKeys(body, TOURNAMENT_CREATE_KEYS)
            expect(missingAttributes).toEqual("city, rounds");
            done();
        });
    });
});