process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');

const app = require('../../src/app');
const conn = require('../../src/database/config');

const login = () => {
    return new Promise((resolve, reject) => {
        request(app)
            .post('/api_v1/login')
            .send({
                data: {
                    email: 'email@correo.com',
                    password: 'contraseña',
                },
            })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
const newUser = () => {
    return new Promise((resolve, reject) => {
        request(app)
            .post('/api_v1/signup')
            .send({
                data: {
                    email: 'email@correo.com',
                    password: 'contraseña',
                    type: 0,
                },
            })
            .then(() => {
                login().then(data => {
                    resolve(data);
                });
            })
            .catch(err => {
                reject(err);
            });
    });
};
const newTechnical = () => {
    return new Promise((resolve, reject) => {
        request(app)
            .post('/api_v1/signup')
            .send({
                data: {
                    email: 'tecnico@correo.com',
                    password: 'contraseña',
                    type: 1,
                },
            })
            .then(() => {
                newUser().then(data => {
                    resolve(data);
                });
            })
            .catch(err => {
                reject(err);
            });
    });
};

describe('v1 POST / newTicket', () => {
    before(done => {
        conn.connect()
            .then(() => done())
            .catch(err => done(err));
    });

    after(done => {
        conn.close()
            .then(() => done())
            .catch(err => done(err));
    });

    it('OK, newTicket work', done => {
        newTechnical()
            .then(data => {
                request(app)
                    .post('/api_v1/newTicket')
                    .send({})
                    .set('Authorization', data.body.data.accessToken)
                    .then(res => {
                        const { body } = res;
                        expect(body.error).to.equal('');
                        expect(body.data.message).to.equal('Saved ticket');
                        done();
                    });
            })
            .catch(err => done(err));
    });

    it('FAIL, newTicket need accesToken', done => {
        newTechnical()
            .then(() => {
                request(app)
                    .post('/api_v1/newTicket')
                    .send({})
                    .set('Authorization', '')
                    .then(res => {
                        const { error } = res.body;
                        expect(error.error).to.equal(true);
                        done();
                    });
            })
            .catch(err => done(err));
    });
});