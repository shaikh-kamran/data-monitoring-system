import { useState, useEffect, memo } from 'react';
import { IHeader, IHeaderProps } from '../utils/interfaces.ts';

import styles from './table.module.scss';

const TableHeader = ({ headers, dataManager }: IHeaderProps) => {

    const [sortColumn, setSortColumn] = useState<any>({});

    useEffect(() => {
        updateSort();
    }, []);

    const updateSort = () => {
        const data = dataManager.getSortColumn();
        setSortColumn({ ...data });
    }

    return (
        <div className={styles.headers}>
            {
                headers.map((header: IHeader) => {
                    return (
                        <div className={styles.header} key={header.name}
                            onClick={() => { dataManager.updateSortColumn(header.name); updateSort(); }}>
                            {header.name}
                            {
                                sortColumn && sortColumn.column === header.name ?
                                    <>
                                        {sortColumn.direction === 1 ? '(asc)' : '(dsc)'}
                                    </>
                                    : null
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default memo(TableHeader, (prevProps, nextProps) => {
    return prevProps.headers.length === nextProps.headers.length
});;