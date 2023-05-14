/**
 * Contains all the interfaces used in the project
 */
export interface IHeader {
    name: string
    type: string
}

export interface IHeaderProps {
    headers: IHeader[]
    dataManager?: any
}

export interface IFilter {
    column: string
    operator: string
    value: string
}

export interface ICellProps {
    value: string
}

export interface ITableRowProps {
    headers: IHeader[]
    timestamp: string
    row: any
}