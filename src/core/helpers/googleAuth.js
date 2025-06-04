export const verifyGoogleToken = async (access_token) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return await response.json();
}