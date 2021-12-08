import React from 'react';

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

export default ({
  dataChart = [],
  loading = false,
  // buildingId,
  section = '',
  setSection,
  range = 'dtd',
  setRange,
  barClick,
  lineClick,
  headTitle,
  dataY,
  dataX,
}) => {

  return (
    <div>
      <div className="row mb-5 justify-content-between">
          <div className="col">
              <h5>{headTitle || 'Example Statistics'}</h5>
          </div>
          {/* <div className="col-auto">
              <div style={{
                  display: 'flex',
              }}>
                  <div
                      className="Group"
                      onClick={() => setSection({buildingId}) }
                  >
                      Building
                  </div>
              </div>
          </div> */}
          <div className="col-auto">
              <div style={{
                  display: 'flex',
              }}>
                  <div
                      className={range === 'dtd' ? "GroupActive color-5" : "Group blue"}
                      onClick={() => setRange('dtd') }
                  >
                      DTD
                  </div>
                  <div
                      className={range === 'mtd' ? "GroupActive color-5" : "Group blue"}
                      onClick={() => setRange('mtd')}
                  >
                      MTD
                  </div>
                  <div
                      className={range === 'ytd' ? "GroupActive color-5" : "Group blue"}
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
  )
}