export const sendResetEmail = async (
    email : string,
    resetLink: string 
) => {
    console.log("Sending Email to ", email);
    console.log("Reset Link: ", resetLink);
}