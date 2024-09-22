export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const TICKET_STATUS = {
  open: "Open",
  in_progress: "In progress",
  information_missing: "Information missing",
  canceled: "Canceled",
  done: "Done",
};
