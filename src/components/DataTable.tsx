import React, { useEffect, useState } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import FilterPanel from './FilterPanel';

import SocketManager from '../services/SocketManager';
import DataManager from '../services/DataManager';

import { IHeader } from '../utils/interfaces.ts';
import { gridUpdateFrequency } from '../utils/constants.ts';

import styles from './table.module.scss';

const dataManager = new DataManager();
const socket = new SocketManager(dataManager);

const DataTable = () => {

    const [headers, setHeaders] = useState<IHeader[]>([]);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {

        const socketid = socket.getSocketId();
        console.log("SOCKET ID: " + socketid);

        /**
         * Fetching data from data manager at 'gridUpdateFrequency'
         */
        var timer = setInterval(() => {
            if (!headers.length) loadHeader();
            loadData();
        }, gridUpdateFrequency);

        return () => { clearInterval(timer) };

    }, []);

    const loadHeader = () => {
        const header = dataManager.getHeader();
        setHeaders(header);
    }

    const loadData = () => {
        const rows = dataManager.getSnapshot();
        setRows([...rows]);
    }

    return (
        <>
            <FilterPanel headers={headers} />
            <div className={styles.table}>
                <TableHeader dataManager={dataManager} headers={headers} />
                {rows.map((row: any) => {
                    return (
                        <React.Fragment key={Number(row.id)}>
                            {row.visibility ?
                                <TableRow timestamp={row.timestamp} row={row} headers={headers} />
                                : null}
                        </React.Fragment>
                    )
                })}
            </div>
        </>
    )
}

export default DataTable;