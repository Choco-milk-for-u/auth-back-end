const ApiError = require('../expections/api-error')
const tokenService = require('../service/token-service');

module.exports = function(req,res,next){
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return next(ApiError.unAthorization());
        }
        const accesToken = authHeader.split(' ')[1];

        if(!accesToken){
            return next(ApiError.unAthorization());
        }

        const isValid = tokenService.validateAccesToken(accesToken);
        if(!isValid){
            return next(ApiError.unAthorization());
        }

        req.user = isValid;
        next();

    } catch (error) {
        return next(ApiError.unAthorization());
    }
}