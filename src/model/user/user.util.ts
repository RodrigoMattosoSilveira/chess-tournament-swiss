//TODO consider changing it from a singleton, to be a module that exports functions
import shortid from "shortid";
import {
    USER_DEFAULT_CONSTANTS,
    USER_RATING,
    USER_RATING_STATE,
    USER_ROLE,
    USER_STATE
} from "./user.constants";
import {USER_PATCH_KEYS, USER_CREATE_KEYS} from "./user.interfaces";
import userDao from "./user.dao";
import {IUserMongoDoc} from "./user-mongo";
import {UserDto} from "./user.interfaces";
import { USER_DTO_KEYS } from "./user.interfaces";

//TODO refactor all function names to remove their l prefix
export class UserUtil {
    private static instance: UserUtil;

    static getInstance() {
        if (!UserUtil.instance) {
            UserUtil.instance = new UserUtil();
        }
        return UserUtil.instance;
    }
    //****************************** Auxiliary methods for testing purposes *******************************************
    /**
     * lAddAttributeDefaults Fills up default attributes
     * @param resource
     */
    lAddAttributeDefaults = (resource: UserDto) => {
        resource.id =  shortid.generate();
        resource.role = USER_DEFAULT_CONSTANTS.ROLE;
        resource.rating = USER_DEFAULT_CONSTANTS.RATING;
        resource.ratingState = USER_DEFAULT_CONSTANTS.RATING_STATE;
        resource.state = USER_DEFAULT_CONSTANTS.STATE;
    }

    /**
     * lEmailExists Searches the database for an entity with the given email
     * @param email, the email of the sought entity
     * @returns boolean, true if an entity with this email exists, false otherwise
     */
    async lEmailExists (email: string): Promise<boolean> {
          return await userDao.emailExists(email);
    }

    /**
     * lEntityExists Searches the database for an entity with the given id
     * @param id, the id of the sought entity
     * @returns boolean, true if an entity with this id exists, false otherwise
     */
    async lEntityExists (id: string): Promise<boolean> {
        return await userDao.idExists(id);
    }

    /**
     * lRoleIsValid, the user role
     * @param role
     * @returns boolean, true if roles valid,false otherwise
     */
    lRoleIsValid(role: string): boolean {
        let valid: boolean = true;
        const upperCaseRole = role.toUpperCase();
        let roles = Object.keys(USER_ROLE);
        const upperCaseRoles = roles.map(x => x.toUpperCase());
        if (upperCaseRoles.findIndex(key => key===upperCaseRole) === -1) {
            valid = false
        }
        return valid;
    }

    /**
     * lRatingIsValid, must be numeric, and be between USER_RATING.MINIMUM and USER_RATING.MAXIMUM
     * @param rating, empty string is valid, error message otherwise
     */
    lRatingIsValid(rating: string): string {
        let errorMessage: string = "";
        const nRating: number = +rating;
        if (nRating < USER_RATING.MINIMUM) {
            errorMessage = "User rating, " + rating + ", is less than minimum, " + USER_RATING.MINIMUM;
        } else {
            if (nRating > USER_RATING.MAXIMUM) {
                errorMessage = "User rating, " + rating + ", is greater than maximum, " + USER_RATING.MAXIMUM;
            }
        }
        return errorMessage
    }

    /**
     * lRatingStateIsValid, the user role
     * @param ratingState state
     * @returns boolean, true if rate state valid,false otherwise
     */
    lRatingStateIsValid(ratingState: string): boolean {
        let valid: boolean = true;
        const upperCaseRatingState = ratingState.toUpperCase();
        let ratingStates = Object.keys(USER_RATING_STATE);
        const upperCaseRatingStates = ratingStates.map(x => x.toUpperCase());
        if (upperCaseRatingStates.findIndex(key => key===upperCaseRatingState) === -1) {
            valid = false
        }
        return valid;
    }

    lStateIsValid(state: string) : boolean {
        let valid: boolean = true;
        const upperCaseState = state.toUpperCase();
        let states = Object.keys(USER_STATE);
        const upperCaseStates = states.map(x => x.toUpperCase());
        if (upperCaseStates.findIndex(key => key===upperCaseState) === -1) {
            valid = false
        }
        return valid;
    }

    fromMongoToUser(mongo: IUserMongoDoc): UserDto  {
        let user: UserDto = {email: "", firstName: "", lastName: "", password: ""};
         USER_DTO_KEYS.forEach(el => {
             // @ts-ignore
             el !== "password" ? mongo[el] ? user[el] = mongo[el] : null : null;
        })
        return  user;
    }
}