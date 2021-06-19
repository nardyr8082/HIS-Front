import { DEFAULT_PAGINATION_SIZE } from '../../../core/models/api-response.model';

export const CIVIL_STATUS_TABLE_CONFIGURATION = {
    paginationSize: DEFAULT_PAGINATION_SIZE,
    displayedColumns: ['descripcion'],
    columnsName: ['Descripción'],
    tableFilters: [
        {
            name: 'descripcion',
            type: 'text',
            title: 'Descripción',
        },
    ],
}