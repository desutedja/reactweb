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
  { label: "requested", value: "requested" },
  { label: "ask_resident", value: "ask_resident" },
  { label: "ask_merchant", value: "ask_merchant" },
  { label: "paid", value: "paid" },
  { label: "in_progress", value: "in_progress" },
  { label: "accepted", value: "accepted" },
  { label: "canceled", value: "canceled" },
  { label: "expired", value: "expired" },
  { label: "on_delivery", value: "on_delivery" },
  { label: "delivered", value: "delivered" },
  { label: "completed", value: "completed" },
  { label: "rejected", value: "rejected" },
  { label: "ready_for_pickup", value: "ready_for_pickup" },
  { label: "requested", value: "requested" },
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
