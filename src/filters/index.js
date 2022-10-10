import dayjs from 'dayjs'

export const dateFormat = function (time) {
  return dayjs(time).format('YYYY-MM-DD')
}
