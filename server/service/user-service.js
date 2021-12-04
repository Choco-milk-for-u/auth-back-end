const User = require('../modules/User');
const hash = require('bcrypt');
const uuid = require('uuid');

const mailService = require('./email.service');
const tokenService = require('./token-service');
const userDto = require('../dtos/user-dtos');

const ApiError = require('../expections/api-error');
const ApiErrors = require('../expections/api-error');
const UserDto = require('../dtos/user-dtos');

class UserS{
    async regist(email,password){
        const candidate = await User.findOne({email});
        if(candidate){
            throw ApiError.badRequest('User already has registered');
        }

        const hashedPassword = await hash.hash(password, 4);
        const activationLink = uuid.v4();
        const fullUser = await User.create({email,password:hashedPassword,isActivation:false,activationLink});

        await mailService.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`);

        const userPayload = new userDto(fullUser);
        const tokens = tokenService.generateTokens({...userPayload});

        await tokenService.saveToken(userPayload.id,tokens.refreshToken);

        return{
            ...tokens,
            user: userPayload
        }
    }
    async activate(activation){
        const takeUser = await User.findOne({activationLink:activation});

        if(!takeUser){
            throw ApiError.badRequest('User doesnt exist');
        }
        takeUser.isActivation = true;
        await takeUser.save();
    }
    async login(email,password){
        const user = await User.findOne({email});
        if(!user){
            throw ApiErrors.badRequest('User hasnt been find');
        }

        const isMatch = await hash.compare(password,user.password);
        if(!isMatch){
            throw ApiErrors.badRequest('inCorrect Paswword');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        
        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async logout(refresh){
        const token = await tokenService.removeToken(refresh);
        return token;
    }
    async refresh(refresh){
        if(!refresh){
            throw ApiError.unAthorization();
        }
        const userData = tokenService.validateRefreshToken(refresh);
        const isInDB = tokenService.findToken(refresh);
        if(!userData || !isInDB){
            throw ApiError.unAthorization();
        }
        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        
        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }
    async getUsers(){
        const users = User.find();
        return users;
    }
}

module.exports = new UserS();