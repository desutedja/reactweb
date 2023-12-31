import React from 'react';

import { FiCalendar } from 'react-icons/fi';
import fallback from '../assets/fallback.jpg';

export default ({ className, imgSrc, title, description, style, createdOn, onClick }) => {
  return (
      <div className={(className ? className : '') + ' d-flex'}
      onClick={onClick}
      style={{
          height: '140px',
          padding: '1rem',
          borderRadius: '4px',
          ...style
      }}
      >
          <div
          style={{
              minWidth: '240px',
              height: '100%',
              overflow: 'hidden',
              borderRadius: '4px',
              position: 'relative'
          }}>
              <img
              style={{
                  objectFit: 'cover',
                  width: '100%',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)'
              }}
              src={imgSrc ? imgSrc : fallback} alt=""/>
          </div>
          <div className="mx-3">
              <div className="mb-3 mt-2 w-100 h-100"
              style={{
                  overflow: 'hidden'
              }}
              >
                  <p><b>{title ? title : 'title'}</b></p>
                  <div className="mb-1 d-flex align-items-center"><FiCalendar className="mr-1"/>{createdOn ? createdOn: ''}</div>
                  {description ? description : <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis dolorum, esse vitae sint, tempora iste possimus earum obcaecati accusantium eius temporibus, distinctio unde. Obcaecati excepturi voluptas iure ipsa? Nostrum, quibusdam!</p>}
              </div>
          </div>
      </div>
  )
}