const moment = require("moment");
const { Token } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} user_id
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const createToken = async (tokenData) => {
    try {
        const token = new Token({
            ...tokenData
        });
        return await token.save();
    } catch (error) {
        console.log(error, "it's error in save token function");
        return null
    }
};

const findTokenById = async (id) => {
    const tokenDoc = await Token.findOne({where: {id}})
    return tokenDoc
}

const findToken = async (query) => {
    try {
        const tokenDoc = await Token.findOne({
            where: query
        })
        return tokenDoc
    } catch (error) {
        console.log(error, "There is some error in finding token!");
        throw Error("Something went wrong!")        
    }
}

const findTokenByuser_id = async (id) => {
    try {
        const tokenDoc = await Token.findOne({
            where: {
                user_id: id
            }
        })
        return tokenDoc
    } catch (error) {
        console.log(error, "error in find token by user id");        
    }
}
const updateTokenById = async (tokenId, data) => {
    try {
        const updateToken = await Token.update(data,{
            where: {
              id:tokenId
            }
        });
        return updateToken;
    } catch (error) {
        console.log(error, "error in update token by id!");        
    }
    
};
const deleteTokenById = async (query) => {

    try {
        const deleteToken = await Token.destroy({
            where: query
        });
        return deleteToken;
    } catch (error) {
        console.log(error, "error in delete token b iyd!");        
    }
    
};

const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type
    };
    return jwt.sign(payload, secret);
};
const generateAuthTokens = (user) => {
    const accessTokenExpires = moment().add(
        process.env.ACCESS_EXPIRATION_MINUTES,
        "months"
    );
    const accessToken = generateToken(
        user.id,
        accessTokenExpires,
        "Access"
    );

    return accessToken
}

module.exports = {
    createToken,
    findToken,
    findTokenById,
    findTokenByuser_id,
    updateTokenById,
    deleteTokenById,
    generateAuthTokens
}