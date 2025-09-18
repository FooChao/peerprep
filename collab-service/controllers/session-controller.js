import { SessionModel } from "../models/session-model.js";
import * as z from "zod";
export function createSession(req, res) {
  try {
    SessionModel.parse(req.body);
    const { sessionId, user1Id, user2Id, questionDifficulty, questionTopic } =
      req.body;
    //check if sessionId already exists in redis, if exist return session info
    console.log("Getting question from question service..");
    //temp mock question
    const question = {
      title: "2 sum",
      difficulty: "Easy",
      description: "return indexes of two elements that add up to target",
      input: "target = 5, nums = [1,2,3]",
    };
    res.status(201).json({
      message: `Created new session ${sessionId} successfully`,
      question,
      sessionId,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request body" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
