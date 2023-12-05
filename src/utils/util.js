import moment from "moment";
import "moment/locale/id";

export const isObjectEmpty = (objectName) => {
  return Object.keys(objectName ?? {}).length === 0;
};

export const formatDate = (date) => {
  return moment(date).format("DD MMMM YYYY");
};

export const formatTime = (date) => {
  return moment(date).format("HH:mm");
};

export const formatDateDeadline = (date) => {
  date = new Date(date);
  const localeDateString = new Date(date).toLocaleDateString('id-ID', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute: "numeric", timeZone: 'UTC'})
  const localeDateArray = localeDateString.split(", ")
  return `${localeDateArray[1]} | ${localeDateArray[2]} WIB`
}

export const formatDateDeadline2 = (date) => {
  date = new Date(date);
  const localeDateString = new Date(date).toLocaleDateString('id-ID', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute: "numeric", timeZone: 'UTC'})
  const localeDateArray = localeDateString.split(", ")
  return `${localeDateArray[1]} ${localeDateArray[2]} WIB`
}

export const getDateFromRawDate = (date) => {
  date = new Date(date);
  const localeDateString = new Date(date).toLocaleDateString('id-ID', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute: "numeric", timeZone: 'UTC'})
  const localeDateArray = localeDateString.split(", ")
  const localeDate = localeDateArray[1].split(" ")
  return localeDate[0]
}
