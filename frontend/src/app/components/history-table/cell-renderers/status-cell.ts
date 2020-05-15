
export function statusCellRenderer(params) {

  if (params.value === 'Passed')
    return '<i style="line-height: inherit; color: #5ed17f" class="material-icons">check_circle</i>';

  if (params.value === 'Running')
    return '<i style="line-height: inherit; color: #ced16a" class="material-icons rotate">rotate_right</i>';

  if (params.value === 'Failed')
    return '<i style="line-height: inherit; color: #cd3636" class="material-icons">cancel</i>';

  if (params.value === 'Approved')
    return '<i style="line-height: inherit; color: #1572c3" class="material-icons">done</i>';

  return '<i style="line-height: inherit" class="material-icons">' + params.value + '</i>';
}
