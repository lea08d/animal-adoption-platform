import Dog from "../models/Dog";

export async function getAnimals(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const dogs = await Dog.find({})
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json(dogs);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get animals",
      error: error.message,
    });
  }
}