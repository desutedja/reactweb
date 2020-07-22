

export const endpointBase = 'https://centratama.okbabe.technology';

export const endpointAsset = endpointBase + '/clink-assets';
export const endpointAdmin = endpointBase + '/clink-admin';
export const endpointBilling = endpointBase + '/clink-billing';
export const endpointResident = endpointBase + '/clink-resident';
export const endpointManagement = endpointBase + '/clink-management';
export const endpointTask = endpointBase + '/clink-task';
export const endpointMerchant = endpointBase + '/clink-merchant';
export const endpointTransaction = endpointBase + '/clink-transaction';
export const endpointAds = endpointBase + '/clink-advertisement';

export const mainColor = '#2f78e9';

export const taskStatusColor = {
    'created': 'light',
    'assigned': 'success',
    'in_progress': 'primary',
    'canceled': 'warning',
    'reported': 'info',
    'rejected': 'danger',
    'approved': 'success',
    'completed': 'secondary'
}

export const trx_status = [
    { label: 'requested', value: 'requested' },
    { label: 'ask_resident', value: 'ask_resident' },
    { label: 'ask_merchant', value: 'ask_merchant' },
    { label: 'paid', value: 'paid' },
    { label: 'in_progress', value: 'in_progress' },
    { label: 'accepted', value: 'accepted' },
    { label: 'canceled', value: 'canceled' },
    { label: 'expired', value: 'expired' },
    { label: 'paid', value: 'paid' },
    { label: 'on_delivery', value: 'on_delivery' },
    { label: 'delivered', value: 'delivered' },
    { label: 'completed', value: 'completed' },
    { label: 'rejected', value: 'rejected' },
    { label: 'ready_for_pickup', value: 'ready_for_pickup' },
    { label: 'requested', value: 'requested' },
]

export const trxStatusColor = {
    'requested': 'light',
    'ask_merchant': 'warning',
    'accepted': 'info',
    'rejected': 'warning',
    'canceled': 'secondary',
    'expired': 'light',
    'in_progress': 'primary',
    'ask_resident': 'warning',
    'paid': 'success',
    'ready_for_pickup': 'info',
    'on_delivery': 'success',
    'delivered': 'info',
    'completed': 'secondary',
}

export const merchant_types = [
    {label: 'Services', value: 'Services'},
    {label: 'Goods', value: 'Goods'},
]

export const task_types = [
    {label: 'Service', value: 'service'},
    {label: 'Security', value: 'security'}
]
