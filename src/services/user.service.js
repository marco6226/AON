const User = require("../models/user");
const aes = require('../helpers/aes.cipher');
const Status = require('../helpers/status.enum');


const userService = {

    getById: async function (id) {
        return await User.findOne({
            _id: id,
            status: Status.ENABLED
        }, {
            status: false,
            password: false,
            secretAnswer: false,
            __v: false,
        });
    },

    getByIdForAdmin: async function (id) {
        return await User.findOne({
            _id: id,
        }, {
            password: false,
            secretAnswer: false,
            __v: false,
        });
    },

    getForAuth: async function (id) {
        return await User.findOne({
            _id: id,
            status: Status.ENABLED
        }, {
            password: true,
            role: true,
        });
    },

    getByUsername: async function (username) {
        return await User.findOne({
            username: username,
            status: Status.ENABLED
        }, {
            documentType: true,
            documentNumber: true,
            username: true,
            email: true,
            role: true,
            password: true
        });
    },

    getAll: async function (conditions = {}) {
        let matchFilter = {};

        if (conditions.searchString) {
            conditions.searchString = conditions.searchString.trim();

            let searchStringRegex = {
                $regex: new RegExp(conditions.searchString, 'i')
            }

            matchFilter = {
                $or: [
                    { documentNumber: searchStringRegex },
                    { firstName: searchStringRegex },
                    { secondName: searchStringRegex },
                    { firstSurname: searchStringRegex },
                    { secondSurname: searchStringRegex },
                    { gender: searchStringRegex },
                    { address: searchStringRegex },
                    { phoneNumbers: searchStringRegex },
                    { email: searchStringRegex },
                    { username: searchStringRegex },
                ],
                status: { $ne: Status.DELETED }
            }
        }

        if (!conditions.limit) conditions.limit = 10;
        if (!conditions.skip) conditions.skip = 0;
        if (!conditions.sortBy) conditions.sortBy = { lastTimeModified: -1 };

        let users = await User.find(matchFilter, {
            password: false,
            secretAnswer: false,
            __v: false,
        }).skip(conditions.skip).limit(conditions.limit).sort(conditions.sortBy);

        return users;
    },

    create: async function (user) {
        console.log(user.password);
        user.password = aes.encrypt(user.password);
        user.status = Status.DISABLED;
        user = new User(user);
        user.lastTimeModifiedBy = user._id;

        await user.save();

        // Filtrando campos que no se devolverán
        const { 
            password, 
            secretAnswer, 
            secretQuestion, 
            __v, 
            role, 
            status, 
            ...filteredUser 
        } = user.toObject();

        return filteredUser;
    },

    update: async function (user, modifierId) {
        user.lastTimeModifiedBy = modifierId;
        user.lastTimeModified = new Date();
        
        user.password = aes.encrypt(user.password)
        // Se previene el cambio de los siguientes valores y se limpian los datos q se pueden devolver
        const {   creationDate, __v, ...userToUpdate } = user;
        console.log(user);
        const result = await User.updateOne({ _id: user._id }, { $set: userToUpdate });

        return result.nModified > 0 ? userToUpdate : null;
    },

    delete: async function (userId, modifierId) {
        const user = await this.update({
            _id: userId,
            status: Status.DELETED
        }, modifierId);

        return user != null;
    }
}

module.exports = userService;