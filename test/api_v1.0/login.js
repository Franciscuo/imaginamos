process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../src/app');
const conn = require('../../src/database/config');


describe('v1 POST /signUp', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })



    it('OK, login user works', (done) => {
        request(app).post('/api_v1/signup')
            .send({
                "data": {
                    "email": "email@correo.com",
                    "password": "contraseña",
                    "type": 0
                }
            })
            .then(() => funLogin())
            .catch((e) => done(e))

        const funLogin = () => {
            request(app).post('/api_v1/login')
                .send({
                    "data": {
                        "email": "email@correo.com",
                        "password": "contraseña",
                    }
                })
                .then((res) => {
                    const body = res.body;
                    expect(body.error).to.equal("")
                    expect(body.data.login).to.equal(true)
                    done();
                })
                .catch((err) => done(err));
        }
    });


    it('FAIL, bad password works', (done) => {
        request(app).post('/api_v1/signup')
            .send({
                "data": {
                    "email": "email@correo.com",
                    "password": "contraseña",
                    "type": 0
                }
            })
            .then(() => funLogin())
            .catch((e) => done(e))

        const funLogin = () => {
            request(app).post('/api_v1/login')
                .send({
                    "data": {
                        "email": "email@correo.com",
                        "password": "contraseñas",
                    }
                })
                .then((res) => {
                    const error = res.body.error;
                    expect(error.error).to.equal(true)
                    done();
                })
                .catch((err) => done(err));
        }
    });

    it('FAIL, logIn requires email', (done) => {
        request(app).post('/api_v1/login')
            .send({
                "data": {
                    "email": "",
                    "password": "contraseña",
                }
            })
            .then((res) => {
                const error = res.body.error;
                expect(error.error).to.equal(true)
                done();
            })
            .catch((err) => done(err));
    });

    it('FAIL, logIn requires password', (done) => {
        request(app).post('/api_v1/login')
            .send({
                "data": {
                    "email": "correo@gmail.com",
                    "password": ""
                }
            })
            .then((res) => {
                const error = res.body.error;
                expect(error.error).to.equal(true)
                done();
            })
            .catch((err) => done(err));
    });

    it('FAIL, logIn requires data', (done) => {
        request(app).post('/api_v1/signup')
            .send({

            })
            .then((res) => {
                const error = res.body.error;
                expect(error.error).to.equal(true)
                done();
            })
            .catch((err) => done(err));
    });

})