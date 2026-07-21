const getNotes = (req, res) => {
    const notes = [
        {
            id: 1,
            title: "Learn Express",
            content: "Understand routes and controllers"
        },
        {
            id: 2,
            title: "Build SyncSpace",
            content: "Create a collaborative note app"
        }
    ];

    res.json(notes);
};

module.exports = {
    getNotes,
};