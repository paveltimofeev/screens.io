
export const throwIfInvalidPathPart = (name:string, pathPart:any) => {

    if (
        !pathPart ||
        typeof(pathPart) !== 'string' ||
        pathPart.length === 0 ||
        pathPart === ''
    ) {
        throw new Error( `Invalid path part: "${name}" = "${pathPart}"`)
    }
};


export const validateArray = (name:string, param:any) => {

    if (!param || param.length === 0) {
        throw new Error(`No "${name}" found. param=${ param }`)
    }
};


export const safeParse = <T>(strData:string, defValue:T) => {

    try {
        return JSON.parse(strData) as T;
    }
    catch (err) {
        console.error('[safeParse] ERROR', err);
        return defValue;
    }
};
