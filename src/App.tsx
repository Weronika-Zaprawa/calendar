import React, { useCallback, useState } from "react";
import "./App.scss";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
  Toolbar,
  ViewSwitcher,
  MonthView,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import LocaleSwitcher from "./components/LocalSwitcher";

const schedulerData = [
  {
    startDate: "2024-08-12T09:45",
    endDate: "2024-08-12T11:00",
    title: "Meeting",
  },
  {
    startDate: "2018-11-01T12:00",
    endDate: "2018-11-01T13:30",
    title: "Go to a gym",
  },
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [locale, setLocale] = useState("pl-PL");

  const currentDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const changeLocale = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLocale(event.target?.value);

  return (
    <div className="App">
      <Paper>
        <LocaleSwitcher currentLocale={locale} onLocaleChange={changeLocale} />
        <Scheduler data={schedulerData} locale={locale}>
          <ViewState
            currentDate={currentDate}
            defaultCurrentViewName="Week"
            onCurrentDateChange={currentDateChange}
          />
          <DayView startDayHour={8} endDayHour={17} />
          <WeekView startDayHour={10} endDayHour={19} />
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <Appointments />
        </Scheduler>
      </Paper>
    </div>
  );
}

export default App;
