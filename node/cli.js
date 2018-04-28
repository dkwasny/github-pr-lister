module.exports.createArgParser = (config) => {
    const configPrototype = {};
    for (const key in config) {
        configPrototype[key] = null;
    }

    return (argArray) => {
        const retVal = Object.setPrototypeOf({}, configPrototype);

        for (let i = 0; i < argArray.length; i++) {
            const rawArg = argArray[i];

            if (rawArg.startsWith('-') && rawArg.length > 1) {
                const arg = rawArg.substr(1);
                const expectValue = config[arg];

                if (expectValue === undefined) {
                    throw `Unknown parameter: ${arg}`;
                }
                else if (expectValue) {
                    const possibleValue = argArray[i + 1];
                    if (possibleValue === undefined || possibleValue.startsWith('-')) {
                        throw `Expected a value for argument: ${arg}`;
                    }
                    retVal[arg] = possibleValue;
                    i++;
                }
                else {
                    retVal[arg] = true;
                }
            }
        }

        return retVal;
    };
};
