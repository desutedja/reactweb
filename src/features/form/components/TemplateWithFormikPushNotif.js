import React from "react";
import Breadcrumb2 from "../../../components/Breadcrumb2";
import { useRouteMatch } from "react-router-dom";
import { toSentenceCase } from "../../../utils";
import { Formik } from "formik";
import { useSelector } from "react-redux";

function FormTemplate({
  slice,
  payload,
  schema,
  pagetitle,
  renderChild = () => {},
  formatValues = () => {},
  edit = () => {},
  add = () => {},
}) {
  let { path } = useRouteMatch();

  const { selected } = useSelector((state) => state[slice]);
  const { selectedItem } = useSelector((state) => state.billing);

  return (
    <>
      <Breadcrumb2 title={toSentenceCase(path.split("/").reverse()[0])} />
      <h2 className="PageTitle">{pagetitle}</h2>
      <div>
        <Formik
          initialValues={payload}
          validationSchema={schema}
          autoComplete={"off"}
          onSubmit={(values, bag) => {
            console.log(values);
            const data = formatValues(values);
            console.log(data);

            selected.id
              ? slice === "billing"
                ? selectedItem.id
                  ? edit(data)
                  : add(data)
                : data.duplicate
                ? add(data)
                : edit(data)
              : add(data);
          }}
        >
          {(props) => renderChild(props)}
        </Formik>
      </div>
    </>
  );
}

export default FormTemplate;
