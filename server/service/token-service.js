const jwt = require('jsonwebtoken');
const tokenM = require('../modules/token-module');

class TokenS{
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCES_SECRET,{expiresIn:'30m'});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'15d'});

        return{
            accessToken,
            refreshToken
        }
    }

    validateAccesToken(token){
        try {
             const userData = jwt.verify(token, process.env.JWT_ACCES_SECRET);
             return userData
        } catch (error) {
            return null;
        }
    }
    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData
        } catch (error) {
            
        }
    }
    
    async saveToken(userId,refreshToken){
        const tokenCandidate = await tokenM.findOne({user:userId});

        if(tokenCandidate){
            tokenCandidate.refreshToken = refreshToken;
            return tokenCandidate.save();
        }
        const token = await tokenM.create({user:userId, refreshToken});
        return token;
    }
    async removeToken(refreshToken){
        const TokenData = await tokenM.deleteOne({refreshToken});
        return TokenData;
    }
    async findToken(refreshToken){
        const TokenData = await tokenM.findOne({refreshToken});
        return TokenData;
    }
}

module.exports = new TokenS();