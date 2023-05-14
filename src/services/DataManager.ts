import { placeInAscSorted, placeInDescSorted } from '../utils/helpers'
const socketWorker = new Worker('src/workers/worker.ts');

/**
 * Creates a Grid data manager
 * which add, updates, sorts, filters the grid data
 * @class
 */
class DataManager {
    headers: any;
    data: any;
    idMap: any;
    sortColumn: any;
    worker: any;

    constructor() {
        this.headers = [];
        this.data = [];
        this.idMap = {};
        this.sortColumn = { column: null, direction: 1 };
        this.setSortColumn();
        this.setWorkerListener();
    }

    /**
     * Sets up the web worker listener
     */
    setWorkerListener() {
        socketWorker.postMessage('Message to worker');
        socketWorker.onmessage = (e) => {
            switch (e.data.message) {
                case "filter":
                    this.updateData(e.data.data);
                    break;
                default:
                    console.log("Unknown message");
            }
        };
    }

    /**
     * Update the row data or add new row
     * @param data data of a row
     */
    updateData(data: any) {
        if (this.idMap.hasOwnProperty(data.id)) {
            // console.log("UPDATE ", data.id, this.idMap[data.id], this.idMap.hasOwnProperty(data.id));
            this.data[this.idMap[data.id]] = data;
        } else {
            this.addData(data);
        }
    }

    /**
     * Add new row in the table
     * @param data data of a row
     */
    addData(data: any) {
        if (!this.idMap.hasOwnProperty(data.id)) {
            this.idMap[data.id] = this.data.length;
            if (this.sortColumn.column) {
                const value = data[this.sortColumn.column];
                if (this.sortColumn.direction === 1) {
                    const index = placeInAscSorted(value, this.data, 0, this.data.length, this.sortColumn.column) + 1;
                    this.data.splice(index, 0, data);
                } else {
                    const index = placeInDescSorted(value, this.data, 0, this.data.length, this.sortColumn.column);
                    this.data.splice(index, 0, data);
                }
                this.resetIdMap();
            } else {
                this.data.push(data);
            }
        }
    }

    //If data is inserted in middle, reset the id map
    resetIdMap() {
        const mapcopy = { ...this.idMap };
        this.data.forEach((row: any, index: number) => { mapcopy[row.id] = index; });
        this.idMap = mapcopy;
    }

    /**
     * @returns the table data
     */
    getSnapshot() {
        return this.data;
    }

    /**
     * @returns the table header data
     */
    getHeader() {
        if (!this.headers.length)
            this.createHeader();
        return this.headers;
    }

    /**
     * creates the table header data from row data
     */
    createHeader() {
        const firstRow = this.data.length ? this.data[0] : {};
        const columns = Object.keys(firstRow);
        this.headers = columns.map((column: any) => {
            return {
                name: column,
                type: typeof firstRow[column]
            }
        });
    }

    //FILTERING DATA

    /**
     * push the data to web worker to apply filter
     */
    filterGridData(data: any) {
        const filterstring = localStorage.getItem("filterstring");
        socketWorker.postMessage({ data, message: "filter", filters: filterstring });
    }

    //SORTING THE DATA

    /**
     * column is set in sort object from localstorage
     */
    setSortColumn() {
        const data: any = localStorage.getItem("sort");
        this.sortColumn = JSON.parse(data);
    }

    /**
     * When user click on header of a column, column is set in sort object
     */
    updateSortColumn(column: string) {
        if (this.sortColumn && this.sortColumn.column === column) {
            if (this.sortColumn.direction === 1)
                this.sortColumn.direction = -1;
            else
                this.sortColumn = { column: null, direction: 1 };
        } else {
            this.sortColumn = { column, direction: 1 }
        }
        this.sortData();
        localStorage.setItem("sort", this.sortColumn ? JSON.stringify(this.sortColumn) : this.sortColumn.toString());
    }

    /**
     * The table data is sorted and id map is recreated
     */
    sortData() {
        this.data.sort(this.compare);
        this.resetIdMap();
    }

    /**
     * sort method
     */
    compare = (a: any, b: any) => {
        if (a[this.sortColumn.column] < b[this.sortColumn.column]) return -1 * this.sortColumn.direction;
        if (a[this.sortColumn.column] > b[this.sortColumn.column]) return this.sortColumn.direction;
        return 0;
    }

    /**
     * @returns the sort applied column
     */
    getSortColumn() {
        return this.sortColumn;
    }

}

export default DataManager;