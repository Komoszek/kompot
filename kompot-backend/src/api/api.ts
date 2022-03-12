export const randomId = (length: number) => {
    const charset = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';

    return [...Array(length)].map(() => charset[Math.floor(Math.random() * charset.length)]).join('');
}