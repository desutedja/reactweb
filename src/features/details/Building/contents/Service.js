import React, { useCallback, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toMoney } from "../../../../utils";
// import { useParams } from 'react-router-dom';

import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import Form from "../../../../components/Form";
import Filter from "../../../../components/Filter";
import {
  editBuildingService,
  createBuildingService,
  getBuildingService,
  deleteBuildingService,
} from "../../../slices/building";

const serviceGroup = [
  { label: "IPL", value: "ipl" },
  { label: "Non-IPL", value: "nonipl" },
];

const columnsService = [
  { Header: "ID", accessor: "id" },
  { Header: "Name", accessor: "name" },
  {
    Header: "Group",
    accessor: (row) => (row.group === "ipl" ? "IPL" : "Non-IPL"),
  },
  {
    Header: "Description",
    accessor: (row) => (row.description ? row.description : "-"),
  },
  {
    Header: "Price",
    accessor: (row) => {
      return row.price_fixed > 0
        ? toMoney(row.price_fixed) + " (Fixed)"
        : toMoney(row.price_unit) + " / " + row.denom_unit;
    },
  },
  {
    Header: "Tax",
    accessor: (row) =>
      row.tax === "percentage"
        ? row.tax_value + "%"
        : toMoney(row.tax_amount) + " (Fixed)",
  },
  { Header: "Summary", accessor: "show_summary" },
];

function Component({ view, canUpdate, canDelete, canAdd }) {
  const [selectedRow, setRow] = useState({});
  const [edit, setEdit] = useState(false);

  const [addService, setAddService] = useState(false);

  const [priceType, setPriceType] = useState("");
  const [taxType, setTaxType] = useState("percentage");

  const [sGroupFilter, setSGroupFilter] = useState({});

  const { selected, service, loading, refreshToggle } = useSelector(
    (state) => state.building
  );

  let dispatch = useDispatch();

  return (
    <>
      <Modal
        isOpen={addService}
        toggle={() => setAddService(false)}
        title={edit ? "Edit Service" : "Add Service"}
        disableFooter={true}
      >
        {edit && (
          <p style={{ paddingRight: "10px", fontStyle: "italic" }}>
            *Any changes in billing service will not affect billings that have
            been created from it
          </p>
        )}
        <Form
          noContainer={true}
          showCancel={true}
          onCancel={() => {
            setAddService(false);
            setEdit(false);
          }}
          onSubmit={(data) => {
            let dataSubmit = data;
            if (!data.tax_value || !data.tax_amount)
              dataSubmit = {
                ...data,
                tax_value: isNaN(data.tax_value) ? 0 : data.tax_value,
                tax_amount: isNaN(data.tax_amount) ? 0 : data.tax_amount,
              };
            edit
              ? dispatch(
                  editBuildingService(
                    {
                      building_id: selected.id,
                      building_name: selected.name,
                      ...dataSubmit,
                    },
                    selectedRow.id
                  )
                )
              : dispatch(
                  createBuildingService({
                    ...dataSubmit,
                    building_id: selected.id,
                  })
                );

            setAddService(false);
            setEdit(false);
            setRow({});
          }}
        >
          <Input
            label="Name"
            placeholder="Input Service Name (e.g. Elecricity, Water)"
            inputValue={selectedRow.name}
          />
          <Input
            label="Group"
            placeholder="Select billing group"
            type="select"
            inputValue={selectedRow.group}
            options={[
              { value: "ipl", label: "IPL" },
              { value: "nonipl", label: "Non-IPL" },
            ]}
            optional
          />
          <Input
            label="Description"
            placeholder="Input service description"
            inputValue={selectedRow.description}
            optional
          />
          <Input
            label="Price Type"
            name="price_type"
            type="select"
            placeholder="Select pricing type (fixed or per unit usage)"
            inputValue={priceType ? priceType : selectedRow.price_type}
            options={[
              { value: "unit", label: "Unit" },
              { value: "fixed", label: "Fixed" },
            ]}
            setInputValue={setPriceType}
            optional
          />
          <Input
            label="Unit Name"
            placeholder="Unit name, ex: kWh, m^3"
            name="denom_unit"
            hidden={priceType === "fixed" || priceType === ""}
            inputValue={priceType === "fixed" ? null : selectedRow.denom_unit}
            optional
          />
          <Input
            label="Price"
            name="price_unit"
            type="number"
            placeholder="Price per unit usage"
            hidden={priceType === "fixed" || priceType === ""}
            inputValue={priceType === "fixed" ? null : selectedRow.price_unit}
            addons="rupiah"
            optional
          />
          <Input
            label="Price"
            name="price_fixed"
            type="number"
            hidden={priceType === "unit" || priceType === ""}
            inputValue={priceType === "unit" ? null : selectedRow.price_fixed}
            addons="rupiah"
            optional
          />
          <Input
            label="Tax Type"
            name="tax"
            type="select"
            options={[
              { value: "value", label: "Value" },
              { value: "percentage", label: "Percentage" },
            ]}
            setInputValue={setTaxType}
            inputValue={taxType ? taxType : selectedRow.tax}
            optional
          />
          <Input
            label="Tax Value"
            hidden={taxType === "value"}
            inputValue={selectedRow.tax_value}
            addons="%"
            optional
          />
          <Input
            label="Tax Amount"
            hidden={taxType === "percentage"}
            inputValue={selectedRow.tax_amount}
            addons="rupiah"
            optional
          />
        </Form>
      </Modal>
      <Table
        noContainer={true}
        columns={columnsService}
        data={service.items}
        loading={loading}
        pageCount={service.total_pages}
        fetchData={useCallback(
          (pageIndex, pageSize, search) => {
            dispatch(
              getBuildingService(
                pageIndex,
                pageSize,
                search,
                selected,
                sGroupFilter.value
              )
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
          },
          [dispatch, refreshToggle, sGroupFilter]
        )}
        totalItems={service.items.length}
        filters={[
          {
            button: (
              <Button
                key="Group: All"
                label={sGroupFilter.label ? sGroupFilter.label : "Group: All"}
                selected={sGroupFilter.label}
              />
            ),
            hidex: !sGroupFilter.label,
            label: (
              <p>
                {sGroupFilter.label
                  ? "Group: " + sGroupFilter.label
                  : "Group: All"}
              </p>
            ),
            delete: () => {
              setSGroupFilter({});
            },
            component: (toggleModal) => (
              <Filter
                data={serviceGroup}
                onClick={(el) => {
                  setSGroupFilter(el);
                  toggleModal(false);
                }}
                onClickAll={() => {
                  setSGroupFilter("");
                  toggleModal(false);
                }}
              />
            ),
          },
        ]}
        actions={
          view
            ? null
            : canAdd
            ? [
                <Button
                  key="Add Billing Service"
                  label="Add Billing Service"
                  icon={<FiPlus />}
                  onClick={() => {
                    setEdit(false);
                    setRow({});

                    setAddService(true);
                  }}
                />,
              ]
            : null
        }
        onClickEdit={
          view
            ? null
            : canUpdate
            ? (row) => {
                setRow(row);
                console.log(row);
                setPriceType(row.price_type);
                setTaxType(row.tax);
                setEdit(true);
                setAddService(true);
              }
            : null
        }
        onClickDelete={
          view
            ? null
            : canDelete
            ? (row) => {
                dispatch(deleteBuildingService(row));
              }
            : undefined
        }
      />
    </>
  );
}

export default Component;
