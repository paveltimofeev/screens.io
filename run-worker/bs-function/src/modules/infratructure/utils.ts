
export const safeParse = <T>(strData:string, defValue:T) => {

    try {
        return JSON.parse(strData) as T;
    }
    catch (err) {
        console.error('[safeParse] ERROR', err);
        return defValue;
    }
};
