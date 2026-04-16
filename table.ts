import {
  VerticalTabsTrigger,
  DropdownMenuTrigger,
  DropdownMenuContent,
  VerticalTabsList,
  DropdownMenuItem,
  TableHeaderCell,
  VerticalTabs,
  DropdownMenu,
  Typography,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Table,
  Icon,
} from '@shared/ui';

import type { TabDocumentsProps } from '../types';
import styles from './tab-documents.module.css';

export const TabDocuments = ({
                               isAllSelected,
                               isAnySelected,
                               selectedRows,
                               onSelectAll,
                               onSelectRow,
                               onTabChange,
                               featureData,
                               activeTab,
                               rows,
                             }: TabDocumentsProps) => {
  return (
    <div className={styles.generalTab}>
      {/* ===== ЛЕВАЯ ЧАСТЬ: заголовок + вертикальные табы ===== */}
      <div className={styles.generalTabLeft}>
    {/* Блок с заголовком и годом */}
    <div className={styles.tittleDocument}>
  <Typography color="primary" variant="headS">
    {featureData.header.title}
    </Typography>
    <Typography variant="headS" color="accent">
    {featureData.header.yearValue}
    </Typography>
    <Icon name="chevronDown" />
    </div>

  {/* Вертикальные табы (фильтр по категориям) */}
  <VerticalTabs
    className={styles.verticalTabs}
  onValueChange={onTabChange}
  value={activeTab}
  >
  <VerticalTabsList className={styles.tabsList}>
    {featureData.tabs.map((tab) => (
        <VerticalTabsTrigger value={tab.value} key={tab.value}>
        {tab.label}
        </VerticalTabsTrigger>
))}
  </VerticalTabsList>
  </VerticalTabs>
  </div>

  {/* ===== ПРАВАЯ ЧАСТЬ: кнопка + таблица ===== */}
  <div className={styles.generalTabRight}>
    {/* Кнопка скачивания (активна только если что-то выбрано) */}
    <div className={styles.buttonTable}>
  <Button
    icon={<Icon name="download" size="sm" />}
  disabled={!isAnySelected}
  variant="primary"
    >
    {featureData.buttonDownload.title}
    </Button>
    </div>

  {/* ===== ТАБЛИЦА ДОКУМЕНТОВ ===== */}
  <Table>
    {/* Шапка таблицы */}
  <TableHead>
  <TableRow>
    {featureData.table.map((header, index) => (
        <TableHeaderCell width={header.width} key={header.key}>
        {/* Текст заголовка (кроме первого столбца с чекбоксом) */}
  {header.label ? (
    <Typography color="secondary" variant="bodyS">
    {header.label}
    </Typography>
  ) : undefined}

  {/* Чекбокс "выбрать всё" — только в первом столбце */}
  {index === 0 && (
    <Checkbox
      onChange={(checked) => {
    onSelectAll(Boolean(checked));
  }}
    checked={isAllSelected}
    />
  )}
  </TableHeaderCell>
))}
  </TableRow>
  </TableHead>

  {/* Тело таблицы (строки с данными) */}
  <TableBody>
    {rows.map((row) => (
        <TableRow key={row.id}>
        {/* Столбец 1: чекбокс выбора строки */}
        <TableCell>
        <Checkbox
          onChange={(checked) => {
    onSelectRow(row.id, Boolean(checked));
  }}
  checked={selectedRows.includes(row.id)}
  />
  </TableCell>

  {/* Столбец 2: дата */}
  <TableCell>
    <Typography color="primary" variant="bodyS">
    {row.date}
    </Typography>
    </TableCell>

  {/* Столбец 3: название документа */}
  <TableCell>
    <Typography color="primary" variant="bodyS">
    {row.name}
    </Typography>
    </TableCell>

  {/* Столбец 4: статус */}
  <TableCell>
    <Typography color="primary" variant="bodyS">
    {row.status}
    </Typography>
    </TableCell>

  {/* Столбец 5: тип файла */}
  <TableCell>
    <Typography color="primary" variant="bodyS">
    {row.fileType}
    </Typography>
    </TableCell>

  {/* Столбец 6: иконка файла */}
  <TableCell>
    <Icon name={row.file} height={28} width={28} />
  </TableCell>

  {/* Столбец 7: дропдаун с действиями (три точки) */}
  <TableCell>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton icon="option" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
  className={styles.dropdownContent}
  sideOffset={10}
  align="start"
  >
  <DropdownMenuItem className={styles.dropdownItem}>
    <Typography>{row.dropdown.confirm}</Typography>
    </DropdownMenuItem>
    <DropdownMenuItem className={styles.dropdownItem}>
    <Typography>{row.dropdown.decline}</Typography>
    </DropdownMenuItem>
    <DropdownMenuItem className={styles.dropdownItem}>
    <Typography>{row.dropdown.download}</Typography>
    </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    </TableCell>
    </TableRow>
))}
  </TableBody>
  </Table>
  </div>
  </div>
);
};