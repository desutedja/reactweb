import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomAlert from "../../components/CustomAlert";
import "react-confirm-alert/src/react-confirm-alert.css";

import Modal from "../../components/Modal";

import Input from "../../components/Input";
import Button from "../../components/Button";
import {
  getBonusList,
  refresh,
  stopAsync,
} from "../slices/bonus";
import {
  inputDateTimeFormatterYmd
} from "../../utils";
import { get, post, setInfo } from "../slice";

import Template from "./components/Template";

const columnBonus = [
  { Header: 'Category', accessor: `category_name` },
  { Header: 'New Member', accessor: 'new_member' },
  { Header: 'CB Slot', accessor: 'cb_sl' },
  { Header: 'Rebate Slot', accessor: 'rb_sl' },
  { Header: 'CB Casino', accessor: 'cb_ca' },
  { Header: 'Roll Casino', accessor: 'roll_ca' },
  { Header: 'CB Sport', accessor: 'cb_sp' },
  { Header: 'Rebate Sport', accessor: 'rb_sp' },
  { Header: 'Referall', accessor: 'refferal' },
  { Header: 'Promo Lain', accessor: 'promo' },
  { Header: 'Total', accessor: 'total' },
  { Header: 'Trans Date', accessor: 'trans_date' }
];

function Component({ view }) {
  const [search, setSearch] = useState("");

  const { role } = useSelector((state) => state.auth);

  const [modalPublish, toggleModalPublish] = useState(false);
  const handleShow = () => toggleModalPublish(true);

  const [categoryList, setCategoryList] = useState();
  const [alert, setAlert] = useState("");

  const [category, setCategory] = useState();
  const [newMember, setnewMember] = useState();
  const [cbSl, setCbSl] = useState();
  const [rbSl, setRbSl] = useState();
  const [cbCa, setCbCa] = useState();
  const [rollCa, setRollCa] = useState();
  const [cbSp, setCbSp] = useState();
  const [rbSp, setRbSp] = useState();
  const [refferal, setRefferal] = useState();
  const [promo, setPromo] = useState();
  const [transDate, setTransDate] = useState();



  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      get(
        "http://86.38.203.90:1111/category" +
          "?limit=10" +
          "&page=1" +
          "&search=" +
          search,
        (res) => {
          console.log(res.data.data);
          let formatted = res.data.data.map((el) => ({ label: el.name, value: el.id }));
          setCategoryList(formatted);
        }
      )
    );
  }, [dispatch,search]);

  return (
    <>
      <Modal
        isOpen={modalPublish}
        toggle={() => {
          toggleModalPublish(false);
        }}
        title="Add Bonus"
        okLabel={"Submit"}
        onClick={() => {
          dispatch(
            post(
              "http://86.38.203.90:1111/bonus",
              {
                category_id:parseInt(category),
                new_member:parseFloat(newMember),
                cb_sl:parseFloat(cbSl),
                rb_sl:parseFloat(rbSl),
                cb_ca:parseFloat(cbCa),
                roll_ca:parseFloat(rollCa),
                cb_sp:parseFloat(cbSp),
                rb_sp:parseFloat(rbSp),
                refferal:parseFloat(refferal),
                promo:parseFloat(promo),
                trans_date:inputDateTimeFormatterYmd(transDate),
              },
              (res) => {
                dispatch(
                  setInfo({
                    color: "success",
                    message: `${res.data.data} success insert bonus.`,
                  })
                );
                getBonusList()
                dispatch(refresh());
                // resultComponent ? setOpenRes(true) : toggle();
              },
              (err) => {
                dispatch(
                  setInfo({
                    color: "error",
                    message: `Error to released.`,
                  })
                );
                console.log("error");
              }
            )
          );

          dispatch(refresh());
          dispatch(stopAsync());
          toggleModalPublish(false);
        }}
      >
        <Input
          label="Category"
          inputValue={category}
          type="select"
          options={categoryList}
          setInputValue={setCategory}
          title="Category"
          hidden={role !== "sa"}
        />

        <Input
          label="New Member"
          inputValue={newMember}
          type="number"
          setInputValue={setnewMember}
          title="New Member"
        />

        <Input
          label="CB Slot"
          inputValue={cbSl}
          type="number"
          setInputValue={setCbSl}
          title="CB Slot"
        />

        <Input
          label="Rebate Slot"
          inputValue={rbSl}
          type="number"
          setInputValue={setRbSl}
          title="Rebate Slot"
        />

        <Input
          label="CB Casino"
          inputValue={cbCa}
          type="number"
          setInputValue={setCbCa}
          title="CB Casino"
        />

        <Input
          label="Roll Casino"
          inputValue={rollCa}
          type="number"
          setInputValue={setRollCa}
          title="Roll Casino"
        />

        <Input
          label="CB Sport"
          inputValue={cbSp}
          type="number"
          setInputValue={setCbSp}
          title="CB Sport"
        />

        <Input
          label="Rebate Sport"
          inputValue={rbSp}
          type="number"
          setInputValue={setRbSp}
          title="Rebate Sport"
        />

        <Input
          label="Referall"
          inputValue={refferal}
          type="number"
          setInputValue={setRefferal}
          title="Referall"
        />

        <Input
          label="Promo Lain"
          inputValue={promo}
          type="number"
          setInputValue={setPromo}
          title="Promo Lain"
        />
        
        <Input
          type="datetime-local"
          label="Trans Date"
          name="trans_date"
          inputValue={transDate}
          setInputValue={setTransDate}
        />
      </Modal>

      <CustomAlert
        isOpen={alert}
        toggle={() => setAlert(false)}
        title={"Error"}
        subtitle={"Please Choose Building"}
        content={"You need to choose Building first"}
      />

      <Template
        view={view}
        title="Unit"
        pagetitle="Bonus List"
        columns={columnBonus}
        slice="bonus"
        getAction={getBonusList}
        renderActions={
          view
            ? null
            : (selectedRowIds, page) => {
                return [
                  <Button label="Add Bonus" onClick={handleShow} />,
                ];
              }
        }
      />
    </>
  );
}
export default Component;
