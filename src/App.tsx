import React, { useMemo, useState } from "react";
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
import { title } from "process";

type ChangeSet = {
  added?: Record<string, any>;
  changed?: Record<string, any>;
  deleted?: number | string;
};

type ViewNames = {
  Day: string;
  Week: string;
  Month: string;
};

function App() {
  const { calendarEvents, getEvents } = useAppContext();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [locale, setLocale] = useState("pl-PL");

  const ref = collection(db, "messages");

  const calendarEventsList = useMemo(
    () =>
      calendarEvents.map(
        ({ startDate, endDate, title, id }: CalendarEvent) => ({
          startDate,
          endDate,
          title,
          id,
        })
      ),
    [calendarEvents]
  );

  const currentDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const changeLocale = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLocale(event.target?.value);

  const commitChanges = async ({ added, changed, deleted }: ChangeSet) => {
    if (added) {
      if (added.endDate < added.startDate) {
        if (locale === "pl-PL") {
          alert("Data końcowa nie może być wcześniej niż data początkowa!");
        } else {
          alert("The end date cannot be earlier than the start date");
        }
        return;
      }
      if (!added.title) {
        added.title = "";
      }
      await addDoc(ref, added);
      getEvents();
    }
    if (changed) {
      const id = Object.keys(changed)[0];
      const updated = calendarEvents.find((event) => event.id === id);

      const docRef = doc(db, "messages", id);
      await updateDoc(docRef, { ...updated, ...changed[id] });
      getEvents();
    }
    if (deleted) {
      await deleteDoc(doc(db, "messages", String(deleted)));
      getEvents();
    }
  };

  const viewNames: ViewNames = {
    Day: "Dzień",
    Week: "Tydzień",
    Month: "Miesiąc",
  };

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
          <DayView displayName={locale === "pl-PL" ? "Dzień" : "Day"} />
          <WeekView displayName={locale === "pl-PL" ? "Tydzień" : "Week"} />
          <MonthView displayName={locale === "pl-PL" ? "Miesiąc" : "Month"} />

          <Toolbar />
          <DateNavigator />
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
            booleanEditorComponent={(props) => <div></div>}
          />
        </Scheduler>
      </Paper>
    </div>
  );
}

export default App;
