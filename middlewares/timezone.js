
export const localToUTC = (localTime)=>{
    try {
    const localDate = new Date(localTime);

    const localOffset = localDate.getTimezoneOffset();
    
    const localOffsetMs = localOffset * 60 * 1000;
    
    const utcDate = new Date(localDate.getTime() + localOffsetMs);
    const utcDateStr = utcDate.toISOString();
    return utcDateStr
} catch (error) {
        throw new Error(error)
}
    
}

