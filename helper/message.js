const validationMessages ={
    "EMAIL_VALIDATION":"email is required",
    "NUMBER_VALIDATION":"Phone number is required",
    "NUMBER_LENGTH_VALIDATION":"Minimum  lenght should  be 10",
    "USERNAME_VALIDATION":"Username is required",
    "PASSWORD_VALIDATION":"Password is required",
    "PASSWORD_LENGTH_VALIDATION":"Password muat be at least char",
    "LOGIN_TYPE_VALIDATION":"Login typpe  is required",
    "TOKEN_MESSAGE":"token not found",
    "USER_NOT_EXIST":"user not exist",
    "INVALID_USER":"user is invalid",
    "REQUIRED_FIELD":"required field",

}

const errorResponseMessages= {
    "SOMETHING_WENT_WRONG":"Something went wrong",
    "VALIDATION_ERROR":"Validation error",
    "ALREADY_EXIST":"Phone no,email or username already exist",
    "USER_VALIDATION":"user or password is not valid",
    "FIELD_VALIDATION":"Please provide all fields",
    "UPLOAD_ERROR":"Error in upload",
    "PLAN_EXISTS":"Plan already is exist",
    "YOUR_EMAIL_IS_NOT_VERIFIED":"email is not verified",
    "INTERNAL_SERVER_ERROR":"server error",
    "CONFPPASSWORD_NOT_MATCHED":"password not matched",
    "EXCERCISE_ID_IS_REQUIRED":"Excercise id is required",
    "USER_NOT_FOUND":"user not found",
    "YOUR_EMAIL_IS_NOT_VERIFIED":"email not verified",
    "PROFILE_IMAGE_REQ":"profile picture is required",
    "CHALLENGE_NOT_FOUND":"challenge not found",
    "CATEGORY_EXISTS":"category already  exist",
    "NO_FILE_UPLOADED":"no fileuploaded"
}

const successResponseMessages={
    "LOGIN_SUCCESSFULL":"Login successfully",
    "SIGNUP_SUCCESSFULL":"Sign-up successfully",
    "PLAN_CREATED":"Plan created successfully",
    "PLAN_GET":"Plan is getting",
    "SAVE_WEIGHT":"Weekly weight created",
    "REQUEST_SEND":"Request Send Successfully",
    "GETTING_EXCERCISE":"get excercise",
    "YOUR_EMAIL_HAS_BEEN_VERIFIED":"email verified",
    "PASSWORD_CHANGED_SUCCESSFULLY":"password change Successfully",
    "PROFILE_UPDATED":"user profile is updated",
    "ACCOUNT_DELETED":"Account deleted successfully!!"
}



module.exports = {
    validationMessages:validationMessages,
    errorResponseMessages:errorResponseMessages,
    successResponseMessages:successResponseMessages,
}