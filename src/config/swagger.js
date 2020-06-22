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
        tags: [
            {
                name: 'Desarrolladores',
                description: 'Operaciones disponibles para desarrolladores',
            },
        ],
        securityDefinitions: {
            refreshToken: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
            },
            accessToken: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
            },
        },
        paths: {
            '/signup': {
                post: {
                    tags: ['Desarrolladores'],
                    summary: 'Registra un nuevo usuario',
                    operationId: 'nuevoUsuario',
                    description:
                        'Pasando un correo no registrado en la base de datos "clientes" y una contraseña se genera un nuevo \nusuario en el sistema\n',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'Data nuevo usuario',
                            description:
                                'Email y password asociados al nuevo usuario.',
                            schema: {
                                $ref: '#/definitions/UserModel',
                            },
                        },
                    ],
                    responses: {
                        '201': {
                            description: 'Nuevo usuario registrado',
                            schema: {
                                $ref: '#/definitions/SuccessRequest',
                            },
                        },
                        '400': {
                            description: 'Parametros incorrectos',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                        '409': {
                            description: 'Usuario  ya registrado',
                            schema: {
                                $ref: '#/definitions/Error',
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
            '/addTechnical': {
                post: {
                    tags: ['Desarrolladores'],
                    summary: 'Añadir un nuevo tecnico',
                    operationId: 'nuevoTecnico',
                    description:
                        'Pasando un correo no registrado en la base de datos "tecnicos" se añade un nuevo \ntenico en el sistema\n',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'Data nuevo tecnico',
                            description: 'Email asociado al nuevo tecnico',
                            schema: {
                                $ref: '#/definitions/TechnicalModel',
                            },
                        },
                    ],
                    responses: {
                        '201': {
                            description: 'Nuevo tecnico agregado',
                            schema: {
                                $ref: '#/definitions/SuccessRequest',
                            },
                        },
                        '400': {
                            description: 'Parametros incorrectos',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                        '409': {
                            description: 'Tecnico  ya registrado',
                            schema: {
                                $ref: '#/definitions/Error',
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
                    operationId: 'iniciarSesion',
                    description:
                        'Pasando las credenciales correctas de una cuenta registrada se inicia sesion',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'Data usuario',
                            description:
                                'Email y password asociados al usuario registrado.',
                            schema: {
                                $ref: '#/definitions/UserModel',
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Sesion iniciada',
                            schema: {
                                $ref: '#/definitions/ValidPass',
                            },
                        },
                        '400': {
                            description: 'Parametros de entrada invalidos',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                        '403': {
                            description: 'Contraseña incorrecta',
                            schema: {
                                $ref: '#/definitions/Error',
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
                    operationId: 'cerrarSesion',
                    description:
                        'Pasando el token de refresco y el ID, cierra sesion el usuario',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    security: [
                        {
                            refreshToken: [],
                        },
                    ],
                    parameters: [
                        {
                            in: 'body',
                            name: 'Data usuario',
                            description: 'Id asociados al usuario registrado.',
                            schema: {
                                $ref: '#/definitions/Id',
                            },
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Sesion cerrada',
                            schema: {
                                $ref: '#/definitions/SuccessRequest',
                            },
                        },
                        '400': {
                            description: 'Parametros de entrada invalidos',
                            schema: {
                                $ref: '#/definitions/Error',
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
            '/newTicket': {
                post: {
                    tags: ['Desarrolladores'],
                    summary: 'Crea un nuevo ticket',
                    operationId: 'crearTicket',
                    description:
                        'Pasando el token de acceso el usuario crea un nuevo ticket asociado a su ID',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    security: [
                        {
                            accessToken: [],
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Ticket generado y guardado',
                            schema: {
                                $ref: '#/definitions/SuccessRequest',
                            },
                        },
                        '401': {
                            description: 'Token no valido',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                        '403': {
                            description: 'No header Token',
                            schema: {
                                $ref: '#/definitions/Error',
                            },
                        },
                        '409': {
                            description: 'Sistema sin tecnicos',
                            schema: {
                                $ref: '#/definitions/Error',
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
            '/dayTechnical': {
                get: {
                    tags: ['Desarrolladores'],
                    summary: 'Servicios de tecnico en el dia',
                    operationId: 'listarServicios',
                    description:
                        'De acuerdo al email del tecnico se regresan los servicios de mantenimiento asignados en el dia',
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'email',
                            in: 'query',
                            description: 'Email del tecnico',
                            required: true,
                            type: 'string',
                            collectionFormat: 'multi',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'Lista de servicios del tecnico',
                            schema: {
                                $ref: '#/definitions/DayTechnical',
                            },
                        },
                        '400': {
                            description: 'Correo no regrstrado',
                            schema: {
                                $ref: '#/definitions/Error',
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
        },
        definitions: {
            SuccessRequest: {
                required: ['error', 'data'],
                properties: {
                    error: {
                        type: 'string',
                        example: '',
                    },
                    data: {
                        type: 'object',
                        required: ['message'],
                        properties: {
                            message: {
                                type: 'string',
                                example: 'Success',
                            },
                        },
                    },
                },
            },
            ValidPass: {
                required: ['error', 'data'],
                properties: {
                    error: {
                        type: 'string',
                        example: '',
                    },
                    data: {
                        type: 'object',
                        required: [
                            'login',
                            'accessToken',
                            'refreshToken',
                            'user_id',
                        ],
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
                },
            },
            Error: {
                required: ['error', 'data'],
                properties: {
                    error: {
                        type: 'object',
                        required: ['error', 'message'],
                        properties: {
                            error: {
                                type: 'boolean',
                                example: true,
                            },
                            message: {
                                type: 'string',
                            },
                        },
                    },
                    data: {
                        type: 'string',
                        example: '',
                    },
                },
            },
            UserModel: {
                required: ['data'],
                properties: {
                    data: {
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
                },
            },
            TechnicalModel: {
                required: ['data'],
                properties: {
                    data: {
                        type: 'object',
                        required: ['email'],
                        properties: {
                            email: {
                                type: 'string',
                                example: 'tecnico@gmail.com',
                            },
                        },
                    },
                },
            },
            Id: {
                required: ['data'],
                properties: {
                    data: {
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
            DayTechnical: {
                required: ['error', 'data'],
                properties: {
                    error: {
                        type: 'string',
                        example: '',
                    },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    example: '5eef1196042e5899f106f490',
                                },
                                state: {
                                    type: 'string',
                                    example: 'technician assigned',
                                },
                                user: {
                                    type: 'object',
                                    properties: {
                                        email: {
                                            type: 'string',
                                            example: 'usuario@gmail.com',
                                        },
                                    },
                                },
                                date: {
                                    type: 'string',
                                    example: '2020-06-22T19',
                                },
                            },
                        },
                    },
                },
            },
        },
        host: 'localhost:3000',
        basePath: '/api_v1',
        schemes: ['http'],
    },
    apis: ['../api/*js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
