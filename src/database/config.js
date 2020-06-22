const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

function connect() {
    return new Promise(async (resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            const uri = await mongod.getConnectionString();
            mongoose
                .connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            mongoose
                .connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
            mongoose.connection.once('open', () => {
                console.log('DB is connected');
            });
        }
    });
}

async function close() {
    await mongoose.connection.close();
    await mongod.stop();
    return mongoose.disconnect();
}

module.exports = { connect, close };
