self.onmessage = (e) => {
    switch (e.data.message) {
        case "filter":
            applyFilter(e.data.data, e.data.filters);
            break;
        default:
            console.log("Unknown message")
    }
    self.postMessage(e.data);
}


const applyFilter = (data: any, filters: string) => {
    try {
        const filterstring = filters;
        data['visibility'] = filterstring ? eval(filterstring) : true;
    } catch (err) {
        data['visibility'] = true;
    }
}