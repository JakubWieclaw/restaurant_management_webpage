import { OpeningHourDayEnum } from "../api";

export const dayToEnum = (day: string) => {
  switch (day) {
    case "Poniedziałek":
      return OpeningHourDayEnum.Monday;
    case "Wtorek":
      return OpeningHourDayEnum.Tuesday;
    case "Środa":
      return OpeningHourDayEnum.Wednesday;
    case "Czwartek":
      return OpeningHourDayEnum.Thursday;
    case "Piątek":
      return OpeningHourDayEnum.Friday;
    case "Sobota":
      return OpeningHourDayEnum.Saturday;
    case "Niedziela":
      return OpeningHourDayEnum.Sunday;
    default:
      throw new Error(`Unknown day: ${day}`);
  }
};

export const enumToDay = (day: OpeningHourDayEnum) => {
  switch (day) {
    case OpeningHourDayEnum.Monday:
      return "Poniedziałek";
    case OpeningHourDayEnum.Tuesday:
      return "Wtorek";
    case OpeningHourDayEnum.Wednesday:
      return "Środa";
    case OpeningHourDayEnum.Thursday:
      return "Czwartek";
    case OpeningHourDayEnum.Friday:
      return "Piątek";
    case OpeningHourDayEnum.Saturday:
      return "Sobota";
    case OpeningHourDayEnum.Sunday:
      return "Niedziela";
    default:
      throw new Error(`Unknown day: ${day}`);
  }
};
