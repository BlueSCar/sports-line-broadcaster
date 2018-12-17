(async () => {
    require('dotenv').config();

    const lines = await require('./lib/lines')();
    await require('./lib/rabbit')(lines);
})().catch(err => {
    console.error(err);
});