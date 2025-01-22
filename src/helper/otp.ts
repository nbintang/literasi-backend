export const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit OTP
export const genrateExpirationTime = () => new Date(Date.now() + 5 * 60 * 1000); // Generate a 5-minute expiration time
export const generateOTps = ( ) =>{
    const otp = generateOtp()
    const expiresAt = genrateExpirationTime()
    return {otp,expiresAt}
}