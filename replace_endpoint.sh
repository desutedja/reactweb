#!/bin/bash

# export TEMPLATE=`cat <<EOF
# const root = '${ENDPOINT_PREFIX}';
# export const _endpointBase = 'http://${ENDPOINT_BASE}';

# export const _endpointAsset = _endpointBase + ":" + root + "6012";
# export const _endpointAdmin = _endpointBase + ":" + root + "6001";
# export const _endpointBilling = _endpointBase + ":" + root + "6008";
# export const _endpointResident = _endpointBase + ":" + root + "6004";
# export const _endpointManagement = _endpointBase + ":" + root + "6003";
# export const _endpointTask = _endpointBase + ":" + root + "6002";
# export const _endpointMerchant = _endpointBase + ":" + root + "6005";
# export const _endpointTransaction = _endpointBase + ":" + root + "6006";
# export const _endpointAds = _endpointBase + ":" + root + "6007";
# EOF`

# echo "$TEMPLATE" > src/endpoints.js

export TEMPLATE=`cat <<EOF
const root = '${ENDPOINT_PREFIX}';
export const _endpointBase = 'https://${ENDPOINT_BASE}';

export const _endpointAsset = _endpointBase + '/' + root + '-assets';
export const _endpointAdmin = _endpointBase + '/' + root + '-admin';
export const _endpointBilling = _endpointBase + '/' + root + '-billing';
export const _endpointResident = _endpointBase + '/' + root + '-resident';
export const _endpointManagement = _endpointBase + '/' + root + '-management';
export const _endpointTask = _endpointBase + '/' + root + '-task';
export const _endpointMerchant = _endpointBase + '/' + root + '-merchant';
export const _endpointTransaction = _endpointBase + '/' + root + '-transaction';
export const _endpointAds = _endpointBase + '/' + root + '-advertisement';
EOF`

echo "$TEMPLATE" > src/endpoints.js