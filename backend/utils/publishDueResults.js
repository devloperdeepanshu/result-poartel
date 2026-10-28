import Result from "../models/Result.js";

async function publishDueResults() {
  const now = new Date();

  // Expire current results after 24 hours.
  await Result.updateMany(
    {
      status: "published",
      expiresAt: { $ne: null, $lte: now },
    },
    {
      $set: { status: "expired" },
    }
  );

  // Waiting results intentionally remain waiting.
  // They have no number, so the scheduler must not publish them automatically.
}

export default publishDueResults;