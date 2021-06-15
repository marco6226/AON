function arrayOfObjectsToDictionary(array, keyAttribute = "_id") {
    let dictionary = {};
    for (const element of array) {
        dictionary[element[keyAttribute]] = element;
    }

    return dictionary;
}

module.exports = {arrayOfObjectsToDictionary};