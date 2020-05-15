
export function dateCellRenderer(data) {

  return data.value ? (new Date(data.value)).toLocaleString() : '';
}
