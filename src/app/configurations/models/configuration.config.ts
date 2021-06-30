export interface ItemConfiguration {
  id: string;
  name: string;
}

export const DECIMAL_SPLITER: Array<ItemConfiguration> = [
  { id: ',', name: '12,34 (,)' },
  { id: '.', name: '12.34 (.)' },
  { id: ' ', name: '12 34 ( )' },
  { id: '-', name: '12-34 (-)' },
  { id: '', name: '1234 ()' },
];

export const MILLAR_SPLITER: Array<ItemConfiguration> = [
  { id: ',', name: '1,234 (,)' },
  { id: '.', name: '1.234 (.)' },
  { id: ' ', name: '1 234 ( )' },
  { id: '-', name: '1-234 (-)' },
  { id: '', name: '1234 ()' },
];

export const DATE_FORMATS: Array<ItemConfiguration> = [
  { id: 'dd/mm/yyyy', name: '24/11/2006 (dd/mm/yyyy)' },
  { id: 'mm/dd/yyyy', name: '11/24/2006 (mm/dd/yyyy)' },
  { id: 'yyyy/dd/mm', name: '2006/24/11 (yyyy/dd/mm)' },
  { id: 'yyyy/mm/dd', name: '2006/11/24 (yyyy/mm/dd)' },
  { id: 'dd-mm-yyyy', name: '24-11-2006 (dd-mm-yyyy)' },
  { id: 'mm-dd-yyyy', name: '11-24-2006 (mm-dd-yyyy)' },
  { id: 'yyyy-dd-mm', name: '2006-24-11 (yyyy-dd-mm)' },
  { id: 'yyyy-mm-dd', name: '2006-11-24 (yyyy-mm-dd)' },
];

export const TIME_FORMATS: Array<ItemConfiguration> = [
  { id: 'hh:mm:ss', name: '12:45:33 (hh:mm:ss)' },
  { id: 'hh:mm', name: '12:45 (hh:mm)' },
];
