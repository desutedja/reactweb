import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Line,
  Legend,
  Bar, 
  XAxis,
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ComposedChart, 
  ResponsiveContainer
} from 'recharts';

import ClinkLoader from '../components/ClinkLoader';

import { get } from '../features/slice';
import { endpointAdmin } from '../settings';
import Modal from '../components/Modal';
import Filter from '../components/Filter';
import Input from '../components/Input';
import { FiSearch } from 'react-icons/fi';
import { toSentenceCase } from '../utils';

export default ({
  dataChart = [],
  loading = false,
  range = 'dtd',
  buildingName = "",
  tower = "",
  buildingLabel = "",
  unitLabel = "",
  setBuildingLabel,
  setUnitLabel,
  setBuildingName,
  setTower,
  setRange,
  barClick,
  lineClick,
  headTitle,
  dataY,
  dataX,
}) => {

const { auth } = useSelector((state) => state);
const [buildingDatas, setBuildingDatas] = useState([]);
const [sectionDatas, setSectionDatas] = useState([]);
const [openModalBuilding, setOpenModalBuilding] = useState(false);
const [openModalUnit, setOpenModalUnit] = useState(false);
const [search, setSearch] = useState("");
const [limit, setLimit] = useState(5);

let dispatch = useDispatch();


useEffect(() => {
  openModalBuilding &&
    (!search || search.length >= 1) &&
    dispatch(
      get(
        endpointAdmin +
          "/building" +
          "?limit=" +
          limit +
          "&page=1" +
          "&search=" +
          search,
        (res) => {
          let data = res.data.data.items;
          let totalItems = Number(res.data.data.total_items);
          let restTotal = totalItems - data.length;

          let formatted = data.map((el) => ({
            label: el.name,
            value: el.id,
          }));

          if (data.length < totalItems && search.length === 0) {
            formatted.push({
              label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
              restTotal: restTotal > 5 ? 5 : restTotal,
              className: "load-more",
            });
          }

          setBuildingDatas(formatted);
        }
      )
    );
}, [dispatch, search, limit, openModalBuilding]);

useEffect(() => {
  openModalUnit &&
    dispatch(
      get(
        endpointAdmin +
          "/building/getsection?building_id=" +
          buildingName,
        (res) => {
          let data = res.data.data;
          console.log(res);

          let formatted = data.map((el) => ({
            label:
              toSentenceCase(el.section_type) +
              " " +
              toSentenceCase(el.section_name),
            value: el.id,
          }));

          setSectionDatas(formatted);
        }
      )
    );
}, [dispatch, openModalUnit]);

  return (
    <>
    <Modal
        title="Choose Building"
        subtitle="Choose building to set filter"
        isOpen={openModalBuilding}
        toggle={() => setOpenModalBuilding(false)}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setBuildingName({});
          setOpenModalBuilding(false);
        }}
      >
        <>
              <Input
                label="Search Building"
                compact
                icon={<FiSearch />}
                inputValue={search}
                setInputValue={setSearch}
              />
              <Filter
                data={buildingDatas}
                onClick={(el) => {
                  if (!el.value) {
                    setLimit(limit + el.restTotal);
                    return;
                  }
                  setBuildingName(el.value);
                  setBuildingLabel(el.label);
                  setTower("");
                  setLimit(5);
                  setOpenModalBuilding(false);
                }}
                onClickAll={() => {
                  setBuildingName("");
                  setTower("");
                  setBuildingLabel("");
                  setLimit(5);
                  setOpenModalBuilding(false);
                }}
              />
            </>
        {buildingDatas.length === 0 && (
          <p
            style={{
              fontStyle: "italic",
            }}
          >
            No building data found.
          </p>
        )}
      </Modal>
      <Modal
        title="Choose Unit Section"
        subtitle="Choose unit section to set filter"
        isOpen={openModalUnit}
        toggle={() => setOpenModalUnit(false)}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setTower({});
          setOpenModalUnit(false);
        }}
      >
        <>
              <Filter
                data={sectionDatas}
                onClick={(el) => {
                  setTower(el.value);
                  setUnitLabel(el.label);
                  setLimit(5);
                  setOpenModalUnit(false);
                }}
                onClickAll={() => {
                  setTower("");
                  setUnitLabel("");
                  setLimit(5);
                  setOpenModalUnit(false);
                }}
              />
            </>
        {sectionDatas.length === 0 && (
          <p
            style={{
              fontStyle: "italic",
            }}
          >
            No section data found.
          </p>
        )}
      </Modal>
    <div>
      <div className="row mb-5 justify-content-between">
          <div className="col">
              <h5 className='ml-4 mt-2 mb-4'>{headTitle || 'Example Statistics'}</h5>
          </div>
          <div className="col-auto">
              { (auth.role === "bm") ? 
              <div style={{
                  display: 'flex',
              }}>
                  <div
                      style={{ marginLeft: 5 }}
                      className="Group"
                      onClick={() => setOpenModalUnit(true) }
                  >
                     { tower ? unitLabel : 'Section'}
                  </div>
              </div> : <div style={{
                  display: 'flex',
              }}>
                  <div
                      className="Group"
                      onClick={() => setOpenModalBuilding(true) }
                  >
                     { buildingName ? buildingLabel : 'Building'}
                  </div>
                  {buildingName ?
                  <div
                      style={{ marginLeft: 5 }}
                      className="Group"
                      onClick={() => setOpenModalUnit(true) }
                  >
                     { tower ? unitLabel : 'Section'}
                  </div>
                  : []}
              </div>
              }
          </div>
          <div className="col-auto">
              <div style={{
                  display: 'flex',
              }}>
                  <div
                      className={range === 'dtd' ? "GroupActive color-3" : "Group"}
                      onClick={() => setRange('dtd') }
                  >
                      DTD
                  </div>
                  <div
                      className={range === 'mtd' ? "GroupActive color-3" : "Group"}
                      onClick={() => setRange('mtd')}
                  >
                      MTD
                  </div>
                  <div
                      className={range === 'ytd' ? "GroupActive color-3" : "Group"}
                      onClick={() => setRange('ytd')}
                  >
                      YTD
                  </div>
              </div>
          </div>
      </div>
      <div className="row pb-3">
        <div className="col px-4" style={{
          height: '360px',
          position: 'relative'
        }}>
        {loading && <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, .8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1'
        }}>
          <ClinkLoader />
        </div>}
          <ResponsiveContainer width='100%'>
            <ComposedChart data={dataChart}>
              <XAxis dy={10} height={50} dataKey={dataX[0] && dataX[0]} />
              <YAxis yAxisId="right" width={90}
                dx={-10} dataKey={dataY[0] && dataY[0]}
                tickFormatter={el => el && el.toString().length > 3 ?
                  (el + '').slice(0, -3) + 'k' : el}
                // tickFormatter={el => el && el.toString().length > 3 ?
                //   'Rp ' + ((el + '').slice(0, -3) + 'k') : 'Rp ' + el}
                axisLine={false} tickLine={false}
              />
              {dataY?.length > 0 && <YAxis orientation="right"
                width={90} dx={10} dataKey={dataY[1] && dataY[1]} axisLine={false} tickLine={false}
              />}
              <Tooltip />
              {dataY?.length > 1 && <Legend />}
              <CartesianGrid vertical={false} stroke="#ddd" dataKey={dataY[0] && dataY[0]} />
              <Bar radius={4} dataKey={dataY[0] && dataY[0]} fill="#004e92" 
              yAxisId="right" maxBarSize={70} className="cursor-pointer"
              onClick={barClick && barClick}
              />
              {dataY?.length > 0 && <Line type="monotone" dataKey={dataY[1] && dataY[1]} stroke="#ff7300" className="cursor-pointer"
              onClick={lineClick && lineClick}
              />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </>
  )
}