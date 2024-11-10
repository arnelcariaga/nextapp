import { differenceInYears } from "date-fns";

const calculateAge = (date: string) => {
  const currentDate = new Date();
  const birthDateObj = new Date(date);
  return differenceInYears(currentDate, birthDateObj);
};
export default calculateAge;
