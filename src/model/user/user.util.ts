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
     * lHasRequiredCreateAttributes
     * @param body - the request body attributes
     * @returns string, empty if all required attributes are present, the list of missing attributes otherwise
     */
    lHasRequiredCreateAttributes (body: any): string {
        let errorMessage: string = "";
        let bodyKeys = Object.keys(body);
        for (let requiredAttribute of USER_CREATE_KEYS) {
            if (bodyKeys.findIndex(key => key===requiredAttribute) === -1) {
                if (errorMessage.length > 0) {
                    errorMessage += ', ';
                }
                errorMessage += requiredAttribute;
            }
        }
        return errorMessage
    }

    /**
     * lHasOnlyRequiredCreateAttributes
     * @param body, the request body attributes
     * @returns string, empty if all body attributes are valid create attributes, the list of invalid body attributes
     * otherwise
     */
    lHasOnlyRequiredCreateAttributes(body: any): string {
        let errorMessage: string = "";
        let bodyKeys = Object.keys(body);
        for (let bodyKey of bodyKeys) {
            if (USER_CREATE_KEYS.findIndex(key => key===bodyKey) === -1) {
                if (errorMessage.length > 0) {
                    errorMessage += ', ';
                }
                errorMessage += bodyKey;
            }
        }
        return errorMessage
    }

    /**
     * lHasValidPatchAttributes
     * @param body, the request body attributes
     * @returns string, empty if all attributes are valid, the list of invalid attributes otherwise
     */
    lHasValidPatchAttributes(body: any): string {
        let errorMessage: string = "";
        let bodyKeys = Object.keys(body);
        for (let bodyKey of bodyKeys) {
            if (USER_PATCH_KEYS.findIndex(key => key===bodyKey) === -1) {
                if (errorMessage.length > 0) {
                    errorMessage += ', ';
                }
                errorMessage += bodyKey;
            }
        }
        return errorMessage
    }

    /**
     * lHasOnlyValidPatchAttributes
     * @param body, the request body attributes
     * @returns string, empty if all body attributes are valid patch attributes are valid, the list of invalid
     * body attributes otherwise
     */
    lHasOnlyValidPatchAttributes(body: any): string {
        let errorMessage: string = "";
        let bodyKeys = Object.keys(body);
        for (let bodyKey of bodyKeys) {
            if (USER_PATCH_KEYS.findIndex(key => key===bodyKey) === -1) {
                if (errorMessage.length > 0) {
                    errorMessage += ', ';
                }
                errorMessage += bodyKey;
            }
        }
        return errorMessage
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
        return  {
            id: mongo.id,
            firstName: mongo.firstName,
            lastName: mongo.lastName,
            email: mongo.email,
            password: `No way Jose`,
            rating: mongo.rating,
            state: mongo.state
        }
    }
}