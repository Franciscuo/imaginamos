process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../src/app');
const conn = require('../../src/database/config');


describe('v1 POST /logOut', () => {
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


    it('OK, logOut user works', (done) => {
        request(app).post('/api_v1/signup')
            .send({
                "data": {
                    "email": "email@correo.com",
                    "password": "contraseña",
                    "type": 0
                }
            })
            .then(() => funLogin(funLogout))
            .catch((e) => done(e))

        const funLogin = (cb) => {
            request(app).post('/api_v1/login')
                .send({
                    "data": {
                        "email": "email@correo.com",
                        "password": "contraseña",
                    }
                })
                .then((res) => {
                    cb(res.body.data);
                })
                .catch((err) => done(err));
        }

        const funLogout = (res) => {
            request(app).post('/api_v1/logout')
                .send({
                    "data": {
                        "id": res.user_id
                    }
                })
                .set('Authorization', res.refreshToken)
                .then((res) => {
                    const body = res.body;
                    expect(body.error).to.equal("")
                    expect(body.data.message).to.equal("Close session successfully")
                    done();
                })
                .catch((err) => done(err));
        }
    })

    it('FAIL, logOut user need data', (done) => {
        request(app).post('/api_v1/signup')
            .send({
                "data": {
                    "email": "email@correo.com",
                    "password": "contraseña",
                    "type": 0
                }
            })
            .then(() => funLogout(funLogin()))
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
                    return res
                })
                .catch((err) => done(err));
        }

        const funLogout = () => {
            request(app).post('/api_v1/logout')
                .send({

                })
                .then((res) => {
                    const error = res.body.error;
                    expect(error.error).to.equal(true)
                    done();
                })
                .catch((err) => done(err));
        }
    })

});