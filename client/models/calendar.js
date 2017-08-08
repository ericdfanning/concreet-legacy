import $ from 'jquery';

export const getCalendarList = function (token, cb) {
  $.ajax({
    type: "GET",
    url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: (data) => {
      cb(token, data.items)
      // console.log('get cal list', data.items);
    },
    error: (err) => {
      console.log(err);
    }
  })
}

export const getCalendarEvents = function (token, calendarList, cb) {
  for (var calendar of calendarList) {
    $.ajax({
      type: "GET",
      url: `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: (data) => {
        cb(data)
        // console.log('get cal list', data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
