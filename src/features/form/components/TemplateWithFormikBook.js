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
  renderChild = () => {},
  formatValues = () => {},
  edit = () => {},
  add = () => {},
}) {
  let { path } = useRouteMatch();

  const { selected } = useSelector((state) => state[slice]);
  // const { selectedItem } = useSelector((state) => state.billing);

  return (
    <>
      <Breadcrumb2 title={toSentenceCase(path.split("/").reverse()[0])} />
      <div className="Container">
        <Formik
          initialValues={payload}
          validationSchema={schema}
          autoComplete={"off"}
          onSubmit={(values) => {
            const data = formatValues(values);
            
            selected.id
              ? slice === "facility"
                ? selected.id
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
