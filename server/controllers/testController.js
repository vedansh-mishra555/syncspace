const testApi = (req, res) => {
    res.json({
        success: true,
        message: "Welcome to SyncSpace Controller 🚀"
    });
};

module.exports = {
    testApi,
};