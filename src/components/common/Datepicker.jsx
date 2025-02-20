import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const Datepicker = () => {
  return (
    <DatePicker
      minDate={dayjs()}
    />
  )
}

export default Datepicker