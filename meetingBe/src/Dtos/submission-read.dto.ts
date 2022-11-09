import { fromArrayBufferToHex } from "google-auth-library/build/src/crypto/crypto";
import { submission } from "../models/submission.model";

export class submissionReadDTO {
  _id: string;
  userId: string;
  quiz: string;
  startDate: number;
  status: "DOING" | "SUBMITTED";

  static fromSubmission(submission: submission) {
    if (!submission) return submission;
    const submissionRead = new submissionReadDTO();
    submissionRead._id = submission._id.toString();
    submissionRead.userId = submission.userId.toString();
    submissionRead.startDate = submission.startDate;
    submissionRead.status = submission.status;
    return submissionRead;
  }

  static fromArray(submissions: submission[]) {
    return submissions.map((s) => this.fromSubmission(s));
  }
}
