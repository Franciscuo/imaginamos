const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            description: 'API para plataforma de mantenimiento de TVs',
            version: '1.0.0',
            title: 'TV mantenimiento API',
            contact: {
                name: 'Francisco Lopez',
                email: 'francisco-9708@hotmail.es',
            },
        },
        host: 'virtserver.swaggerhub.com',
        basePath: '/Franciscuo/test2/1.0.0',
        tags: [{
            name: 'Desarrolladores',
            description: 'Operaciones disponibles para desarrolladores',
        }, ],
        schemes: ['https'],
        paths: {
            '/signup': {
                post: {
                    tags: ['Desarrolladores'],
                    summary: 'Registra un nuevo usuario',
                    description: 'Pasando un correo no registrado y una contraseña se genera un nuevo \nusuario en el sistema\n',
                    operationId: 'nuevoUsuario',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [{ in: 'body',
                        name: 'Data nuevo usuario',
                        description: 'Email y password asociados al nuevo usuario, tipo de usuario, 0 si es cliente y 1 si es tecnico.',
                        required: false,
                        schema: {
                            $ref: '#/definitions/UserModel',
                        },
                    }, ],
                    responses: {
                        '201': {
                            description: 'Nuevo usuario registrado',
                            schema: {
                                $ref: '#/definitions/SavedUser',
                            },
                        },
                        '400': {
                            description: 'Parametros incorrectos',
                            schema: {
                                $ref: '#/definitions/PasswordShort',
                            },
                        },
                        '409': {
                            description: 'Usuario  ya registrado',
                            schema: {
                                $ref: '#/definitions/EmailAlready',
                            },
                        },
                        '500': {
                            description: 'Error interno del servidor',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                    },
                },
            },
            '/login': {
                post: {
                    tags: ['Desarrolladores'],
                    summary: 'Iniciar sesion',
                    description: 'Pasando las credenciales correctas de una cuenta registrada se inicia sesion',
                    operationId: 'iniciarSesion',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [{ in: 'body',
                        name: 'Data usuario',
                        description: 'Email y password asociados al usuario registrado.',
                        required: false,
                        schema: {
                            $ref: '#/definitions/UserModel',
                        },
                    }, ],
                    responses: {
                        '200': {
                            description: 'Sesion iniciada',
                            schema: {
                                $ref: '#/definitions/validPass',
                            },
                        },
                        '400': {
                            description: 'Parametros de entrada invalidos',
                            schema: {
                                $ref: '#/definitions/UserNotFound',
                            },
                        },
                        '401': {
                            description: 'Contraseña incorrecta',
                            schema: {
                                $ref: '#/definitions/noValidPass',
                            },
                        },
                        '500': {
                            description: 'Error interno del servidor',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                    },
                },
            },
            '/logout': {
                post: {
                    tags: ['Desarrolladores'],
                    summary: 'Cerrar sesion',
                    description: 'Pasando el token de refresco y el ID, cierra sesion el usuario',
                    operationId: 'cerrarSesion',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [{ in: 'body',
                        name: 'Data usuario',
                        description: 'Id asociados al usuario registrado.',
                        required: false,
                        schema: {
                            $ref: '#/definitions/closeSesion',
                        },
                    }, ],
                    responses: {
                        '200': {
                            description: 'Sesion cerrada',
                            schema: {
                                $ref: '#/definitions/validPass',
                            },
                        },
                        '400': {
                            description: 'Parametros de entrada invalidos',
                            schema: {
                                $ref: '#/definitions/failLogout',
                            },
                        },
                        '500': {
                            description: 'Error interno del servidor',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                    },
                    security: [{
                        refreshToken: [],
                    }, ],
                },
            },
        },
        securityDefinitions: {
            refreshToken: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
            accessToken: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        definitions: {
            closeSesion: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        type: 'string',
                        example: '',
                    },
                    data: {
                        $ref: '#/definitions/closeSesionDos',
                    },
                },
            },
            closeSesionDos: {
                required: ['message'],
                properties: {
                    message: {
                        type: 'string',
                        example: 'Close session successfully',
                    },
                },
            },
            failLogout: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        $ref: '#/definitions/failLogoutDos',
                    },
                    data: {
                        type: 'string',
                        example: '',
                    },
                },
            },
            failLogoutDos: {
                required: ['error', 'message'],
                properties: {
                    error: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'Failed token to logout',
                    },
                },
            },
            validPass: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        type: 'string',
                        example: '',
                    },
                    data: {
                        $ref: '#/definitions/validPassDos',
                    },
                },
            },
            validPassDos: {
                required: ['accessToken', 'login', 'refreshToken', 'user_id'],
                properties: {
                    login: {
                        type: 'boolean',
                        example: true,
                    },
                    accessToken: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                    },
                    refreshToken: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                    },
                    user_id: {
                        type: 'string',
                        example: '5ef05f705a40f3ed0dadc8c0',
                    },
                },
            },
            noValidPass: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        $ref: '#/definitions/noValidPassDos',
                    },
                    data: {
                        type: 'string',
                        example: '',
                    },
                },
            },
            noValidPassDos: {
                required: ['error', 'message'],
                properties: {
                    error: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'wrong password',
                    },
                },
            },
            UserNotFound: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        $ref: '#/definitions/UserNotFoundDos',
                    },
                    data: {
                        type: 'string',
                        example: '',
                    },
                },
            },
            UserNotFoundDos: {
                required: ['error', 'message'],
                properties: {
                    error: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'User not found',
                    },
                },
            },
            PasswordShort: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        $ref: '#/definitions/PasswordShortDos',
                    },
                    data: {
                        type: 'string',
                        example: '',
                    },
                },
            },
            PasswordShortDos: {
                required: ['error', 'message'],
                properties: {
                    error: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'Password too short',
                    },
                },
            },
            Error: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        $ref: '#/definitions/ErrorDos',
                    },
                    data: {
                        type: 'string',
                        example: '',
                    },
                },
            },
            ErrorDos: {
                required: ['error', 'message'],
                properties: {
                    error: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'Internal Server Error',
                    },
                },
            },
            EmailAlready: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        $ref: '#/definitions/EmailAlreadyDos',
                    },
                    data: {
                        type: 'string',
                        example: '',
                    },
                },
            },
            EmailAlreadyDos: {
                required: ['error', 'message'],
                properties: {
                    error: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'This email is already registered',
                    },
                },
            },
            SavedUser: {
                required: ['data', 'error'],
                properties: {
                    error: {
                        type: 'string',
                        example: '',
                    },
                    data: {
                        $ref: '#/definitions/MessageSaves',
                    },
                },
            },
            MessageSaves: {
                required: ['message'],
                properties: {
                    message: {
                        type: 'string',
                        example: 'Saved user',
                    },
                },
            },
            UserModel: {
                required: ['data'],
                properties: {
                    data: {
                        $ref: '#/definitions/UserModelDos',
                    },
                },
            },
            UserModelDos: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        example: 'correo@gmail.com',
                    },
                    password: {
                        type: 'string',
                        example: 'contraseña',
                    },
                },
            },
            UserModelId: {
                required: ['data'],
                properties: {
                    data: {
                        $ref: '#/definitions/UserModelIdDos',
                    },
                },
            },
            UserModelIdDos: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: {
                        type: 'string',
                        example: '5eef1196042e5899f106f490',
                    },
                },
            },
        },
    },
    apis: ['../api/*js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };