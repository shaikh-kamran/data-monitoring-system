import { memo } from "react";

import { ICellProps } from '../utils/interfaces.ts';
import { decimalPoints } from '../utils/constants.ts';

const TableCell = ({ value }: ICellProps) => {

    /**
     * Format the number to given decimal points
     * @param value 
     * @returns 
     */
    const decimalFormatter = (value: any) => {
        if (typeof value === 'number')
            value = value.toFixed(decimalPoints);
        return value
    }

    return (
        <div>
            {decimalFormatter(value)}
        </div>
    )
}

export default memo(TableCell, (prevProps, nextProps) => {
    return prevProps.value === nextProps.value
});