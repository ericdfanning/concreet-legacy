import React from 'react';
import moment from 'moment';

import * as CalendarModel from '../models/calendar.js';
import events from './events';
import CreateDateModal from './CreateDateModal.jsx';
import findFreeTimes from '../models/findFreeTimes.js';

class AddEventModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topCreateSelected: false
    }
  }

  // check if contact already exists to prevent duplicates
  checkExist(contacts, target) {
    let check = false;
    for (let contact of contacts) {
      if (contact._id === target._id) {
        check = true;
      }
    }
    return check;
  }

  handleEventSubmit(e) {
    e.preventDefault();

    var meetingLength = e.target.meetingLength.value
    var meetingTitle = e.target.title.value
    var selectedTime = this.state.topCreateSelected ? e.target.title.value : this.props.date
    var timeMin = moment(this.props.date, "MM/DD/YYYY");
    var queryInfo = {
      timeMin: timeMin.toISOString(),
      timeMax: timeMin.add('1', 'days').toISOString()
    };
    // put selected contacts and selected contacts from groups into same array
    var allContacts = this.props.selectedContacts.slice();
    this.props.selectedGroups.forEach((group)=> {
      // console.log('group: ', group)
      group.contacts.forEach((contact) => {
        if (!this.checkExist(allContacts, contact)) {
          // console.log('Contact: ', allContacts)
          allContacts.push(contact);
        }
      })
    })

    CalendarModel.freeBusy(allContacts, this.props.user.user, queryInfo.timeMin, queryInfo.timeMax, (calendars) => {
      console.log(queryInfo.timeMin, queryInfo.timeMax)
      // receives back calendars array with each element being an object with a email address as its only property
      // each property has a value that is an object with a busy property
      // value of busy property is an array of objects that include start and end property of busy times
      findFreeTimes.findAvailableSlots(meetingLength, calendars, (freeSlots) => {
        // passsing back the available slots as well as the selected date in ISO format (queryInfo.timeMin)
        this.props.updateSlotsAndEventInfo(freeSlots, queryInfo.timeMin, meetingTitle, meetingLength)
      });
    })

  }

  render() {
    return (
      <div className="addevent">
        <form onSubmit={this.handleEventSubmit.bind(this)}>
          <input type="text" name="title" placeholder="Meeting Title"></input>
          <input type="text" name="meetingLength" placeholder="Meeting Length (min)"></input>
          {
            this.state.topCreateSelected ? <input type="text" name="date" placeholder="MM/DD/YYYY"></input> : null
          }
          <button className="createEventButton">Create event</button>
        </form>
      </div>

    );
  }
}

export default AddEventModal;