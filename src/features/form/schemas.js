import * as Yup from 'yup';

const defaultRequiredError = 'This field is required.';

const Text = Yup.string().required(defaultRequiredError);

const TextOptional = Yup.string();

const Phone = Yup.string()
    .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, "Phone number should not contain unnecesarry characters.")
    .max(12, "Phone number must be less than 14.")
    .min(9, "Phone number more than 11.")
    .required(defaultRequiredError);

const Email = Yup.string().email('Invalid email').required(defaultRequiredError);

export const merchantSchema = Yup.object().shape({
    "name": Text,
    "phone": Phone,
    "type": Text,
    "legal": Text,
    "category": Text,
    "status": Text,
    "description": Text,
    "in_building": TextOptional,
    "lat": Text,
    "long": Text,
    "address": Text,
    "pic_name": Text,
    "pic_phone": Phone,
    "pic_mail": Email,
    "account_bank": Text,
    "account_no": Text,
    "account_name": Text,
});

export const staffSchema = Yup.object().shape({
    staff_role: Text,
    on_centratama: TextOptional,
    staff_specialization: TextOptional,
    building_management_id: Text,
    staff_id: Text,
    status: Text,
    firstname: Text,
    lastname: Text,
    email: Email,
    phone: Phone,
    nationality: Text,
    gender: Text,
    marital_status: Text,
    address: Text,
    province: Text,
    city: Text,
    district: Text,
    account_bank: Text,
    account_number: Text,
    account_name: Text,
});