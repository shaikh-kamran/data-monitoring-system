import { useState, memo, useEffect } from 'react';
import styles from './table.module.scss';

import { placeHolderMap } from '../utils/constants.ts';
import { IHeaderProps } from '../utils/interfaces.ts';

const FilterPanel = ({ headers }: IHeaderProps) => {

    const numberOperators = ["==", "<", ">", "<=", ">=", "<>"];
    const [filters, setFilters] = useState<any[]>([{
        column: headers.length ? headers[0].name : "",
        operator: numberOperators[0],
        value: ""
    }]);

    useEffect(() => {
        var filters = localStorage.getItem("filters");
        if (filters) setFilters(JSON.parse(filters));
    }, [])

    const changeFilter = (index: number, property: string, value: string) => {
        filters[index][property] = value;
        setFilters([...filters]);
        localStorage.setItem("filters", JSON.stringify(filters));
    }

    const addNewFilter = () => {
        filters.push({
            column: headers.length ? headers[0].name : "",
            operator: numberOperators[0],
            value: ""
        })
        setFilters([...filters]);
    }

    const createFilterString = () => {
        var filterstring = ""
        filters.forEach((filter: any, index: number) => {
            if (filter.operator === "<>")
                filterstring += `data['${filter.column}']>'${filter.value}'&&data['${filter.column}']<'${filter.value2}'`;
            else
                filterstring += `data['${filter.column}']${filter.operator}'${filter.value}'`;
            if (index !== filters.length - 1) filterstring += "&&";
        });
        console.log(filterstring);
        localStorage.setItem("filterstring", filterstring);
    }

    const removeFilter = (index: number) => {
        filters.splice(index, 1);
        setFilters([...filters]);
        localStorage.setItem("filters", JSON.stringify(filters));
    }

    return (
        <div className={styles.filter}>
            Filters:
            {
                filters.map((filter: any, index: number) => {
                    return (
                        <div key={index} className={styles.filterform}>
                            <select
                                className={styles.filterforminput}
                                value={filter.column}
                                name="newFilterColumn"
                                onChange={(e) => changeFilter(index, "column", e.target.value)} >
                                {headers.map((column, i) => {
                                    return (<option key={i} value={column.name}>{column.name}</option>)
                                })}
                            </select>
                            <select
                                className={styles.filterforminput}
                                value={filter.operator}
                                name="newFilterOperator"
                                id="newFilterOperator"
                                onChange={(e) => changeFilter(index, "operator", e.target.value)} >
                                {numberOperators.map((operator, i) => {
                                    return (<option key={i} value={operator}>{operator}</option>)
                                })}
                            </select>
                            <input
                                className={styles.filterforminput}
                                value={filter.value}
                                placeholder={filter.operator === "<>" ? "Greater than Value" :
                                    placeHolderMap[filter.operator]}
                                onChange={(e) => changeFilter(index, "value", e.target.value)}
                            />
                            {
                                filter.operator === "<>" ?
                                    <input
                                        className={styles.filterforminput}
                                        value={filter.value2}
                                        placeholder="Less than Value"
                                        onChange={(e) => changeFilter(index, "value2", e.target.value)}
                                    /> : null
                            }
                            <div onClick={() => removeFilter(index)} className={styles.filteractionbutton}>-</div>
                        </div>
                    )
                })
            }
            <div onClick={addNewFilter} className={styles.filteractionbutton}>+</div>
            <div onClick={createFilterString} className={styles.filteractionbutton}>Apply</div>
        </div>
    )
}

export default memo(FilterPanel, (prevProps, nextProps) => {
    return prevProps.headers.length === nextProps.headers.length
});