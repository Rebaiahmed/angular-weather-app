export enum Status {
  Initial = "INITIAL",
  Loading = "loading",
  Done = "DONE",
}

export interface BtnConfig {
  btnClass: "btn btn-primary" | "btn btn-success";
  isLoading: boolean;
  status: Status;
}
