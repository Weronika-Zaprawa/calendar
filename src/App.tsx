import React, { useContext, useMemo, useState } from "react";
import "./App.scss";
import Paper from "@mui/material/Paper";
import db from "./firebase";

import {
  Scheduler,
  DayView,
  WeekView,
  Toolbar,
  ViewSwitcher,
  MonthView,
  DateNavigator,
  TodayButton,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
} from "@devexpress/dx-react-scheduler-material-ui";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import LocaleSwitcher from "./components/LocalSwitcher";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { CalendarEvent, useAppContext } from "./services/AppContext";

type ChangeSet = {
  added?: Record<string, any>;
  changed?: Record<string, any>;
  deleted?: number | string;
};

// const schedulerData = [
//   {
//     startDate: "2024-08-12T09:45",
//     endDate: "2024-08-12T11:00",
//     title: "Meeting",
//   },
//   {
//     startDate: "2018-11-01T12:00",
//     endDate: "2018-11-01T13:30",
//     title: "Go to a gym",
//   },
// ];

const schedulerData = [
  {
    startDate: "2024-08-15T10:00",
    endDate: "2024-08-15T22:59",
    title: "Shopping",
  },
  { startDate: "2024-08-20T08:00", endDate: "2024-08-20T12:59", title: "Code" },
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [locale, setLocale] = useState("pl-PL");
  const ref = collection(db, "messages");

  const { calendarEvents, getEvents } = useAppContext();

  const calendarEventsList = useMemo(
    () =>
      calendarEvents.map(({ startDate, endDate, title }: CalendarEvent) => ({
        startDate,
        endDate,
        title,
      })),
    [calendarEvents]
  );

  const currentDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const changeLocale = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLocale(event.target?.value);

  const commitChanges = async ({ added, changed, deleted }: ChangeSet) => {
    if (added) {
      await addDoc(ref, added);
      getEvents();
    }
    if (changed) {
      updateDoc(doc(db, "message", changed.id), changed);
    }
    if (deleted) {
      deleteDoc(doc(db, "messages", String(deleted)));
    }
  };
  console.log(calendarEventsList);

  return (
    <div className="App">
      <Paper>
        <LocaleSwitcher currentLocale={locale} onLocaleChange={changeLocale} />
        <Scheduler data={calendarEventsList} locale={locale}>
          <ViewState
            currentDate={currentDate}
            defaultCurrentViewName="Week"
            onCurrentDateChange={currentDateChange}
          />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView />
          <WeekView />
          <MonthView />

          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <Appointments />
          <AppointmentTooltip showCloseButton showOpenButton />
          <AppointmentForm
            dateEditorComponent={(props) => (
              <AppointmentForm.DateEditor
                {...props}
                locale={locale}
                inputFormat={"MM/DD/YYYY HH:mm"}
              />
            )}
          />
        </Scheduler>
      </Paper>
    </div>
  );
}

export default App;
