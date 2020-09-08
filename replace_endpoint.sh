#!/bin/bash

export TEMPLATE=`cat <<EOF
export const _endpointBase = 'https://${ENDPOINT_BASE}';
export const _endpointAsset = _endpointBase + '/${ENDPOINT_PREFIX}-assets';
export const _endpointAdmin = _endpointBase + '/${ENDPOINT_PREFIX}-admin';
export const _endpointBilling = _endpointBase + '/${ENDPOINT_PREFIX}-billing';
export const _endpointResident = _endpointBase + '/${ENDPOINT_PREFIX}-resident';
export const _endpointManagement = _endpointBase + '/${ENDPOINT_PREFIX}-management';
export const _endpointTask = _endpointBase + '/${ENDPOINT_PREFIX}-task';
export const _endpointMerchant = _endpointBase + '/${ENDPOINT_PREFIX}-merchant';
export const _endpointTransaction = _endpointBase + '/${ENDPOINT_PREFIX}-transaction';
export const _endpointAds = _endpointBase + '/${ENDPOINT_PREFIX}-advertisement';
EOF`

echo "$TEMPLATE" > src/endpoints.js
