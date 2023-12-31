import * as Yup from "yup";

const defaultRequiredError = "This field is required.";

const Text = Yup.string().required(defaultRequiredError);
const TextReason = Yup.string().max(120, 'Only 120 character can be add on Reason').required(defaultRequiredError);
const TextOptional = Yup.string().nullable();

const Number = Yup.number("This value shoud be number.").required(
  defaultRequiredError
);
const NumberOptional = Yup.number("This value should be number").nullable();

const Phone = Yup.string()
  .matches(
    /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/,
    "Phone number should not contain unnecesarry characters."
  )
  .max(12, "Phone number must be less than 14.")
  .min(9, "Phone number more than 11.")
  .required(defaultRequiredError);

const Email = Yup.string()
  .email("Invalid email")
  .required(defaultRequiredError);
const EmailOptional = Yup.string().email("Invalid email");

const URL = Yup.string()
  .matches(/\./, "Invalid URL")
  .required(defaultRequiredError);
const URLOptional = Yup.string().matches(/\./, "Invalid URL");
const URLStrict = Yup.string()
  .url("Invalid URL")
  .required(defaultRequiredError);
const URLStrictOptional = Yup.string().url("Invalid URL");

function greaterThan(ref, msg) {
  return this.test({
    name: "greaterThan",
    exclusive: false,
    message: msg || "${path} must be greater than ${reference}",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value > this.resolve(ref);
    },
  });
}

Yup.addMethod(Yup.string, "greaterThan", greaterThan);

export const managementSchema = Yup.object().shape({
  name: Text,
  name_legal: Text,
  logo: URLStrict,
  email: Email,
  phone: Phone,
  website: URL,
  pic_email: Email,
  pic_name: Text,
  pic_phone: Phone,
});

export const buildingSchema = Yup.object().shape({
  name: Text,
  legal_name: Text,
  code_name: Text,
  logo: URLStrict,
  website: URL,
  owner_name: Text,
  phone: Phone,
  email: Email,
  max_sections: Number,
  max_floors: Number,
  max_units: Number,
  lat: Text,
  long: Text,
  address: Text,
  province: Text,
  city: Text,
  district: Text,
  zipcode: Text,
});

export const residentSchema = Yup.object().shape({
  email: EmailOptional,
  firstname: Text,
  lastname: Text,
  phone: Phone,
  // reason: TextReason,

  birthplace: TextOptional,
  birthdate: TextOptional,
  nationality: TextOptional,
  gender: TextOptional,
  marital_status: TextOptional,
  occupation: TextOptional,
  address: TextOptional,
  province: TextOptional,
  city: TextOptional,
  district: TextOptional,
  account_bank: TextOptional,
  account_name: TextOptional,
  account_no: TextOptional,
});

export const residentSchemaWithReason = Yup.object().shape({
  email: EmailOptional,
  firstname: Text,
  lastname: Text,
  phone: Phone,
  update_reason: TextReason,

  birthplace: TextOptional,
  birthdate: TextOptional,
  nationality: TextOptional,
  gender: TextOptional,
  marital_status: TextOptional,
  occupation: TextOptional,
  address: TextOptional,
  province: TextOptional,
  city: TextOptional,
  district: TextOptional,
  account_bank: TextOptional,
  account_name: TextOptional,
  account_no: TextOptional,
});

export const billingSchema = Yup.object().shape({
  service: Text,
  name: Text,
  previous_usage: Number,
  recent_usage: Number, //.moreThan(Yup.ref("previous_usage"))
  month: Text,
  year: Text,
  remarks: Text,
});

export const merchantSchema = Yup.object().shape({
  name: Text,
  phone: Phone,
  type: Text,
  legal: Text,
  category: Text,
  status: Text,
  description: Text,
  in_building: TextOptional,
  lat: Text,
  long: Text,
  address: Text,
  province: Text,
  city: Text,
  district: Text,
  pic_name: Text,
  pic_phone: Phone,
  pic_mail: Email,
  account_bank: Text,
  account_no: Text,
  account_name: Text,
});

export const staffSchema = Yup.object().shape({
  staff_role: Text,
  on_centratama: TextOptional,
  staff_specialization: TextOptional,
  building_management_id: TextOptional,
  staff_id: TextOptional,
  status: Text,
  firstname: Text,
  lastname: Text,
  email: Email,
  phone: Phone,
  nationality: Text,
  gender: Text,
  marital_status: TextOptional,
  address: TextOptional,
  province: TextOptional,
  city: TextOptional,
  district: TextOptional,
  account_bank: TextOptional,
  account_number: TextOptional,
  account_name: TextOptional,
});

export const announcementSchema = Yup.object().shape({
  title: Text,
  building: TextOptional,
  consumer_role: Text,
  image: TextOptional,
  publish_schedule: TextOptional,
  description: Text,
});

export const voucherSchema = Yup.object().shape({
  prefix: Text,
  discount_type: Text,
  discount: Number,
  limit: Number,
  usage_limit: Number,
  expired_date: Text,
  building_management_id: NumberOptional,
});

export const voucherSchemaV2 = Yup.object().shape({
  voucher_name: Text,
  category: Text,
  type: Text,
  target_user: Text,
  discount: Number,
  discount_type: Text,
  minimum_transaction: Text,
  total_voucher: Text,
  max_voucher_peruser: Text,
  start_date: Text,
  expired_date: Text,
  remark: Text,
});

export const providerSchema = Yup.object().shape({
  provider_name: Text,
  image: Text,
  pic_name: Text,
  pic_email: Text,
  pic_phone: Phone,
  coverage_area: Text,
});

export const userRequestSchema = Yup.object().shape({
  category: Number,
  sub_category: Number,
  title: Text,
  description: Text,
  // status: Text,
  // attachments: Text,
});

export const promoVaSchema = Yup.object().shape({
  // account_bank: Text,
  // building_management_id: Text,
  fee_type: Text,
  fee: Number,
  percentage: Number,
  markup: Number,
  start_date: Text,
  endd_ate: Text,
});

export const internetPackageSchema = Yup.object().shape({
  package_name: Text,
  speed: Text,
  price: Text,
  notes: Text,
  tv_channel: Text,
});

export const adsSchema = Yup.object().shape({
  appear_as: Text,
  media: Text,
  media_url: URLOptional,
  start_date: Text,
  end_date: Text,
  gender: Text,
  occupation: Text,
  age_from: Number.min(10, "Target age cannot be lower than 10."),
  age_to: Number.max(85, "Target age cannot be more than 85."),
  view_quota: NumberOptional.moreThan(-1, "This value should be positive"),
  click_quota: NumberOptional.moreThan(-1, "This value should be positive"),
  os: Text,
  content_name: Text,
  content_type: Text,
  content_image: URLStrictOptional,
  content_video: URLStrictOptional,
  content_description: Text,
  total_priority_score: Text,
});

export const adminSchema = Yup.object().shape({
  firstname: Text,
  lastname: Text,
  phone: Phone,
  email: Email,
  group: Text,
  status: Text,
});

export const facilitySchema = Yup.object().shape({
  name: Text,
  check_in_start_minute: Number,
});
