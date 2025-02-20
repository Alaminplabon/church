import Review from './review.models';

const createreview = async (
  creatorId: string,
  reciverId: string,
  description: string,
) => {
  const newReview = await Review.create({ creatorId, reciverId, description });
  return newReview;
};

const getAllreview = async () => {
  const reviews = await Review.find().populate('creatorId reciverId');
  return reviews;
};

const getreviewById = async (id: string) => {
  const review = await Review.find({ reciverId: id }).populate('creatorId');
  return review;
};

const updatereview = async (id: string, description: string) => {
  const updatedReview = await Review.findByIdAndUpdate(
    id,
    { description },
    { new: true },
  );
  return updatedReview;
};

const deletereview = async (id: string) => {
  const deletedReview = await Review.findByIdAndDelete(id);
  return deletedReview;
};

export const reviewService = {
  createreview,
  getAllreview,
  getreviewById,
  updatereview,
  deletereview,
};
