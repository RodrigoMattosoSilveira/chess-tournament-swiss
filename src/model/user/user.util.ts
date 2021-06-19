import shortid from "shortid";
import {
    EMAIL_VALIDATION,
    USER_DEFAULT_CONSTANTS,
    USER_RATING,
    USER_RATING_STATE,
    USER_ROLE,
    USER_STATE
} from "./user.constants";
import {EmailValidationCodeT, patchableAttributes, requiredCreateAttributes} from "./user.interfaces";
import * as utils from "../../utils/utils";
import {DaoResult} from "../../common/generic.interfaces";
import userDao from "./user.dao";

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
     * lAddAttributeDefaults Fills up req.body generated attributes with their default values
     * @param req
     */
    lAddAttributeDefaults = (req: any) => {
        req.body.id =  shortid.generate();
        req.body.role = USER_DEFAULT_CONSTANTS.ROLE;
        req.body.rating = USER_DEFAULT_CONSTANTS.RATING;
        req.body.ratingState = USER_DEFAULT_CONSTANTS.RATING_STATE;
        req.body.state = USER_DEFAULT_CONSTANTS.STATE;
    }

    /**
     * lCreateEmailIsValid Validates whether a string is a valid email and, if so, is unique
     * @param email
     * @returns EmailValidationCodeT
     */
    lCreateEmailIsValid (email: string): EmailValidationCodeT {
        let emailValidationCode: EmailValidationCodeT = EMAIL_VALIDATION.VALID

        if (!utils.isValidEmail(email)) {
            emailValidationCode = EMAIL_VALIDATION.INVALID
        } else {
            if (this.lEmailExists(email)) {
                emailValidationCode = EMAIL_VALIDATION.ALREADY_EXISTS;
            }
        }
        // console.log("lCreateEmailIsValid: " + email + ", results in: " + emailValidationCode)
        return emailValidationCode;
    }

    /**
     * lEmailExists Searches the database for an entity with the given email
     * @param email, the email of the sought entity
     * @returns boolean, true if an entity with this email exists, false otherwise
     */
    lEmailExists (email: string): boolean {
          return userDao.emailExists(email);
    }

    /**
     * lEntityExists Searches the database for an entity with the given id
     * @param id, the id of the sought entity
     * @returns boolean, true if an entity with this id exists, false otherwise
     */
    lEntityExists (id: string): boolean {
        return userDao.idExists(id);
    }

    /**
     * lHasRequiredCreateAttributes
     * @param body - the request body attributes
     * @returns string, empty if all required attributes are present, the list of missing attributes otherwise
     */
    lHasRequiredCreateAttributes (body: any): string {
        let errorMessage: string = "";
        let bodyKeys = Object.keys(body);
        for (let requiredAttribute of requiredCreateAttributes) {
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
            if (requiredCreateAttributes.findIndex(key => key===bodyKey) === -1) {
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
            if (patchableAttributes.findIndex(key => key===bodyKey) === -1) {
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
            if (patchableAttributes.findIndex(key => key===bodyKey) === -1) {
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
}