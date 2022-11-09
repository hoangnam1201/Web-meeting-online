import { fromArrayBufferToHex } from "google-auth-library/build/src/crypto/crypto";
import { submission } from "../models/submission.model";

export class submissionReadDetailDTO {
  _id: string;
  userId: string;
  quiz: string;
  startDate: number;
  status: "DOING" | "SUBMITTED";
  answers: {
    questionId: string;
    answerIds: any[];
  }[];

  static fromSubmission(submission: submission) {
    if(!submission) return null;
    const submissionRead = new submissionReadDetailDTO();
    submissionRead._id = submission._id.toString();
    submissionRead.userId = submission.userId.toString();
    submissionRead.startDate = submission.startDate;
    submissionRead.status = submission.status;
    submissionRead.answers = submission.answers.map((a) => ({
      answerIds: a.answerIds,
      questionId: a.questionId.toString(),
    }));
    return submissionRead;
  }

  static fromArray(submissions: submission[]) {
    return submissions.map((s) => this.fromSubmission(s));
  }
}
