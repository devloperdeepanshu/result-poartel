import mongoose from "mongoose";
import Location from "../models/Location.js";
import Result from "../models/Result.js";
import publishDueResults from "../utils/publishDueResults.js";

function validNumber(value) {
  return (
    (typeof value === "string" || typeof value === "number") &&
    /^\d{1,2}$/.test(String(value).trim())
  );
}

async function getPublicResults(req, res) {
  try {
    await publishDueResults();

    const now = new Date();
    const locations = await Location.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    const rows = await Promise.all(
      locations.map(async (location) => {
        const current = await Result.findOne({
          location: location._id,
          status: "published",
          expiresAt: { $gt: now },
        })
          .sort({ publishedAt: -1 })
          .select("number publishedAt expiresAt")
          .lean();

        const waiting = await Result.findOne({
          location: location._id,
          status: "waiting",
        })
          .sort({ publishAt: 1 })
          .select("_id publishAt")
          .lean();

        return {
          location: {
            id: String(location._id),
            name: location.name,
          },
          current: current
            ? {
                number: current.number,
                publishedAt: current.publishedAt,
                expiresAt: current.expiresAt,
              }
            : null,
          // Never send a waiting result number to the public.
          waiting: waiting
            ? {
                status: "WAITING",
                publishAt: waiting.publishAt,
              }
            : null,
        };
      })
    );

    return res.json({ success: true, results: rows });
  } catch (error) {
    console.error("Public results error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load results.",
    });
  }
}

async function getMonthlyHistory(req, res) {
  try {
    await publishDueResults();

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2200
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid month (1-12) and year (2000-2200).",
      });
    }

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const results = await Result.find({
      status: { $in: ["published", "expired"] },
      publishedAt: { $gte: start, $lt: end },
    })
      .populate("location", "name")
      .sort({ publishedAt: -1 })
      .select("location number status publishedAt expiresAt")
      .lean();

    return res.json({
      success: true,
      month,
      year,
      history: results.map((item) => ({
        id: String(item._id),
        location: item.location
          ? {
              id: String(item.location._id),
              name: item.location.name,
            }
          : null,
        number: item.number,
        status: item.status,
        publishedAt: item.publishedAt,
        expiresAt: item.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Monthly history error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load monthly history.",
    });
  }
}

async function getAdminResults(req, res) {
  try {
    await publishDueResults();

    const locations = await Location.find()
      .sort({ name: 1 })
      .lean();

    const results = await Result.find({
      status: { $in: ["waiting", "published"] },
    })
      .populate("location", "name isActive")
      .sort({ publishAt: 1 })
      .lean();

    return res.json({
      success: true,
      locations,
      results,
    });
  } catch (error) {
    console.error("Admin results error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load admin results.",
    });
  }
}

async function replaceLocationResults(req, res) {
  try {
    const { locationId: currentLocationId } = req.params;

    const {
      currentNumber,
      waitingLocationId,
      publishAt,
    } = req.body ?? {};

    if (!mongoose.isValidObjectId(currentLocationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid current location ID.",
      });
    }

    if (!validNumber(currentNumber)) {
      return res.status(400).json({
        success: false,
        message: "Current number must be a whole number from 0 to 99.",
      });
    }

    const currentLocation = await Location.findOne({
      _id: currentLocationId,
      isActive: true,
    });

    if (!currentLocation) {
      return res.status(404).json({
        success: false,
        message: "Current location not found.",
      });
    }

    const hasSchedule =
      publishAt !== undefined &&
      publishAt !== null &&
      String(publishAt).trim() !== "";

    let waitingLocation = null;
    let scheduledAt = null;

    if (hasSchedule) {
      if (!waitingLocationId ||
          !mongoose.isValidObjectId(waitingLocationId)) {
        return res.status(400).json({
          success: false,
          message: "Select a valid waiting location.",
        });
      }

      waitingLocation = await Location.findOne({
        _id: waitingLocationId,
        isActive: true,
      });

      if (!waitingLocation) {
        return res.status(404).json({
          success: false,
          message: "Waiting location not found.",
        });
      }

      scheduledAt = new Date(publishAt);

      if (
        Number.isNaN(scheduledAt.getTime()) ||
        scheduledAt.getTime() <= Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message: "Waiting date and time must be in the future.",
        });
      }
    }

    const now = new Date();

    // Expire the previous current result for the selected current location.
    // Its published history is retained.
    await Result.updateMany(
      {
        location: currentLocation._id,
        status: "published",
      },
      { $set: { status: "expired" } }
    );

    // Create the new current result.
    const newCurrent = await Result.create({
      location: currentLocation._id,
      number: String(Number(currentNumber)).padStart(2, "0"),
      status: "published",
      publishAt: now,
      publishedAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });

    let newWaiting = null;

    if (hasSchedule && waitingLocation && scheduledAt) {
      // Replace only the previous waiting entry for this waiting location.
      // Do not expire that location's current published result.
      await Result.deleteMany({
        location: waitingLocation._id,
        status: "waiting",
      });

      // No waiting number is stored or returned publicly.
      newWaiting = await Result.create({
        location: waitingLocation._id,
        status: "waiting",
        publishAt: scheduledAt,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Current result saved and waiting result scheduled.",
      current: {
        id: String(newCurrent._id),
        location: currentLocation.name,
        number: newCurrent.number,
      },
      waiting: newWaiting
        ? {
            id: String(newWaiting._id),
            location: waitingLocation.name,
            status: "WAITING",
            publishAt: newWaiting.publishAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Replace results error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Result data is invalid. Check the Result model schema.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Could not save results.",
    });
  }
}

async function deleteResult(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID.",
      });
    }

    const result = await Result.findById(req.params.id);

    if (
      !result ||
      !["waiting", "published"].includes(result.status)
    ) {
      return res.status(404).json({
        success: false,
        message: "Active result not found.",
      });
    }

    if (result.status === "waiting") {
      await result.deleteOne();
    } else {
      result.status = "expired";
      await result.save();
    }

    return res.json({
      success: true,
      message: "Result removed from active results.",
    });
  } catch (error) {
    console.error("Delete result error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not delete result.",
    });
  }
}

export {
  getPublicResults,
  getMonthlyHistory,
  getAdminResults,
  replaceLocationResults,
  deleteResult,
};