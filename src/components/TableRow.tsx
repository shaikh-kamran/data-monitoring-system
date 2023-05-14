import { memo } from "react";
import TableCell from './TableCell';

import { IHeader, ITableRowProps } from '../utils/interfaces.ts';
import styles from './table.module.scss';

const TableRow = ({ headers, row }: ITableRowProps) => {
    return (
        <div className={styles.row}>
            {headers.map((header: IHeader) => {
                return (<div key={header.name} className={styles.cell}>
                    <TableCell value={row[header.name]} /></div>)
            })}
        </div>
    )
}

export default memo(TableRow, (prevProps, nextProps) => {
    return prevProps.timestamp === nextProps.timestamp
});