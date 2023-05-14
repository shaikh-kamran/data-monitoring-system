import { Server } from "socket.io";

const socketport = process.env.SOCKETPORT || 3000;
const datainterval = process.env.DATAINTERVAL || 1000;

const tabledata = [];
const sockets = {};

const sendData = (socket, data) => {
    console.log("Update send to ", socket.id);
    socket.emit("data", data);
}

const sendSnapShotToGUI = (socket) => {
    console.log("Snapshot send to ", socket.id, tabledata.length);
    if (tabledata.length) {
        tabledata.forEach(row => {
            socket.emit("data", row);
        });
    }
}

const genrateData = () => {

    const totalRows = 100;
    let rows = Array(totalRows).fill().map((_, index) => index);

    rows.forEach((row, index) => {

        const totalColumns = 100;
        let tags = Array(totalColumns).fill().map((_, index) => index);
        const data = {}
        var today = new Date();
        data["id"] = index + 1;
        data["timestamp"] = today.getMinutes() + ":" + today.getSeconds();
        tags.forEach(number => {
            data["Tag" + number] = "TagNo" + number + today.getSeconds();
            data["Metric" + number] = today.getMinutes() + today.getSeconds();
        });
        // console.log("Sent at", data["id"], today.getMinutes() + ":" + today.getSeconds());
        tabledata[index] = data;

        Object.values(sockets).forEach(socket => {
            sendData(socket, data);
        });

    });



}

async function init() {

    try {

        const io = new Server(socketport, {
            path: '/socket',
            perMessageDeflate: false,
            pingTimeout: 60 * 1000,
            maxHttpBufferSize: 1e8
        });

        io.on('connection', (socket) => {

            console.log(`New client connected: ${socket.id}`);
            sendSnapShotToGUI(socket);

            sockets[socket.id] = socket;
            socket.on('error', (err) => {
                console.log(`err: ${err}`);
                delete sockets[socket.id];
            });

        });

        io.on('error', (err) => {
            console.log('err', err);
        });

        setInterval(() => { genrateData(); }, datainterval);

    } catch (err) {
        console.log(err);
    }

}

init();