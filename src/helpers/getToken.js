const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token não fornecido ou malformado');
    }
    return authHeader.split(' ')[1];
};

export default getToken;