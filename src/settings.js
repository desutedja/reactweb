import {
  _endpointBase,
  _endpointAsset,
  _endpointAdmin,
  _endpointBilling,
  _endpointResident,
  _endpointManagement,
  _endpointTask,
  _endpointMerchant,
  _endpointTransaction,
  _endpointAds,
  _endpointInternet,
  _endpointUserReqeust,
  _endpointNotification
} from "./endpoints";

export const endpointBase = _endpointBase;

export const endpointAsset = _endpointAsset;
export const endpointAdmin = _endpointAdmin;
export const endpointBilling = _endpointBilling;
export const endpointResident = _endpointResident;
export const endpointManagement = _endpointManagement;
export const endpointTask = _endpointTask;
export const endpointMerchant = _endpointMerchant;
export const endpointTransaction = _endpointTransaction;
export const endpointAds = _endpointAds;
export const endpointInternet = _endpointInternet;
export const endpointUserRequest = _endpointUserReqeust;
export const endpointNotification = _endpointNotification;

export const mainColor = "#2f78e9";

export const defaultRole = process.env.REACT_APP_DEFAULT_ROLE || "sa"; 

// export const defaultRole = "bm";

export const taskStatusColor = {
  created: "light",
  assigned: "success",
  in_progress: "primary",
  canceled: "warning",
  reported: "info",
  rejected: "danger",
  approved: "success",
  completed: "success",
};

export const kyccolor = {
  "": "secondary",
  none: "secondary",
  submitted: "primary",
  rejected: "danger",
  accepted: "success",
};

export const trx_status = [
  { label: "Requested", value: "requested" },
  { label: "Ask Resident", value: "ask_resident" },
  { label: "Ask Merchant", value: "ask_merchant" },
  { label: "Paid", value: "paid" },
  { label: "In Progress", value: "in_progress" },
  { label: "Accepted", value: "accepted" },
  { label: "Canceled", value: "canceled" },
  { label: "Expired", value: "expired" },
  { label: "On Delivery", value: "on_delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
  { label: "Ready For Pickup", value: "ready_for_pickup" },
  // { label: "requested", value: "requested" },
];

export const trxStatusColor = {
  requested: "light",
  ask_merchant: "warning",
  accepted: "info",
  rejected: "warning",
  canceled: "secondary",
  expired: "light",
  in_progress: "primary",
  ask_resident: "warning",
  paid: "success",
  ready_for_pickup: "info",
  on_delivery: "success",
  delivered: "info",
  completed: "success",
};

export const taskPriorityColor = {
  low: "light",
  normal: "primary",
  high: "warning",
  emergency: "danger",
};

export const merchant_types = [
  { label: "Services", value: "Services" },
  { label: "Goods", value: "Goods" },
];

export const merchant_status = [
  { label: "Open", value: "1" },
  { label: "Close", value: "0" },
];

export const resident_statuses = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const request_premium_status = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Disapprove", value: "disapprove" },
];

export const resident_kyc_statuses = [
  { label: "Submitted", value: "submitted" },
  { label: "Unsubmitted", value: "none" },
];

export const online_status = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const onboarding_status = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const task_types = [
  { label: "Service", value: "service" },
  { label: "Security", value: "security" },
];

export const nulldate = "0001-01-01T00:00:00Z";
