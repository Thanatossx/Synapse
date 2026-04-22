export type EventStatus = "active" | "past";

export type QuestionType = "text" | "textarea" | "select" | "multiselect" | "date" | "number" | "rules_ack";

export type QuestionOption = {
  value: string;
  label: string;
};

export type Question = {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
};

export type ApplicationForm = {
  version: number;
  questions: Question[];
};

export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: EventStatus;
  applicationForm?: ApplicationForm;
};

export type ApplicationStatus = "pending" | "accepted" | "issued" | "rejected";

export type TicketApplication = {
  id: string;
  eventId: string;
  eventTitleSnapshot: string;
  status: ApplicationStatus;
  createdAt: string;
  // New dynamic-form shape
  formVersion?: number;
  answers?: Record<string, unknown>;

  // Legacy fields (older applications stored before dynamic forms)
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  ticketQuantity?: "one" | "two" | "more";
  attendeesInfo?: string;
  hearAbout?: ("social" | "friend" | "other")[];
  rulesAccepted?: boolean;
};
