const success = (res, data, status) => {
    res.header({
            'custom-header': '',
        }) /
        res.status(status || 200).send({
            // si esta indefined status, responde 200
            error: '',
            data,
        });
};

const error = (res, message, status) => {
    res.status(status || 500).send({
        error: {
            error: true,
            message,
        },
        data: '',
    });
};

module.exports = { success, error };