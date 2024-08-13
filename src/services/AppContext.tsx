import { collection, getDocs } from "firebase/firestore";
import React, {
  createContext,
  useState,
  useContext,
  ReactElement,
  useEffect,
} from "react";
import db from "../firebase";

type AppContextType = {
  calendarEvents: CalendarEvent[];
  getEvents: () => Promise<void>;
};

export type CalendarEvent = {
  startDate: Date | string | number;
  endDate?: Date | string | number;
  title?: string;
  allDay?: boolean;
  id?: number | string;
  notes?: string;
  rRule?: string;
  exDate?: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const formatDate = (timestampInSeconds: number) => {
  const date = new Date(timestampInSeconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  return formattedDateTime;
};

export const AppProvider = ({ children }: { children: ReactElement }) => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const getEvents = async () => {
    const docSnap = await getDocs(collection(db, "messages"));
    const events: CalendarEvent[] = [];
    docSnap.forEach((doc) => {
      console.log(doc.id, "=>", doc.data().startDate.seconds);
      events.push({
        ...doc.data(),
        startDate: formatDate(doc.data().startDate.seconds),
        endDate: formatDate(doc.data().endDate.seconds),
      } as any);
    });
    setCalendarEvents(events);
  };
  useEffect(() => {
    getEvents();
  }, []);

  return (
    <AppContext.Provider value={{ calendarEvents, getEvents }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
