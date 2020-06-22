process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const request = require('supertest');

const app = require('../../src/app');
const conn = require('../../src/database/config');

describe('v1 POST /signUp', () => {
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

    it('OK, creating a new user works', done => {
        request(app)
            .post('/api_v1/signup')
            .send({
                data: {
                    email: 'email@correo.com',
                    password: 'contraseña',
                },
            })
            .then(res => {
                const { body } = res;
                expect(body).to.contain.property('error');
                expect(body).to.contain.property('data');

                expect(body.error).to.equal('');
                expect(body.data.message).to.equal('Saved user');

                done();
            })
            .catch(err => done(err));
    });

    it('FAIL, signUp requires email', done => {
        request(app)
            .post('/api_v1/signup')
            .send({
                data: {
                    email: '',
                    password: 'contraseña',
                },
            })
            .then(res => {
                const { error } = res.body;
                expect(error.error).to.equal(true);
                done();
            })
            .catch(err => done(err));
    });

    it('FAIL, signUp requires password', done => {
        request(app)
            .post('/api_v1/signup')
            .send({
                data: {
                    email: 'correo@gmail.com',
                    password: '',
                },
            })
            .then(res => {
                const { error } = res.body;
                expect(error.error).to.equal(true);
                done();
            })
            .catch(err => done(err));
    });

    it('FAIL, signUp requires data', done => {
        request(app)
            .post('/api_v1/signup')
            .send({})
            .then(res => {
                const { error } = res.body;
                expect(error.error).to.equal(true);
                done();
            })
            .catch(err => done(err));
    });
});
