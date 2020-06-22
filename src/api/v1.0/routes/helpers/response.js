const success = (res, data, status) => {
    res.header({
        'custom-header': '',
    }) /
        res.status(status || 200).send({
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
